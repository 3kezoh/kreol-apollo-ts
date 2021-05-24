import { Context } from "@@api";
import { IUserDocument } from "@User";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { Model } from "mongoose";
import { InMemoryLRUCache, KeyValueCache } from "apollo-server-caching";

class UserDataSource extends DataSource<Context> {
  model: Model<IUserDocument>;

  context!: Context;

  cache!: KeyValueCache<string>;

  constructor(model: Model<IUserDocument>) {
    super();
    this.model = model;
  }

  initialize({ context, cache }: DataSourceConfig<Context>) {
    this.context = context;
    this.cache = cache || new InMemoryLRUCache();
  }

  async getUser(id: string) {
    return this.model.findById(id);
  }
}

export default UserDataSource;
