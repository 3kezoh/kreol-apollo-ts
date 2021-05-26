import { DefinitionDataSource } from "@Definition";
import { IUserDocument, UserDataSource } from "@User";
import { VoteDataSource } from "@Vote";
import { DocumentNode } from "graphql";
import { LeanDocument, Types } from "mongoose";
import { DefinitionSubscription, SubscriptionDefinitionArgs } from "./args";

export * from "./args";

type Maybe<T> = T | null | undefined;

export type Context = {
  user?: LeanDocument<IUserDocument>;
};

export type DataSources = {
  definition: DefinitionDataSource;
  user: UserDataSource;
  vote: VoteDataSource;
};

export type DataSourcesContext = {
  dataSources: DataSources;
};

export type Resolver<TArgs, R> = (
  source: unknown,
  args: TArgs,
  context: Context & DataSourcesContext,
  info: unknown,
) => Promise<R>;

export type Component = {
  typeDefs: DocumentNode[];
  resolvers: Resolver;
};

export type Validator<TArgs> = (args: TArgs) => void;

export type Match = {
  author?: Types.ObjectId | string;
  word?: RegExp;
};

export type AggregationArgs = {
  page?: Maybe<number>;
  limit?: Maybe<number>;
};

export type DefinitionSubscriptionPayload = {
  definition: DefinitionSubscription;
};

export type DefinitionSubscriptionFilter = (
  payload: DefinitionSubscriptionPayload,
  variables: SubscriptionDefinitionArgs,
) => boolean;
