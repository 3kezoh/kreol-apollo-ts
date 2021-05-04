/* eslint-disable no-param-reassign */
require("module-alias/register");
const { model } = require("mongoose");
const mongoose = require("@config/mongoose");
const logger = require("@config/winston");
const { randomUsers, randomDefinitions } = require("./data");
const progressBar = require("./progressBar");

const Definition = model("Definition");
const Report = model("Report");
const User = model("User");
const Vote = model("Vote");

const users = randomUsers(100);
const definitions = randomDefinitions(1000);

const options = { rawResult: false, lean: true };

mongoose.connect();

const ran = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const populate = async () => {
  try {
    console.time("populate");
    await Definition.deleteMany();
    await Report.deleteMany();
    await User.deleteMany();
    await Vote.deleteMany();

    const _users = await User.insertMany(users, options);

    const _definitions = definitions.map((definition) => ({
      ...definition,
      author: _users[ran(1, users.length - 1)]._id,
    }));

    const __definitions = await Definition.insertMany(_definitions, options);

    let votes = [];
    let updates = [];

    for (let i = 0; i < __definitions.length; i += 1) {
      progressBar(__definitions.length, i);
      const { _id: definition } = __definitions[i];
      let score = 0;
      for (let j = 0; j < _users.length; j += 1) {
        const { _id: voter } = _users[j];
        const action = ran(0, 1) || ran(-1, 1);
        score += action;
        if (action) {
          votes = votes.concat([{ voter, definition, action }]);
        }
      }
      updates = updates.concat([Definition.findByIdAndUpdate(definition, { score })]);
    }

    await Promise.all(updates);

    await Vote.insertMany(votes);

    logger.info("Database population is done");
    console.timeEnd("populate");
    process.exit(1);
  } catch (error) {
    logger.error(error);
  }
};

populate();
