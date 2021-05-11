import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import Vote, { IVote, IVoteDocument, IVotePopulatedDocument } from "./Vote";

export { Vote, IVote, IVoteDocument, IVotePopulatedDocument };

export default { typeDefs: [typeDefs], resolvers };
