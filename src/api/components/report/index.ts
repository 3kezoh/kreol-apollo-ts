import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import Report, { IReport, IReportDocument } from "./Report";

export { Report, IReport, IReportDocument };

export default { typeDefs: [typeDefs], resolvers };
