import {
  Context,
  Match,
  MutationCreateDefinitionArgs,
  QueryCountArgs,
  QueryDefinitionsArgs,
  QueryPopularArgs,
  QuerySearchArgs,
} from "@@api";
import { IDefinitionDocument } from "@Definition";
import { IUserDocument } from "@User";
import { escapeRegExp } from "@utils";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { isValidObjectId, Model, Types } from "mongoose";

const BY_SCORE = { score: -1, createdAt: 1 };
const BY_DATE = { createdAt: -1 };

class DefinitionDataSource extends DataSource<Context> {
  model: Model<IDefinitionDocument>;

  context!: Context;

  constructor(model: Model<IDefinitionDocument>) {
    super();
    this.model = model;
  }

  initialize({ context }: DataSourceConfig<Context>) {
    this.context = context;
  }

  async create({ word, meaning, example, language }: MutationCreateDefinitionArgs, author: IUserDocument) {
    return this.model.create({ word, meaning, example, author, language });
  }

  async count({ filter }: QueryCountArgs) {
    if (!isValidObjectId(filter?.author)) return 0;
    const match: Match = {};
    if (filter?.word) match.word = escapeRegExp(filter.word);
    if (filter?.author) match.author = new Types.ObjectId(filter.author);
    return this.model.countDocuments(match);
  }

  async get(id: string) {
    return this.model.findById(id).populate("author");
  }

  async list({ filter, page, limit }: QueryDefinitionsArgs) {
    if (!isValidObjectId(filter?.author)) return [];
    const match: Match = {};
    if (filter?.word) match.word = escapeRegExp(filter.word);
    if (filter?.author) match.author = new Types.ObjectId(filter.author);
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1 || limit > 100) limit = 5;

    const aggregate = this.model.aggregate([
      { $match: match },
      { $sort: match?.word ? BY_SCORE : BY_DATE },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $set: { id: "$_id" } },
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

    const definitions: IDefinitionDocument[] = await aggregate.exec();

    return this.model.populate(definitions, { path: "author" });
  }

  async popular({ letter, limit }: QueryPopularArgs) {
    if (!limit || limit < 1 || limit > 100) limit = 50;
    if (!letter || ![..."abcdefghijklmnopqrstuvwxyz"].includes(letter)) letter = "a";

    const definitions: IDefinitionDocument[] = await this.model.aggregate([
      { $match: { word: new RegExp(`^${letter}`, "i") } },
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

    const definitions: IDefinitionDocument[] = await this.model.aggregate([
      { $match: { word: new RegExp(`^${match?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i") } },
      { $sort: BY_SCORE },
      { $group: { _id: "$word", doc: { $first: "$$ROOT" } } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $replaceRoot: { newRoot: "$doc" } },
      { $set: { id: "$_id" } },
    ]);

    return this.model.populate(definitions, { path: "author" });
  }

  async remove(_id: string, author: Types.ObjectId | undefined): Promise<IDefinitionDocument | null> {
    if (!isValidObjectId(_id)) return null;
    return this.model.findOneAndDelete({ _id, author }).populate("author");
  }

  async updateScore(id: Types.ObjectId, score: number): Promise<IDefinitionDocument | null> {
    return this.model.findByIdAndUpdate(id, { $inc: { score } }, { new: true });
  }
}

export default DefinitionDataSource;
