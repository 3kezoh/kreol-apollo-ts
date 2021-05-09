/* eslint-disable no-param-reassign */
import "module-alias/register";
import { model } from "mongoose";
import mongoose from "@config/mongoose";
import logger from "@config/winston";
import { mongo } from "@config/globals";
import { randomUsers, randomDefinitions } from "./data";
import progressBar from "./progressBar";
import ran from "./ran";

const Definition = model("Definition");
const Report = model("Report");
const User = model("User");
const Vote = model("Vote");

const users = randomUsers(100);
const definitions = randomDefinitions(1000);

mongoose.connect(mongo.uri);

const populate = async () => {
  try {
    console.time("populate");
    await Definition.deleteMany();
    await Report.deleteMany();
    await User.deleteMany();
    await Vote.deleteMany();

    const _users = await Promise.all(users.map((user) => User.create(user)));

    const _definitions = definitions.map((definition) => ({
      ...definition,
      author: _users[ran(1, users.length - 1)]._id,
    }));

    const __definitions = await Definition.insertMany(_definitions, {
      rawResult: false,
      lean: true,
    });

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
    console.error(error);
  }
};

populate();
