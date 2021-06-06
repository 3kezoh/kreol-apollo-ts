import { QueryCountArgs, Resolver } from "@@components";

export const count: Resolver<QueryCountArgs, number> = async (_, { filter }, { dataSources }) =>
  dataSources.definition.count({ filter });
