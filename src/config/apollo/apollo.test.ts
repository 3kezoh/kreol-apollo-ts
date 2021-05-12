import { createTestClient } from "apollo-server-testing";
import { apolloServer } from "@config/apollo";
import mongoose from "@config/mongoose";
import { mongo } from "@config/globals";

test("", async () => {
  beforeAll(async () => {
    return mongoose.connect(mongo.uri);
  });

  console.log(process.env.NODE_ENV);

  const { query, mutate } = createTestClient(apolloServer);
});
