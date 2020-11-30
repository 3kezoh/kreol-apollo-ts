const User = require("../../User");

const updateUser = async (_, { id, email }) => {
  return await User.findByIdAndUpdate(id, { email });
};

module.exports = updateUser;
