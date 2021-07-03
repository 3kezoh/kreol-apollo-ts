import { IUserDocument } from "@User";
import { LeanDocument } from "mongoose";
import { DataSources } from "./dataSources";

export type Context = UserContext & DataSourcesContext;

export type UserContext = {
  user?: LeanDocument<IUserDocument>;
};

export type DataSourcesContext = {
  dataSources: DataSources;
};
