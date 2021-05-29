import { IReportDocument } from "@api/components/report";
import { mockedDefinitionDocument, mockedUser } from "@utils/test";
import { ObjectId } from "mongodb";

const mockedReport = {
  definition: mockedDefinitionDocument._id.toHexString(),
  reason: 0,
  message: "message",
};

const mockedReportDocument = ({
  _id: new ObjectId(),
  ...mockedReport,
  score: 0,
  createdAt: new Date(),
  reporter: mockedUser,
} as unknown) as IReportDocument;

export { mockedReport, mockedReportDocument };
