const logger = require("@config/winston");

const log = {
  serverWillStart() {
    logger.info("Server starting");
  },
  requestDidStart() {
    return {
      didEncounterErrors({ errors }) {
        errors.map(({ stack }) => logger.error(stack));
      },
    };
  },
};

module.exports = log;
