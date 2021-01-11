import { ApolloServer } from "apollo-server";
import { ApiSchema } from "./graphql/ApiSchema";

export async function startServer() {
  return new ApolloServer({
    schema: await ApiSchema
  });
}
