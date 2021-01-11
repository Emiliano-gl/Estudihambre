import { ObjectType, Field, Int } from "type-graphql";
import { ClienteSeguro } from "./ClienteModel";
import { Restaurante } from "./RestauranteModel";

@ObjectType()
export class EvaluacionRestaurante {
  @Field((type) => ClienteSeguro)
  cliente!: ClienteSeguro;

  @Field((type) => Int)
  puntuacion!: number;

  @Field()
  comentario!: string;
}

@ObjectType()
export class EvaluacionCliente {
  @Field((type) => Restaurante)
  restaurante!: Restaurante;

  @Field((type) => Int)
  puntuacion!: number;

  @Field()
  comentario!: string;
}

@ObjectType()
export class Evaluacion {
  @Field((type) => Restaurante)
  restaurante!: Restaurante;

  @Field((type) => ClienteSeguro)
  cliente!: ClienteSeguro;

  @Field((type) => Int)
  puntuacion!: number;

  @Field()
  comentario!: string;
}
