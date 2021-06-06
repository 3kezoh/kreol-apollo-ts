import { IReportDocument } from "@Report";
import { ObjectId } from "mongodb";
import { mockedContext } from "./mockedContext";
import { mockedDefinition } from "./mockedDefinition";

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

export const mockedReport = { args, document };
