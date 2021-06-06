import { DataSources } from "@@components";
import { Definition, DefinitionDataSource } from "@Definition";
import { Report, ReportDataSource } from "@Report";
import { User, UserDataSource } from "@User";
import { Vote, VoteDataSource } from "@Vote";

export const dataSources = (): DataSources => ({
  definition: new DefinitionDataSource(Definition),
  user: new UserDataSource(User),
  vote: new VoteDataSource(Vote),
  report: new ReportDataSource(Report),
});
