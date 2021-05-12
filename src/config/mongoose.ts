import mongoose from "mongoose";
import chalk from "chalk";
import logger from "@config/winston";
import {} from "@config/globals";

import "@Definition";
import "@Report";
import "@User";
import "@Vote";

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose.set("debug", process.env.NODE_ENV === "development");

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error. Please make sur MongoDB is running. ${err}`);
  process.exit(-1);
});

mongoose.connection.on("connected", () => {
  logger.info(`${chalk.hex("#13AA52")("MongoDB")} connected`);
});

export default mongoose;
