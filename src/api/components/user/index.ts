import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import User, { IUser, IUserDocument } from "./User";
import UserDataSource from "./UserDataSource";

export { User, UserDataSource, IUser, IUserDocument };

export default {
  typeDefs,
  resolvers,
};
