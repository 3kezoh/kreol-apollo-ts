const Report = require("../../Report");
const { report: validate } = require("../../validations/queries");

const report = async (_, { definition }, { user: reporter }) => {
  validate({ definition });
  const report = Report.findOne({ reporter, definition })
    .populate("reporter")
    .populate({ path: "definition", populate: { path: "author" } });
  return report;
};

module.exports = report;
