import { UserContext, MutationUpdateUserArgs, MutationCreateUserArgs } from "@@components";
import { DataSource, DataSourceConfig } from "apollo-datasource";
import { InMemoryLRUCache, KeyValueCache } from "apollo-server-caching";
import { FilterQuery, Model, Types } from "mongoose";
import { IUserDocument } from "./User";

export class UserDataSource extends DataSource<UserContext> {
  model: Model<IUserDocument>;

  context!: UserContext;

  cache!: KeyValueCache<string>;

  constructor(model: Model<IUserDocument>) {
    super();
    this.model = model;
  }

  initialize({ context, cache }: DataSourceConfig<UserContext>) {
    this.context = context;
    this.cache = cache || new InMemoryLRUCache();
  }

  /**
   * Finds a user by its `id`
   * @param {string} id the user's id
   * @returns the user document
   */

  async get(id: string | Types.ObjectId) {
    return this.model.findById(id);
  }

  /**
   * Finds a user matching the `filter`
   * @param filter an object representing a user
   * @returns the matching user document
   */

  async getBy(filter: FilterQuery<IUserDocument>) {
    return this.model.findOne(filter);
  }

  /**
   * Creates a user
   * @param args an object containing the user's arguments
   * @returns the created user document
   */

  async create({ email, password, name }: MutationCreateUserArgs) {
    return this.model.create({ email, password, name });
  }

  /**
   *  Removes a user by its `id`
   * @param id the user's id
   * @returns the deleted user document
   */

  async remove(id: string) {
    return this.model.findByIdAndDelete(id).populate("author");
  }

  /**
   * Updates a user by its id
   * @param update an object containing the user's arguments to update
   * @returns the updated user document
   */

  async update({ id, email, name }: MutationUpdateUserArgs) {
    return this.model.findByIdAndUpdate(id, { email, name }, { new: true }).populate("author");
  }
}
