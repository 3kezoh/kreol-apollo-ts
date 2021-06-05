import { QueryCountArgs, Resolver } from "@@api";

export const count: Resolver<QueryCountArgs, number> = async (_, { filter }, { dataSources }) =>
  dataSources.definition.count({ filter });
