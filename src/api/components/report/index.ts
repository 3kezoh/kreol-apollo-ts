import Report, { IReport, IReportDocument } from "./Report";
import ReportDataSource from "./ReportDataSource";
import reportValidation from "./reportValidation";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

export { Report, ReportDataSource, reportValidation, IReport, IReportDocument };

export default { typeDefs: [typeDefs], resolvers };
