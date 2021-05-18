import { model, Schema, Model, Document, Types } from "mongoose";
import { IUserDocument } from "@User";

type Language = "fr" | "gf";

export interface IDefinition {
  word: string;
  meaning: string;
  example?: string;
  language: Language;
  author: Types.ObjectId | string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IDefinitionBaseDocument extends IDefinition, Document {
  _id: Types.ObjectId;
  updateScore(score: number): Promise<IDefinitionDocument>;
}

export interface IDefinitionDocument extends IDefinitionBaseDocument {
  author: IUserDocument["_id"];
}

export interface IDefinitionPopulatedDocument extends Omit<IDefinitionBaseDocument, "author"> {
  author: IUserDocument;
}

const definitionSchema = new Schema<IDefinitionDocument>(
  {
    word: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    meaning: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500,
    },
    example: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    language: {
      type: String,
      default: "fr",
      enum: ["fr", "gf"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

definitionSchema.set("toObject", { versionKey: false });
definitionSchema.index({ word: 1 });
definitionSchema.index({ score: -1, createdAt: 1 });
definitionSchema.index({ score: 1 });
definitionSchema.index({ createdAt: 1 });

definitionSchema.methods.updateScore = async function updateScore(score: number) {
  return this.updateOne({ $inc: { score } }, { new: true });
};

const Definition: Model<IDefinitionDocument> = model("Definition", definitionSchema);

export default Definition;
