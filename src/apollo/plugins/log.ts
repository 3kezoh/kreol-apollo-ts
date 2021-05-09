import { ApolloServerPlugin } from "apollo-server-plugin-base";
import logger from "@config/winston";
import chalk from "chalk";

const log: ApolloServerPlugin = {
  serverWillStart() {
    logger.info(`${chalk.hex("#3F20BA")("Apollo")} server starting`);
  },
  requestDidStart() {
    return {
      didEncounterErrors({ errors }) {
        errors.map(({ stack }) => console.error(stack));
      },
    };
  },
};

export default log;
