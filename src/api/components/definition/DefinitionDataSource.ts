import { DataSource, DataSourceConfig } from "apollo-datasource";
import { IDefinitionDocument } from "@Definition";
import { Context, Match } from "@@api";
import { Model } from "mongoose";

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

  async getDefinition(id: string) {
    return this.model.findById(id).populate("author");
  }

  async getDefinitions(match: Match, page: number, limit: number) {
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

  async getCount(match: Match) {
    return this.model.countDocuments(match);
  }

  async getPopular(letter: string, limit: number) {
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

  async search(match: string | null | undefined, page: number, limit: number) {
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
}

export default DefinitionDataSource;
