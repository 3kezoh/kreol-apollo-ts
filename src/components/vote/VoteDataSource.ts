import { UserContext } from "@@components";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { isValidObjectId, Model, Types } from "mongoose";
import { IVoteDocument } from "./Vote";

export class VoteDataSource extends DataSource<UserContext> {
  model: Model<IVoteDocument>;

  context!: UserContext;

  constructor(model: Model<IVoteDocument>) {
    super();
    this.model = model;
  }

  initialize({ context }: DataSourceConfig<UserContext>) {
    this.context = context;
  }

  async populate(vote: IVoteDocument | null) {
    return this.model.populate(vote, { path: "definition voter" });
  }

  async get(definition: Types.ObjectId | string, voter: Types.ObjectId) {
    if (!isValidObjectId(definition)) return null;
    const vote = await this.model.findOne({ definition, voter });
    return this.populate(vote);
  }

  async remove(definition: Types.ObjectId, voter: Types.ObjectId) {
    const vote = await this.model.findOneAndDelete({ definition, voter });
    return this.populate(vote);
  }

  async upsert(definition: Types.ObjectId | string, voter: Types.ObjectId, action: number) {
    const vote = await this.model.findOneAndUpdate(
      { definition, voter },
      { action },
      { new: true, upsert: true },
    );
    return this.populate(vote);
  }
}
