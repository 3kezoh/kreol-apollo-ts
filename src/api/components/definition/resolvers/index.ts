import mutations from "./mutations";
import queries from "./queries";
import subscriptions from "./subscriptions";

export default {
  Query: { ...queries },
  Mutation: { ...mutations },
  Subscription: { ...subscriptions },
};
