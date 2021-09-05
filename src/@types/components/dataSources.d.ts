import type { DefinitionDataSource } from "@Definition";
import type { ReportDataSource } from "@Report";
import type { UserDataSource } from "@User";
import type { VoteDataSource } from "@Vote";

export type DataSources = {
  definition: DefinitionDataSource;
  user: UserDataSource;
  vote: VoteDataSource;
  report: ReportDataSource;
};
