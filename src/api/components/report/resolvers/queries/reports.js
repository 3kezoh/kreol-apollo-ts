const { model } = require("mongoose");
const { reports: validate } = require("@Report/validations/queries");

const Report = model("Report");

const reports = async (_, { definition }) => {
  validate({ definition });
  const reports = Report.find({ definition }).populate("reporter definition ");
  return reports;
};

module.exports = reports;
