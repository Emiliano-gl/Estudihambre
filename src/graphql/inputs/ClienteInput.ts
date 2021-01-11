import { Field, InputType } from "type-graphql";

@InputType()
export class ClienteInput {
  @Field()
  nombreUsuario!: string;

  @Field()
  correo!: string;

  @Field()
  claveAcceso!: string;

  @Field()
  nombre!: string;

  @Field((type) => [String], { nullable: true })
  gustos?: string[];
}

@InputType()
export class ClienteInputUpdate {
  @Field({ nullable: true })
  claveAcceso!: string;

  @Field({ nullable: true })
  nombre!: string;

  @Field((type) => [String], { nullable: true })
  gustos?: string[];
}

export interface TipoComida {
  usuario: string;
  tipo_de_comida: string;
}
