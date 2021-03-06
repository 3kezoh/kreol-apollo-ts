/* eslint-disable no-param-reassign */
import "module-alias/register";
import { logger, mongoose } from "@config";
import { mongo } from "@config/env";
import { Definition, IDefinitionDocument } from "@Definition";
import { Report } from "@Report";
import { User } from "@User";
import { IVote, Vote } from "@Vote";
import { Query } from "mongoose";
import { admins } from "./admins";
import { randomDefinitions, randomUsers } from "./data";
import progressBar from "./progressBar";
import ran from "./ran";

const users = randomUsers(100);
const definitions = randomDefinitions(1000);

export const populate = async () => {
  try {
    console.time("populate");
    await mongoose.connect(mongo.uri);

    await Promise.all([Definition.deleteMany(), Report.deleteMany(), User.deleteMany(), Vote.deleteMany()]);

    await Promise.all(admins.map((admin) => User.create({ ...admin, role: "ADMIN" })));

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
  } catch (error) {
    console.error(error);
  }
};
