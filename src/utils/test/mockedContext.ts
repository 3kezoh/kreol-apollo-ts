import { Context, DataSourcesContext } from "@@api";
import { Definition, DefinitionDataSource } from "@Definition";
import { Report, ReportDataSource } from "@Report";
import { User, UserDataSource } from "@User";
import { mockedUser } from "@test";
import { Vote, VoteDataSource } from "@Vote";

const mockedContext: Context & DataSourcesContext = {
  dataSources: {
    definition: new DefinitionDataSource(Definition),
    user: new UserDataSource(User),
    vote: new VoteDataSource(Vote),
    report: new ReportDataSource(Report),
  },
  user: mockedUser,
};

export default mockedContext;
