import { DefinitionDataSource } from "@Definition";
import { ReportDataSource } from "@Report";
import { UserDataSource } from "@User";
import { VoteDataSource } from "@Vote";

export type DataSources = {
  definition: DefinitionDataSource;
  user: UserDataSource;
  vote: VoteDataSource;
  report: ReportDataSource;
};
