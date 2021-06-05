import * as mutations from "./mutations";
import * as queries from "./queries";

export const resolvers = {
  Query: { ...queries },
  Mutation: { ...mutations },
};
