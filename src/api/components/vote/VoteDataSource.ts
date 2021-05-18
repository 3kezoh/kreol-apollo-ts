import { Context } from "@@api";
import { IVoteDocument } from "@Vote";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { Model, Types } from "mongoose";

class VoteDataSource extends DataSource<Context> {
  model: Model<IVoteDocument>;

  context!: Context;

  constructor(model: Model<IVoteDocument>) {
    super();
    this.model = model;
  }

  initialize({ context }: DataSourceConfig<Context>) {
    this.context = context;
  }

  async populate(vote: IVoteDocument | null) {
    return this.model.populate(vote, { path: "definition voter" });
  }

  async get(definition: Types.ObjectId, voter: Types.ObjectId) {
    const vote = await this.model.findOne({ definition, voter });
    return this.populate(vote);
  }

  async delete(definition: Types.ObjectId, voter: Types.ObjectId) {
    const vote = await this.model.findOneAndDelete({ definition, voter });
    return this.populate(vote);
  }

  async upsert(definition: Types.ObjectId, voter: Types.ObjectId, action: number) {
    const vote = await this.model.findOneAndUpdate(
      { definition, voter },
      { action },
      { new: true, upsert: true },
    );
    return this.populate(vote);
  }
}

export default VoteDataSource;
