import { IDefinitionDocument } from "@Definition";
import { IUserDocument } from "@User";
import { Document, model, Model, Schema, Types } from "mongoose";

export interface IReport {
  reporter: Types.ObjectId | string;
  definition: Types.ObjectId | string;
  reason: number;
  message: string;
}

interface IReportBaseDocument extends IReport, Document {
  _id: Types.ObjectId;
}

export interface IReportDocument extends IReportBaseDocument {
  reporter: IUserDocument["_id"];
  definition: IDefinitionDocument["_id"];
}

const reportSchema = new Schema<IReportDocument>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    definition: { type: Schema.Types.ObjectId, ref: "Definition", required: true },
    reason: { type: Number, enum: [0, 1, 2, 3], required: true },
    message: { type: String, maxlength: 500 },
  },
  { timestamps: true },
);

reportSchema.set("toObject", { versionKey: false });
reportSchema.index({ definition: 1, reporter: 1 });

const Report: Model<IReportDocument> = model("Report", reportSchema);

export default Report;
