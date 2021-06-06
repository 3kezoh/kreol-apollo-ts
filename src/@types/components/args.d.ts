export type Maybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  ObjectId: any;
};

export type AuthResponse = {
  __typename?: "AuthResponse";
  token?: Maybe<Scalars["String"]>;
  user?: Maybe<User>;
};

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE",
}

export type Definition = {
  __typename?: "Definition";
  id: Scalars["ID"];
  word: Scalars["String"];
  meaning: Scalars["String"];
  example?: Maybe<Scalars["String"]>;
  language: Scalars["String"];
  author: User;
  score: Scalars["Int"];
  createdAt: Scalars["Date"];
  action?: Maybe<Scalars["Int"]>;
};

export type DefinitionSubscription = {
  __typename?: "DefinitionSubscription";
  id: Scalars["ID"];
  score: Scalars["Int"];
};

export type Filter = {
  author?: Maybe<Scalars["ID"]>;
  word?: Maybe<Scalars["String"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  login?: Maybe<AuthResponse>;
  signup?: Maybe<AuthResponse>;
  createDefinition?: Maybe<Definition>;
  deleteDefinition?: Maybe<Definition>;
  review?: Maybe<Definition>;
  report?: Maybe<Report>;
  createUser?: Maybe<User>;
  updateUser?: Maybe<User>;
  deleteUser?: Maybe<User>;
  vote?: Maybe<Vote>;
};

export type MutationLoginArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type MutationSignupArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
  confirmPassword: Scalars["String"];
  name: Scalars["String"];
};

export type MutationCreateDefinitionArgs = {
  word: Scalars["String"];
  meaning: Scalars["String"];
  example?: Maybe<Scalars["String"]>;
  language: Scalars["String"];
};

export type MutationDeleteDefinitionArgs = {
  id: Scalars["ID"];
};

export type MutationReviewArgs = {
  id: Scalars["ID"];
};

export type MutationReportArgs = {
  definition: Scalars["ID"];
  reason: Scalars["Int"];
  message?: Maybe<Scalars["String"]>;
};

export type MutationCreateUserArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
  name: Scalars["String"];
};

export type MutationUpdateUserArgs = {
  id: Scalars["ID"];
  email: Scalars["String"];
  name: Scalars["String"];
};

export type MutationDeleteUserArgs = {
  id: Scalars["ID"];
};

export type MutationVoteArgs = {
  definition: Scalars["ID"];
  action: Scalars["Int"];
};

export type Query = {
  __typename?: "Query";
  me?: Maybe<User>;
  verify: Scalars["Boolean"];
  definition?: Maybe<Definition>;
  definitions?: Maybe<Array<Maybe<Definition>>>;
  count?: Maybe<Scalars["Int"]>;
  search?: Maybe<Array<Maybe<Definition>>>;
  popular?: Maybe<Array<Maybe<Definition>>>;
  report?: Maybe<Report>;
  reports?: Maybe<Array<Maybe<Report>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  vote?: Maybe<Vote>;
};

export type QueryVerifyArgs = {
  token: Scalars["String"];
};

export type QueryDefinitionArgs = {
  id: Scalars["ID"];
};

export type QueryDefinitionsArgs = {
  filter?: Maybe<Filter>;
  page?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
};

export type QueryCountArgs = {
  filter?: Maybe<Filter>;
};

export type QuerySearchArgs = {
  match?: Maybe<Scalars["String"]>;
  page?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
};

export type QueryPopularArgs = {
  letter?: Maybe<Scalars["String"]>;
  limit?: Maybe<Scalars["Int"]>;
};

export type QueryReportArgs = {
  definition: Scalars["ID"];
};

export type QueryReportsArgs = {
  definition: Scalars["ID"];
};

export type QueryUserArgs = {
  id: Scalars["ID"];
};

export type QueryVoteArgs = {
  definition: Scalars["ID"];
};

export type Report = {
  __typename?: "Report";
  reporter?: Maybe<User>;
  definition?: Maybe<Definition>;
  reason?: Maybe<Scalars["Int"]>;
  message?: Maybe<Scalars["String"]>;
};

export type Subscription = {
  __typename?: "Subscription";
  definition: DefinitionSubscription;
};

export type SubscriptionDefinitionArgs = {
  id: Scalars["ID"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type Vote = {
  __typename?: "Vote";
  voter?: Maybe<User>;
  definition?: Maybe<Definition>;
  action?: Maybe<Scalars["Int"]>;
};
