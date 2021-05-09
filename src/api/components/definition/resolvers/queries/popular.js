const { model } = require("mongoose");
const { popular: validate } = require("@Definition/validations/queries");

const Definition = model("Definition");

const DEFINITIONS_LIMIT = 50;

const popular = async (_, { letter, limit }) => {
  letter = letter ?? "a";
  limit = limit ?? DEFINITIONS_LIMIT;
  validate({ letter, limit });

  const result = await Definition.aggregate([
    { $match: { word: new RegExp(`^${letter}`, "i") } },
    { $sort: { score: -1, createdAt: 1 } },
    { $group: { _id: "$word", score: { $sum: "$score" }, doc: { $first: "$$ROOT" } } },
    { $sort: { score: -1, createdAt: 1 } },
    { $replaceRoot: { newRoot: "$doc" } },
    { $limit: limit },
    { $set: { id: "$_id" } },
  ]);

  return Definition.populate(result, { path: "author" });
};

export default popular;
