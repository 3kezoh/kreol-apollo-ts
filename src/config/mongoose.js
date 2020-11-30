const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose.set("debug", true);

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error. Please make sur MongoDB is running.`);
  process.exit(-1);
});

exports.connect = async () => {
  await mongoose.connect("mongodb://localhost:27017/apollo-authentication-test");
  console.info(`MongoDB connected`);
  return mongoose.connection;
};
