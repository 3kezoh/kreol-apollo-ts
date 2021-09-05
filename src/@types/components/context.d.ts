import type { IUserDocument } from "@User";
import type { LeanDocument } from "mongoose";
import type { DataSources } from "./dataSources";

export type Context = UserContext & DataSourcesContext;

export type UserContext = {
  user?: LeanDocument<IUserDocument>;
};

export type DataSourcesContext = {
  dataSources: DataSources;
};
