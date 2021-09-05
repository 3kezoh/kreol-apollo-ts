import type { IResolvers } from "apollo-server-express";
import type { GraphQLSchema, DocumentNode } from "graphql";
import type { Types } from "mongoose";
import type { DefinitionSubscription, SubscriptionDefinitionArgs } from "./args";
import type { Context } from "./context";

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
  transformer?: (schema: GraphQLSchema) => GraphQLSchema;
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
