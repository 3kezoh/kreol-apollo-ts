const { ApolloError } = require("apollo-server-express");
const Report = require("../../Report");
const { Definition } = require("../../../definition");
const { report: validate } = require("../../validations/mutations");

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