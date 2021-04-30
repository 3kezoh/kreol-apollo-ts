const logger = require("@config/winston");
const chalk = require("chalk");

const log = {
  serverWillStart() {
    logger.info(`${chalk.hex("#3F20BA")("Apollo")} server starting`);
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
