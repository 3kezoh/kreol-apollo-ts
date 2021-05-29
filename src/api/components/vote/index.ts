import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import Vote, { IVote, IVoteDocument, IVotePopulatedDocument } from "./Vote";
import VoteDataSource from "./VoteDataSource";
import voteValidation from "./voteValidation";

export { Vote, VoteDataSource, voteValidation, IVote, IVoteDocument, IVotePopulatedDocument };

export default { typeDefs: [typeDefs], resolvers };
