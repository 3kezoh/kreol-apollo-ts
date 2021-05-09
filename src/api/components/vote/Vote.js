const { Schema, model } = require("mongoose");

const voteSchema = new Schema(
  {
    voter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    definition: { type: Schema.Types.ObjectId, ref: "Definition", required: true },
    action: { type: Number, enum: [-1, 0, 1], required: true },
  },
  { timestamps: true },
);

voteSchema.set("toObject", { versionKey: false });
voteSchema.index({ definition: 1, voter: 1 });

const Vote = model("Vote", voteSchema);

export default Vote;
