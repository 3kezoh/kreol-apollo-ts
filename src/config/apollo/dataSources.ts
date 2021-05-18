import { DataSources } from "@@api";
import { Definition, DefinitionDataSource } from "@Definition";
import { User, UserDataSource } from "@User";
import { Vote, VoteDataSource } from "@Vote";

const dataSources = (): DataSources => ({
  definition: new DefinitionDataSource(Definition),
  user: new UserDataSource(User),
  vote: new VoteDataSource(Vote),
});

export default dataSources;
