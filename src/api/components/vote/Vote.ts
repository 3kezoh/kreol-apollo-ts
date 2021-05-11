import { model, Schema, Model, Document, Types } from "mongoose";
import { IDefinitionDocument } from "@Definition";
import { IUserDocument } from "@User";

export interface IVote {
  voter: Types.ObjectId | string;
  definition: Types.ObjectId | string;
  action: number;
}

interface IVoteBaseDocument extends IVote, Document {
  _id: Types.ObjectId;
}

export interface IVoteDocument extends IVoteBaseDocument {
  voter: IUserDocument["_id"];
  definition: IDefinitionDocument["_id"];
}

export interface IVotePopulatedDocument extends Omit<IVoteBaseDocument, "voter" | "definition"> {
  voter: IUserDocument;
  definition: IDefinitionDocument;
}

const voteSchema = new Schema<IVoteDocument>(
  {
    voter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    definition: { type: Schema.Types.ObjectId, ref: "Definition", required: true },
    action: { type: Number, enum: [-1, 0, 1], required: true },
  },
  { timestamps: true },
);

voteSchema.set("toObject", { versionKey: false });
voteSchema.index({ definition: 1, voter: 1 });

const Vote: Model<IVoteDocument> = model("Vote", voteSchema);

export default Vote;
