import { IResolvers, SchemaDirectiveVisitor } from "apollo-server-express";
import { DocumentNode } from "graphql";
import { Types } from "mongoose";
import { DefinitionSubscription, SubscriptionDefinitionArgs } from "./args";
import { Context } from "./context";

export * from "./args";
export * from "./context";
export * from "./dataSources";
export * from "./jwt";

type Maybe<T> = T | undefined;

export type AsyncResolver<TArgs, R> = (
  source: unknown,
  args: TArgs,
  context: Context,
  info: unknown,
) => Promise<R>;

export type Resolver<TArgs, R> = (source: unknown, args: TArgs, context: Context, info: unknown) => R;

export type Component = {
  typeDefs: DocumentNode;
  resolvers: AsyncResolver;
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

export type Sort = {
  [i: string]: number;
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
