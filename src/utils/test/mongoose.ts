import { mongo } from "@config/globals";
import _mongoose from "@config/mongoose";

const getCollections = () => Object.keys(_mongoose.connection.collections);

const deleteCollections = async () => {
  const collections = getCollections();
  collections.forEach((collection) => _mongoose.connection.collections[collection].deleteMany({}));
};

const dropCollections = async () => {
  const collections = getCollections();
  collections.forEach(async (collection) => {
    try {
      await _mongoose.connection.collections[collection].drop();
    } catch (error) {
      if (error.message === "ns not found") return;
      if (error.message.includes("a background operation is currently running")) return;
      console.error(error);
    }
  });
};

const mongoose = () => {
  beforeAll(async () => {
    await _mongoose.connect(mongo.uri);
  });

  afterEach(async () => {
    await deleteCollections();
  });

  afterAll(async () => {
    await dropCollections();
    await _mongoose.connection.close();
  });
};

export default mongoose;
