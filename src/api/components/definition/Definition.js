/* eslint-disable func-names */
const { Schema, model } = require("mongoose");

const definitionSchema = new Schema(
  {
    word: {
      type: String,
      required: true,
      trim: true,
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

definitionSchema.methods.upvote = function () {
  console.log("upvote");
};

definitionSchema.methods.downvote = function () {
  console.log("downvote");
};

const Definition = model("Definition", definitionSchema);

module.exports = Definition;
