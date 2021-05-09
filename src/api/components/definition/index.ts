import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import Definition from "./Definition";

export { IDefinition } from "./Definition";

export default {
  typeDefs: [typeDefs],
  resolvers,
  Definition,
};
