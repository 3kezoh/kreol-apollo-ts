import { createTestClient } from "apollo-server-testing";
import { apolloServer } from "@config/apollo";
import { setupMongoose } from "@utils/test";

setupMongoose();

test("", async () => {
  const { query, mutate } = createTestClient(apolloServer);
});
