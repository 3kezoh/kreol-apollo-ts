import { mongo } from "@config/globals";
import mongoose from "@config/mongoose";

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
    if (error.message === "ns not found") return;
    if (error.message.includes("a background operation is currently running")) return;
    console.error(error);
  }
};

const setupMongoose = () => {
  beforeAll(async (done) => {
    await mongoose.connect(mongo.uri);
    done();
  });

  afterEach(async (done) => {
    await deleteCollections();
    done();
  });

  afterAll(async (done) => {
    await dropCollections();
    await mongoose.connection.close();
    done();
  });
};

export default setupMongoose;
