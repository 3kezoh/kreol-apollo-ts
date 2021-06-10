import { QueryCountArgs as TArgs, Resolver } from "@@components";

export const count: Resolver<TArgs, number> = async (_, { filter }, { dataSources }) =>
  dataSources.definition.count({ filter });
