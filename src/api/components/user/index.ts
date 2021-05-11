import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import User, { IUser, IUserDocument } from "./User";

export { User, IUser, IUserDocument };

export default {
  typeDefs: [typeDefs],
  resolvers,
  User,
};
