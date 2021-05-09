const { model } = require("mongoose");

const Vote = model("Vote");

const votes = async (_, _args, { user: voter }) => {
  return Vote.find({ voter }).populate("voter definition");
};

export default votes;
