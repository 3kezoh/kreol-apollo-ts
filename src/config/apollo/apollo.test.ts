import { createTestClient } from "apollo-server-testing";
import { apolloServer } from "@config/apollo";

test("", async () => {
  const { query, mutate } = createTestClient(apolloServer);
});
