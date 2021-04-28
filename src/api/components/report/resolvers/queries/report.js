const { model } = require("mongoose");
const { report: validate } = require("@Report/validations/queries");

const Report = model("Report");

const report = async (_, { definition }, { user: reporter }) => {
  validate({ definition });
  const report = Report.findOne({ reporter, definition })
    .populate("reporter")
    .populate({ path: "definition", populate: { path: "author" } });
  return report;
};

module.exports = report;
