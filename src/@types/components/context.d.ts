import { IUserDocument } from "@User";
import { ExpressContext } from "apollo-server-express";
import { LeanDocument } from "mongoose";
import { DataSources } from "./dataSources";

export type Context = UserContext & DataSourcesContext & ExpressContext;

export type UserContext = {
  user?: LeanDocument<IUserDocument>;
};

export type DataSourcesContext = {
  dataSources: DataSources;
};
