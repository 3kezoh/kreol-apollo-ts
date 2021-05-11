import { Types } from "mongoose";

export type Filter = {
  author?: string | null;
  word?: string | null;
};

export type Match = {
  author?: Types.ObjectId;
  word?: RegExp;
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
