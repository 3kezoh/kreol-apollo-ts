import { QueryCountArgs as TArgs, AsyncResolver } from "@@components";

export const count: AsyncResolver<TArgs, number> = async (_, { filter }, { dataSources }) =>
  dataSources.definition.count({ filter });
