import { DefinitionDataSource } from "@Definition";
import { ReportDataSource } from "@Report";
import { IUserDocument, UserDataSource } from "@User";
import { VoteDataSource } from "@Vote";
import { SchemaDirectiveVisitor, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";
import { LeanDocument, Types } from "mongoose";
import { DefinitionSubscription, SubscriptionDefinitionArgs } from "./args";

export * from "./args";

type Maybe<T> = T | undefined;

export type Context = {
  user?: LeanDocument<IUserDocument>;
};

export type DataSources = {
  definition: DefinitionDataSource;
  user: UserDataSource;
  vote: VoteDataSource;
  report: ReportDataSource;
};

export type DataSourcesContext = {
  dataSources: DataSources;
};

export type Resolver<TArgs, R> = (
  source: unknown,
  args: TArgs,
  context: Context & DataSourcesContext,
  info: unknown,
) => Promise<R> | R;

export type Component = {
  typeDefs: DocumentNode;
  resolvers: Resolver;
};

export type Scalars = {
  typeDefs: DocumentNode;
  resolvers: IResolvers;
};

export type Directive = {
  typeDefs: DocumentNode;
  schema?: SchemaDirectiveVisitor;
};

export type Validator<TArgs> = (args: TArgs) => void;

export type Match = {
  author?: Types.ObjectId | string;
  word?: RegExp;
  reviewed: boolean;
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
