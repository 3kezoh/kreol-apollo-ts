import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import Vote, { IVote, IVoteDocument, IVotePopulatedDocument } from "./Vote";
import VoteDataSource from "./VoteDataSource";

export { Vote, VoteDataSource, IVote, IVoteDocument, IVotePopulatedDocument };

export default { typeDefs: [typeDefs], resolvers };
