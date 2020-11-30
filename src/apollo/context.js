const context = ({ req }) => {
  return {
    user: req.user,
  };
};

module.exports = context;
