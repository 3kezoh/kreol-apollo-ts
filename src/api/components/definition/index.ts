import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import Definition, { IDefinition, IDefinitionDocument, IDefinitionPopulatedDocument } from "./Definition";

export { Definition, IDefinition, IDefinitionDocument, IDefinitionPopulatedDocument };

export default {
  typeDefs: [typeDefs],
  resolvers,
};
