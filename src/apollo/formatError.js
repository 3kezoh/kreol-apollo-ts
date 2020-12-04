const formatError = (err) => {
  delete err.extensions.exception;
  return err;
};

module.exports = formatError;
