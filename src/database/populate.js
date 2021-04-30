/* eslint-disable no-param-reassign */
require("module-alias/register");
const { model } = require("mongoose");
const mongoose = require("@config/mongoose");
const logger = require("@config/winston");
const { randomUsers, randomDefinitions } = require("./data");
const sleep = require("./sleep");

const Definition = model("Definition");
const Report = model("Report");
const User = model("User");
const Vote = model("Vote");

const users = randomUsers(100);
const definitions = randomDefinitions(100);

mongoose.connect();

const ran = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const populate = async () => {
  try {
    await Definition.deleteMany();
    await Report.deleteMany();
    await User.deleteMany();
    await Vote.deleteMany();

    const _users = await Promise.all(
      users.map(async (user) => {
        await sleep(2000);
        return User.create(user);
      })
    );

    const _definitions = await Promise.all(
      definitions.map(async (definition) => {
        await sleep(2000);
        definition.author = _users[ran(1, users.length - 1)]._id;
        return Definition.create(definition);
      })
    );

    await Promise.all(
      _users.map(async ({ _id: voter }) =>
        Promise.all(
          _definitions.map(async ({ _id: definition }) => {
            const action = ran(0, 1) ?? ran(-1, 1);
            if (action) {
              return Promise.all([
                Vote.create({ voter, definition, action }),
                Definition.findByIdAndUpdate(definition, { $inc: { score: action } }),
              ]);
            }
            return null;
          })
        )
      )
    );
    process.exit(1);
  } catch (error) {
    logger.error(error);
  }
};

populate();
