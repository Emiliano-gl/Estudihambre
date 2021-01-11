import { Field, InputType } from "type-graphql";

@InputType()
export class SocioInput {
  @Field()
  rfc!: string;

  @Field()
  nombre!: string;

  @Field()
  correo!: string;

  @Field()
  claveAcceso!: string;
}

@InputType()
export class SocioInputUpdate {

  @Field({ nullable: true })
  nombre!: string;

  @Field({ nullable: true })
  correo!: string;

  @Field({ nullable: true })
  claveAcceso!: string;
}