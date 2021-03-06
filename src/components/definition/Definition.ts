import { IUserPopulated } from "@User";
import { Document, model, Model, Schema, Types } from "mongoose";
import mongooseLeanId from "mongoose-lean-id";

interface IDefinition {
  word: string;
  meaning: string;
  example?: string;
  translation: "fr" | "gf";
  author: Types.ObjectId;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  reviewed: boolean;
}

export interface IDefinitionDocument extends IDefinition, Document {
  id: string;
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
      maxlength: 300,
    },
    example: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    translation: {
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
