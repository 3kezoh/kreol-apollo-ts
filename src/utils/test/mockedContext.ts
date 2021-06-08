import { Context } from "@@components";
import { Definition, DefinitionDataSource } from "@Definition";
import { Report, ReportDataSource } from "@Report";
import { User, UserDataSource } from "@User";
import { Vote, VoteDataSource } from "@Vote";
import { mockedUser } from "./mockedUser";

export const mockedContext: Context = {
  dataSources: {
    definition: new DefinitionDataSource(Definition),
    user: new UserDataSource(User),
    vote: new VoteDataSource(Vote),
    report: new ReportDataSource(Report),
  },
  user: mockedUser.document,
};
