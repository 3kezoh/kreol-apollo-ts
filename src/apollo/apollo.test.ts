import { createTestClient } from "apollo-server-testing";
import { apolloServer } from "@@apollo";

test("", async () => {
  const { query, mutate } = createTestClient(apolloServer);
});
