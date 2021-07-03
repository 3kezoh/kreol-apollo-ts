import { logger } from "@config/winston";
import { ApolloServerPlugin } from "apollo-server-plugin-base";
import chalk from "chalk";

export const log: ApolloServerPlugin = {
  serverWillStart() {
    logger.info(`${chalk.hex("#3F20BA")("Apollo")} server starting`);
  },
  requestDidStart() {
    return {
      didEncounterErrors({ errors }) {
        errors.forEach(({ stack, originalError }) => {
          if (originalError && ![""].includes(originalError.name)) console.error(stack);
        });
      },
    };
  },
};
