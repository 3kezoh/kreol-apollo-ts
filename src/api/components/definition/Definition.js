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
    votes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vote",
      },
    ],
  },
  { timestamps: true }
);

definitionSchema.set("toObject", { versionKey: false });

definitionSchema.methods.token = function () {};

definitionSchema.methods.passwordMatches = async function () {};

const Definition = model("Definition", definitionSchema);

module.exports = Definition;
