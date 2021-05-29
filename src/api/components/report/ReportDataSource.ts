import { Context, Maybe } from "@@api";
import { IReportDocument } from "@Report";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { Model, Types } from "mongoose";

class ReportDataSource extends DataSource<Context> {
  model: Model<IReportDocument>;

  context!: Context;

  constructor(model: Model<IReportDocument>) {
    super();
    this.model = model;
  }

  initialize({ context }: DataSourceConfig<Context>) {
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

export default ReportDataSource;
