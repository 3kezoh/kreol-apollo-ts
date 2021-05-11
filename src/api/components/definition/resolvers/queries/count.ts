import { ApolloError } from "apollo-server-express";
import { FilterQuery } from "mongoose";
import { definitions as validate } from "@Definition/validations/queries";
import { Definition, IDefinitionDocument } from "@Definition";
import { User } from "@User";
import { escapeRegExp } from "@utils";
import { Resolver } from "@@api/components";
import { QueryCountArgs, Match } from "@@api/components/definitions";

const count: Resolver<QueryCountArgs, number> = async (_, { filter }) => {
  const match: Match = {};
  validate({ filter });

  if (filter?.word) match.word = escapeRegExp(filter.word);

  if (filter?.author) {
    const user = await User.findById(filter.author);
    if (!user) throw new ApolloError("User Not Found");
  }

  return Definition.countDocuments(match as FilterQuery<IDefinitionDocument>);
};

export default count;
