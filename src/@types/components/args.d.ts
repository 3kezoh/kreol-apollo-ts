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
  translation: Scalars["String"];
  author: User;
  score: Scalars["Int"];
  createdAt: Scalars["Date"];
  action?: Maybe<Scalars["Int"]>;
  reviewed: Scalars["Boolean"];
};

export type DefinitionSubscriptionPayload = {
  __typename?: "DefinitionSubscriptionPayload";
  id: Scalars["ID"];
  score: Scalars["Int"];
};

export type Filter = {
  author?: Maybe<Scalars["ID"]>;
  word?: Maybe<Scalars["String"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  createDefinition?: Maybe<Definition>;
  deleteDefinition?: Maybe<Definition>;
  review?: Maybe<Definition>;
  report?: Maybe<Report>;
  createUser?: Maybe<User>;
  updateUser?: Maybe<User>;
  deleteUser?: Maybe<User>;
  vote?: Maybe<Vote>;
};

export type MutationCreateDefinitionArgs = {
  word: Scalars["String"];
  meaning: Scalars["String"];
  example?: Maybe<Scalars["String"]>;
  translation: Scalars["String"];
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
  definitions: Array<Maybe<Definition>>;
  count: Scalars["Int"];
  search: Array<Maybe<Definition>>;
  popular: Array<Maybe<Definition>>;
  report?: Maybe<Report>;
  reports?: Maybe<Array<Maybe<Report>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  vote?: Maybe<Vote>;
};

export type QueryDefinitionArgs = {
  id: Scalars["ID"];
};

export type QueryDefinitionsArgs = {
  filter?: Maybe<Filter>;
  page?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  sortBy?: Maybe<SortBy>;
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
  reporter: User;
  definition: Definition;
  reason: Scalars["Int"];
  message?: Maybe<Scalars["String"]>;
};

export enum Role {
  Admin = "ADMIN",
  User = "USER",
}

export type Subscription = {
  __typename?: "Subscription";
  definition: DefinitionSubscriptionPayload;
};

export type SubscriptionDefinitionArgs = {
  id: Scalars["ID"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  email: Scalars["String"];
  name: Scalars["String"];
};

export type Vote = {
  __typename?: "Vote";
  voter: User;
  definition: Definition;
  action: Scalars["Int"];
};

export type SortBy = {
  score?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["Int"]>;
};
