import { IDefinition } from "@api/components/definition";
import { IUser } from "@api/components/user";

export type Definition = {
  __typename?: "Definition";
  id: string;
  word: string;
  meaning: string;
  example?: string | null;
  language: string;
  score: number;
  action?: number | null;
};

export type Filter = {
  author?: string | null;
  word?: string | null;
};

export type QueryDefinitionArgs = {
  id: string;
};

export type QueryDefinitionsArgs = {
  filter?: Filter | null;
  page?: number | null;
  limit?: number | null;
};

export type QueryCountArgs = {
  filter?: Filter | null;
};

export type QuerySearchArgs = {
  match?: string | null;
  page?: number | null;
  limit?: number | null;
};

export type QueryPopularArgs = {
  letter?: string | null;
  limit?: number | null;
};

export type Context = {
  user: IUser;
};

export type FieldResolver<TArgs> = (
  source: TSource,
  args: TArgs,
  context: Context,
  info: unknown,
) => Promise<IDefinition>;
