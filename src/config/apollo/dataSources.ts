import { Definition, DefinitionDataSource } from "@Definition";

const dataSources = () => ({
  definition: new DefinitionDataSource(Definition),
});

export default dataSources;
