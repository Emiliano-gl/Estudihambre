import { buildSchema } from "type-graphql";
import { ClienteQuery } from "./Queries/ClienteQuery";
import { EvaluacionQuery } from "./Queries/EvaluacionQuery";
import { RestauranteQuery } from "./Queries/RestauranteQuery";
import { SocioQuery } from "./Queries/SocioQuery";
import { SocioMutation } from "./Mutations/SocioMutator";
import { ClienteMutation } from "./Mutations/ClienteMutator";
import { RestauranteMutation } from "./Mutations/RestauranteMutator";
import { EvaluacionMutation } from "./Mutations/EvaluacionMutator";

export const ApiSchema = buildSchema({
  resolvers: [
    SocioQuery,
    ClienteQuery,
    RestauranteQuery,
    EvaluacionQuery,

    SocioMutation,
    ClienteMutation,
    RestauranteMutation,
    EvaluacionMutation,
  ],
});
