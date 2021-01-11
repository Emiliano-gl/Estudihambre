import { Field, InputType, Int } from "type-graphql";

@InputType()
export class EvaluacionInput {
  @Field()
  claveRestaurante!: string;

  @Field()
  nombreUsuario!: string;

  @Field((type) => Int)
  puntuacion!: number;

  @Field()
  comentario!: string;
}

@InputType()
export class EvaluacionInputUpdate {
  @Field((type) => Int, { nullable: true })
  puntuacion!: number;

  @Field({ nullable: true })
  comentario!: string;
}

export interface EvaluaResponse {
  clave_res: string;
  usuario: string;
  puntuacion: number;
  comentario: string;
}
