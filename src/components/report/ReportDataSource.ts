import { UserContext, Maybe } from "@@components";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { Model, Types } from "mongoose";
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

  async create(definition: Types.ObjectId, reporter: Types.ObjectId, reason: number, message: Maybe<string>) {
    const report = await this.model.create({ definition, reason, reporter, message });
    return this.model.populate(report, "definition definition.author reporter");
  }

  async get(definition: Types.ObjectId | string, reporter: Types.ObjectId): Promise<IReportDocument | null> {
    const report = await this.model.findOne({ definition, reporter });
    return this.model.populate(report, "definition definition.author reporter");
  }

  async list(definition: Types.ObjectId | string): Promise<IReportDocument[] | null> {
    const reports = await this.model.find({ definition });
    return this.model.populate(reports, "definition definition.author reporter");
  }

  async remove(definition: Types.ObjectId, reporter: Types.ObjectId): Promise<IReportDocument | null> {
    const report = await this.model.findOneAndDelete({ definition, reporter });
    return this.model.populate(report, "definition definition.author reporter");
  }
}
