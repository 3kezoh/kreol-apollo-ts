import { Context } from "@@api";
import { IUserDocument } from "@User";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { Model } from "mongoose";

class UserDataSource extends DataSource<Context> {
  model: Model<IUserDocument>;

  context!: Context;

  constructor(model: Model<IUserDocument>) {
    super();
    this.model = model;
  }

  initialize({ context }: DataSourceConfig<Context>) {
    this.context = context;
  }

  async getUser(id: string) {
    return this.model.findById(id);
  }
}

export default UserDataSource;
