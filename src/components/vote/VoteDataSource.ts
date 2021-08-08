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

  /**
   * Finds a vote by a `definition` id
   * @param definition the definition's id
   * @returns the vote document
   */

  async get(definition: Types.ObjectId | string) {
    if (!isValidObjectId(definition)) return null;
    const voter = this.context.user?._id;
    const vote = await this.model.findOne({ definition, voter });
    return this.populate(vote);
  }

  /**
   *  Deletes a vote by a `definition` id and its voter (from the context)
   * @param definition the definition's id
   * @returns the deleted vote document
   */

  async remove(definition: Types.ObjectId | string) {
    if (!isValidObjectId(definition)) return null;
    const voter = this.context.user?._id;
    const vote = await this.model.findOneAndDelete({ definition, voter });
    return this.populate(vote);
  }

  /**
   * Updates a vote by a `definition` id and its voter (from the context), if it's not found, the vote is inserted
   * @param definition the definition's id
   * @param action a number between -1 and 1
   * @returns the updated or inserted vote document
   */

  async upsert(definition: Types.ObjectId | string, action: number) {
    if (!isValidObjectId(definition)) return null;
    const voter = this.context.user?._id;
    const vote = await this.model.findOneAndUpdate(
      { definition, voter },
      { action },
      { new: true, upsert: true },
    );
    return this.populate(vote);
  }
}
