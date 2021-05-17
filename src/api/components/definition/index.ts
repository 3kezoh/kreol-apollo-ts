import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import Definition, { IDefinition, IDefinitionDocument, IDefinitionPopulatedDocument } from "./Definition";
import DefinitionDataSource from "./DefinitionDataSource";

export { Definition, DefinitionDataSource, IDefinition, IDefinitionDocument, IDefinitionPopulatedDocument };

export default {
  typeDefs: [typeDefs],
  resolvers,
};
