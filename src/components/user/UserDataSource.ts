import { Context, MutationSignupArgs } from "@@components";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { InMemoryLRUCache, KeyValueCache } from "apollo-server-caching";
import { FilterQuery, Model } from "mongoose";
import { IUserDocument } from "./User";

export class UserDataSource extends DataSource<Context> {
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

  async get(id: string) {
    return this.model.findById(id);
  }

  async getBy(filter: FilterQuery<IUserDocument>) {
    return this.model.findOne(filter);
  }

  async create({ email, password, name }: Omit<MutationSignupArgs, "confirmPassword">) {
    return this.model.create({ email, password, name });
  }
}
