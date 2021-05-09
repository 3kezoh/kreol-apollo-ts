import queries from "./queries";
import mutations from "./mutations";

const resolvers = {
  Query: { ...queries },
  Mutation: { ...mutations },
};

export default resolvers;
