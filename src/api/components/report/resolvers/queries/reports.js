const Report = require("../../Report");
const { reports: validate } = require("../../validations/queries");

const reports = async (_, { definition }) => {
  validate({ definition });
  const reports = Report.find({ definition }).populate("reporter definition ");
  return reports;
};

module.exports = reports;
