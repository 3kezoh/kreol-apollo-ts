import { IUserPopulated } from "@User";
import { Document, model, Model, Schema, Types } from "mongoose";
import mongooseLeanId from "mongoose-lean-id";

interface IDefinition {
  word: string;
  meaning: string;
  example?: string;
  language: "fr" | "gf";
  author: Types.ObjectId;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  reviewed: boolean;
}

export interface IDefinitionDocument extends IDefinition, Document {
  _id: Types.ObjectId;
}

export interface IDefinitionPopulated extends Omit<IDefinition, "author"> {
  id: string;
  author: IUserPopulated;
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
    reviewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

definitionSchema.plugin(mongooseLeanId);
definitionSchema.set("toObject", { versionKey: false });
definitionSchema.index({ word: 1 });
definitionSchema.index({ score: -1, createdAt: 1 });
definitionSchema.index({ score: 1 });
definitionSchema.index({ createdAt: 1 });

export const Definition: Model<IDefinitionDocument> = model("Definition", definitionSchema);
