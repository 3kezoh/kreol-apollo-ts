const mongoose = require("mongoose");
const logger = require("@config/winston");
const { mongo } = require("@config/globals");

require("@Definition/Definition");
require("@Report/Report");
require("@User/User");
require("@Vote/Vote");

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose.set("debug", true);

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB connection error. Please make sur MongoDB is running. ${err}`);
  process.exit(-1);
});

exports.connect = async () => {
  await mongoose.connect(mongo.uri);
  logger.info("MongoDB connected");
  return mongoose.connection;
};
