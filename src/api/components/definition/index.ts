import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import Definition, { IDefinition, IDefinitionDocument, IDefinitionPopulatedDocument } from "./Definition";
import DefinitionDataSource from "./DefinitionDataSource";
import definitionValidation from "./definitionValidation";

export {
  Definition,
  DefinitionDataSource,
  definitionValidation,
  IDefinition,
  IDefinitionDocument,
  IDefinitionPopulatedDocument,
};

export default {
  typeDefs: [typeDefs],
  resolvers,
};
