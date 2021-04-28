const { model } = require("mongoose");

const Vote = model("Vote");

const votes = async (_, _args, { user: voter }) => {
  const votes = Vote.find({ voter }).populate("voter definition");
  return votes;
};

module.exports = votes;
