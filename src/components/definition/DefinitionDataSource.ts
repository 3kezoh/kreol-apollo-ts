import {
  Match,
  MutationCreateDefinitionArgs,
  QueryCountArgs,
  QueryDefinitionsArgs,
  QueryPopularArgs,
  QuerySearchArgs,
  Sort,
  UserContext,
} from "@@components";
import { escapeRegExp } from "@utils";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { InMemoryLRUCache, KeyValueCache } from "apollo-server-caching";
import { isValidObjectId, Model, Types } from "mongoose";
import { IDefinitionDocument, IDefinitionPopulated } from "./Definition";

const BY_SCORE = { score: -1, createdAt: 1 };
const BY_DATE = { createdAt: -1 };

export class DefinitionDataSource extends DataSource<UserContext> {
  model: Model<IDefinitionDocument>;

  context!: UserContext;

  cache!: KeyValueCache<string>;

  constructor(model: Model<IDefinitionDocument>) {
    super();
    this.model = model;
  }

  initialize({ context, cache }: DataSourceConfig<UserContext>) {
    this.context = context;
    this.cache = cache || new InMemoryLRUCache();
  }

  /**
   *  Creates a definition
   * @param args an object containing the definition arguments
   * @returns the created definition document
   */

  async create(args: MutationCreateDefinitionArgs) {
    const author = this.context.user;
    return this.model.create({ ...args, author });
  }

  /**
   * @param filter an object representing a definition
   * @returns the number of definition that match `filter`
   */

  async count({ filter }: QueryCountArgs) {
    if (!isValidObjectId(filter?.author)) return 0;
    // TODO reviewed true
    const match: Match = { reviewed: false };
    if (filter?.word) match.word = escapeRegExp(filter.word);
    if (filter?.author) match.author = new Types.ObjectId(filter.author);
    return this.model.countDocuments(match);
  }

  /**
   *  Finds a definition by his id, if `ttl` is specified, the definition is cached
   * @param _id the definition's id
   * @param ttl Specified in **seconds**
   * @returns the definition document
   */

  async get(_id: string, ttl?: number) {
    if (!isValidObjectId(_id)) return null;
    const cachedDefinition = await this.cache.get(_id);
    if (cachedDefinition) return JSON.parse(cachedDefinition) as IDefinitionDocument;
    // TODO reviewed true
    const definition = await this.model.findOne({ _id, reviewed: false }).populate("author").lean();
    if (ttl) this.cache.set(_id, JSON.stringify(definition), { ttl });
    return definition;
  }

  /**
   * @param filter an object representing certain fields of a  definition
   * @param page
   * @param limit the maximum number of definitions returned
   * @param sortBy follows the mongoDB sort syntax
   * @returns a list of definition documents
   */

  async list({ filter, page, limit, sortBy }: QueryDefinitionsArgs) {
    if (!isValidObjectId(filter?.author)) return [];

    // TODO reviewed true
    const match: Match = { reviewed: false };
    if (filter?.word) match.word = escapeRegExp(filter.word);
    if (filter?.author) match.author = new Types.ObjectId(filter.author);
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1 || limit > 100) limit = 5;

    const sort: Sort = BY_SCORE;
    if (sortBy) {
      const { createdAt, score } = sortBy;
      if (createdAt && [1, -1].includes(createdAt)) sort.createdAt = createdAt;
      if (score && [1, -1].includes(score)) sort.score = score;
    }

    const aggregate = this.model.aggregate([
      { $match: match },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "author" } },
      { $set: { author: { $first: "$author" } } },
      { $set: { id: "$_id", "author.id": "$author._id" } },
    ]);

    if (this.context.user) {
      aggregate.append([
        {
          $lookup: {
            from: "votes",
            let: { definitionId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$definition", "$$definitionId"] },
                      { $eq: ["$voter", this.context.user._id] },
                    ],
                  },
                },
              },
            ],
            as: "vote",
          },
        },
        { $set: { vote: { $first: "$vote" } } },
        { $set: { action: { $ifNull: ["$vote.action", 0] } } },
        { $project: { vote: 0 } },
      ]);
    }

    const definitions: IDefinitionPopulated[] = await aggregate.exec();

    return definitions;
  }

  /**
   * @param letter the first of the word
   * @param limit the maximum number of definitions returned
   * @returns a list of definition documents filtered by `letter` and sorted by score
   */

  async popular({ letter, limit }: QueryPopularArgs) {
    if (!limit || limit < 1 || limit > 100) limit = 50;
    if (!letter || ![..."abcdefghijklmnopqrstuvwxyz"].includes(letter)) letter = "a";

    // TODO reviewed true
    const match: Match = { reviewed: false };
    match.word = new RegExp(`^${letter}`, "i");

    const definitions: IDefinitionDocument[] = await this.model.aggregate([
      { $match: match },
      { $sort: BY_SCORE },
      { $group: { _id: "$word", score: { $sum: "$score" }, doc: { $first: "$$ROOT" } } },
      { $sort: BY_SCORE },
      { $limit: limit },
      { $replaceRoot: { newRoot: "$doc" } },
      { $set: { id: "$_id" } },
    ]);

    return this.model.populate(definitions, { path: "author" });
  }

  /**
   *
   * @param match the word to match
   * @param page
   * @param limit the maximum number of definitions returned
   * @returns a list of definition documents matching `match` and sorted by score
   */

  async search({ match, page, limit }: QuerySearchArgs) {
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1 || limit > 100) limit = 5;

    // TODO reviewed true
    const _match: Match = { reviewed: false };
    _match.word = new RegExp(`^${match?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");

    const definitions: IDefinitionDocument[] = await this.model.aggregate([
      { $match: _match },
      { $sort: BY_SCORE },
      { $group: { _id: "$word", doc: { $first: "$$ROOT" } } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $replaceRoot: { newRoot: "$doc" } },
      { $set: { id: "$_id" } },
    ]);

    return this.model.populate(definitions, { path: "author" });
  }

  /**
   * Deletes a definition by his id
   * @param _id the definition's id to delete
   * @returns
   */

  async remove(_id: string) {
    if (!isValidObjectId(_id)) return null;
    const author = this.context.user?._id;
    return this.model.findOneAndDelete({ _id, author }).populate("author");
  }

  /**
   * Marks the definition as **reviewed**
   * @admin
   * @param _id the definitions' is to review
   * @returns the reviewed definition document
   */

  async review(_id: string) {
    if (!isValidObjectId) return null;
    // TODO reviewed true
    return this.model
      .findByIdAndUpdate(_id, { reviewed: false }, { new: true, lean: true })
      .populate("author");
  }

  /**
   * Updates the score of a definition
   * @param id the definition's to update
   * @param score the new score
   * @returns the updated definition document
   */

  async updateScore(id: Types.ObjectId | string, score: number) {
    if (!isValidObjectId(id)) return null;
    if (!isValidObjectId) return null;
    return this.model.findByIdAndUpdate(id, { $inc: { score } }, { new: true }).populate("author");
  }
}
