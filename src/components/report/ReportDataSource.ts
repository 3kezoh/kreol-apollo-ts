import { UserContext, Maybe } from "@@components";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { isValidObjectId, Model, Types } from "mongoose";
import { IReportDocument } from "./Report";

export class ReportDataSource extends DataSource<UserContext> {
  model: Model<IReportDocument>;

  context!: UserContext;

  constructor(model: Model<IReportDocument>) {
    super();
    this.model = model;
  }

  initialize({ context }: DataSourceConfig<UserContext>) {
    this.context = context;
  }

  /**
   * Creates a report
   * @param definition the definition's id
   * @param reason a number between 0 and 3
   * @param message if the reason is 3, a message is expected
   * @returns the created report document
   */

  async create(definition: Types.ObjectId | string, reason: number, message: Maybe<string>) {
    if (!isValidObjectId(definition)) return null;
    const reporter = this.context.user;
    const report = await this.model.create({ definition, reason, reporter, message });
    return this.model.populate(report, {
      path: "definition reporter",
      populate: { path: "author" },
    });
  }

  /**
   * Finds a report by a `definition` id and reporter (from the context)
   * @param definition the definitions id's
   * @returns the report document
   */

  async get(definition: Types.ObjectId | string): Promise<IReportDocument | null> {
    const reporter = this.context.user?._id;
    const report = await this.model.findOne({ definition, reporter });
    return this.model.populate(report, {
      path: "definition reporter",
      populate: { path: "author" },
    });
  }

  /**
   * @param definition the definition's id
   * @returns a list of reports for a given `definition` id
   */

  async list(definition: Types.ObjectId | string): Promise<IReportDocument[] | null> {
    const reports = await this.model.find({ definition });
    return this.model.populate(reports, "definition definition.author reporter");
  }

  /**
   * Deletes a report by a `definition` id and a `reporter` id
   * @admin
   * @param definition the definition's id
   * @param reporter the reporter's id
   * @returns the deleted report document
   */

  async remove(definition: Types.ObjectId, reporter: Types.ObjectId): Promise<IReportDocument | null> {
    const report = await this.model.findOneAndDelete({ definition, reporter });
    return this.model.populate(report, {
      path: "definition reporter",
      populate: { path: "author" },
    });
  }
}
