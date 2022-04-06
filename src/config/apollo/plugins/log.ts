import { logger } from "@config/winston";
import { ApolloServerPlugin } from "apollo-server-plugin-base";
import chalk from "chalk";

export const log: ApolloServerPlugin = {
  async serverWillStart() {
    logger.info(`${chalk.hex("#3F20BA")("Apollo")} server starting`);
  },
  // async requestDidStart() {
  //   return {
  //     async didEncounterErrors({ errors }) {
  //       errors.forEach(({ stack, originalError }) => {
  //         if (originalError && ![""].includes(originalError.name)) console.error(stack);
  //       });
  //     },
  //   };
  // },
};
