const User = require("../../User");

const deleteUser = async (_, { id }) => {
  return await User.findByIdAndDelete(id);
};

module.exports = deleteUser;
