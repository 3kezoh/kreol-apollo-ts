const { model } = require("mongoose");
const { ApolloError } = require("apollo-server-express");
const { report: validate } = require("@Report/validations/mutations");

const Report = model("Report");
const Definition = model("Definition");

const report = async (_, { definition: id, reason, message }, { user: reporter }) => {
  validate({ definition: id, reason, message });
  const definition = await Definition.findById(id);
  if (!definition) throw new ApolloError("Definition Not Found");
  const hasReported = await Report.findOne({ definition, reporter });
  if (hasReported) throw new ApolloError("Already reported", { hasReported });
  const report = await Report.create({ definition, reason, reporter, message });
  await report.populate("definition.author").execPopulate();
  return report;
};

module.exports = report;
