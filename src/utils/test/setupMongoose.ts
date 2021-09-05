import { mongoose } from "@config";
import { mongo } from "@config/env";

mongoose.Promise = global.Promise;

const getCollections = () => Object.keys(mongoose.connection.collections);

const deleteCollections = async () => {
  const collections = getCollections();
  await Promise.all(
    collections.map(async (collection) => mongoose.connection.collections[collection].deleteMany({})),
  );
};

const dropCollections = async () => {
  const collections = getCollections();
  try {
    await Promise.all(
      collections.map(async (collection) => mongoose.connection.collections[collection].drop()),
    );
  } catch (error) {
    /* istanbul ignore next */
    if (error.message === "ns not found") return;
    /* istanbul ignore next */
    if (error.message.includes("a background operation is currently running")) return;
    console.error(error);
  }
};

export const setupMongoose = () => {
  beforeAll(async () => {
    await mongoose.connect(mongo.uri);
  });

  afterEach(async () => {
    await deleteCollections();
  });

  afterAll(async () => {
    await dropCollections();
    await mongoose.connection.close();
  });
};
