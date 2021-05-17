import { Types } from "mongoose";
import { IUserDocument } from "@User";
import { DefinitionDataSource } from "@Definition";

export * from "./args";

export type Context = {
  user?: IUserDocument;
};

export type DataSourceContext = {
  dataSources: {
    definition: DefinitionDataSource;
  };
};

export type Resolver<TArgs, R> = (
  source: unknown,
  args: TArgs,
  context: Context & DataSourceContext,
  info: unknown,
) => Promise<R>;

export type Validator<TArgs> = (args: TArgs) => void;

export type Match = {
  author?: Types.ObjectId | string;
  word?: RegExp;
};
