import { IReportDocument } from "@Report";
import { mockedDefinition, mockedContext } from "@test";
import { ObjectId } from "mongodb";

const args = {
  definition: mockedDefinition.document._id.toHexString(),
  reason: 0,
  message: "message",
};

const document = ({
  _id: new ObjectId(),
  ...args,
  reporter: mockedContext.user,
  createdAt: new Date(),
} as unknown) as IReportDocument;

const mockedReport = { args, document };

export default mockedReport;
