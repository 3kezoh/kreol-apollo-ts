import { QueryCountArgs, Resolver } from "@@api";

const count: Resolver<QueryCountArgs, number> = async (_, { filter }, { dataSources }) =>
  dataSources.definition.count({ filter });

export default count;
