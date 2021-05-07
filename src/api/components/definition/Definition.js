/* eslint-disable func-names */
const { Schema, model } = require("mongoose");

const definitionSchema = new Schema(
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
  { timestamps: true }
);

definitionSchema.set("toObject", { versionKey: false });
definitionSchema.index({ word: 1 });
definitionSchema.index({ score: -1, createdAt: 1 });
definitionSchema.index({ score: 1 });
definitionSchema.index({ createdAt: 1 });

const Definition = model("Definition", definitionSchema);

module.exports = Definition;
