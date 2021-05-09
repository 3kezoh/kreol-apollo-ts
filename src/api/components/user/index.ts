import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import User from "./User";
export { IUser } from "./User";

export default {
  typeDefs: [typeDefs],
  resolvers,
  User,
};
