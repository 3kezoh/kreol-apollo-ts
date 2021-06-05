/* eslint-disable no-param-reassign */
import "module-alias/register";
import { mongo } from "@config/globals";
import mongoose from "@config/mongoose";
import logger from "@config/winston";
import { Definition, IDefinitionDocument } from "@Definition";
import { Report } from "@Report";
import { User } from "@User";
import { IVote, Vote } from "@Vote";
import { Query } from "mongoose";
import { randomDefinitions, randomUsers } from "./data";
import progressBar from "./progressBar";
import ran from "./ran";
import admins from "./admins";

const users = randomUsers(100);
const definitions = randomDefinitions(1000);

const populate = async () => {
  try {
    console.time("populate");
    await mongoose.connect(mongo.uri);

    await Definition.deleteMany();
    await Report.deleteMany();
    await User.deleteMany();
    await Vote.deleteMany();

    await Promise.all(admins.map((admin) => User.create({ ...admin, role: "admin" })));

    const _users = await Promise.all(users.map((user) => User.create(user)));

    const _definitions = definitions.map((definition) => ({
      ...definition,
      author: _users[ran(1, users.length - 1)]._id,
    }));

    const __definitions = await Definition.insertMany(_definitions, {
      rawResult: false,
      lean: true,
    });

    let votes: IVote[] = [];
    let updates: Query<IDefinitionDocument | null, IDefinitionDocument, {}>[] = [];

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
