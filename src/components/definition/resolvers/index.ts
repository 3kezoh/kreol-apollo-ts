import * as mutations from "./mutations";
import * as queries from "./queries";
import * as subscriptions from "./subscriptions";

export const resolvers = {
  Mutation: { ...mutations },
  Query: { ...queries },
  Subscription: { ...subscriptions },
};
