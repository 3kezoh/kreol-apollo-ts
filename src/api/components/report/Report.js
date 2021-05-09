const { Schema, model } = require("mongoose");

const reportSchema = new Schema(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    definition: { type: Schema.Types.ObjectId, ref: "Definition", required: true },
    reason: { type: Number, enum: [0, 1, 2, 3], required: true },
    message: { type: String, maxlength: 500 },
  },
  { timestamps: true },
);

reportSchema.set("toObject", { versionKey: false });

const Report = model("Report", reportSchema);

export default Report;
