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

  async create(args: MutationCreateDefinitionArgs) {
    const author = this.context.user;
    return this.model.create({ ...args, author });
  }

  async count({ filter }: QueryCountArgs) {
    if (!isValidObjectId(filter?.author)) return 0;
    const match: Match = { reviewed: true };
    if (filter?.word) match.word = escapeRegExp(filter.word);
    if (filter?.author) match.author = new Types.ObjectId(filter.author);
    return this.model.countDocuments(match);
  }

  async get(_id: string, ttl?: number) {
    if (!isValidObjectId(_id)) return null;
    const cachedDefinition = await this.cache.get(_id);
    if (cachedDefinition) return JSON.parse(cachedDefinition) as IDefinitionDocument;
    const definition = await this.model.findOne({ _id, reviewed: true }).populate("author").lean();
    if (ttl) this.cache.set(_id, JSON.stringify(definition), { ttl });
    return definition;
  }

  async list({ filter, page, limit, sortBy }: QueryDefinitionsArgs) {
    if (!isValidObjectId(filter?.author)) return [];

    const match: Match = { reviewed: true };
    if (filter?.word) match.word = escapeRegExp(filter.word);
    if (filter?.author) match.author = new Types.ObjectId(filter.author);
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1 || limit > 100) limit = 5;

    const sort: Sort = BY_DATE;
    if (sortBy) {
      const { createdAt, score } = sortBy;
      if (createdAt && [1, -1].includes(createdAt)) sort.createdAt = createdAt;
      if (score && [1, -1].includes(score)) sort.score = score;
    }

    // match?.word ? BY_SCORE : BY_DATE

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

  async popular({ letter, limit }: QueryPopularArgs) {
    if (!limit || limit < 1 || limit > 100) limit = 50;
    if (!letter || ![..."abcdefghijklmnopqrstuvwxyz"].includes(letter)) letter = "a";

    const match: Match = { reviewed: true };
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

  async search({ match, page, limit }: QuerySearchArgs) {
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1 || limit > 100) limit = 5;

    const _match: Match = { reviewed: true };
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

  async remove(_id: string) {
    if (!isValidObjectId(_id)) return null;
    const author = this.context.user?._id;
    return this.model.findOneAndDelete({ _id, author }).populate("author");
  }

  async review(_id: string) {
    if (!isValidObjectId) return null;
    return this.model
      .findByIdAndUpdate(_id, { reviewed: true }, { new: true, lean: true })
      .populate("author");
  }

  async updateScore(id: Types.ObjectId | string, score: number) {
    if (!isValidObjectId(id)) return null;
    if (!isValidObjectId) return null;
    return this.model.findByIdAndUpdate(id, { $inc: { score } }, { new: true }).populate("author");
  }
}
