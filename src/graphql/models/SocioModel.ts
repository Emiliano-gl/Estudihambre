import {ObjectType, Field} from 'type-graphql';

@ObjectType()
export class Socio {

    @Field()
    rfc!: string;

    @Field()
    nombre!: String;

    @Field()
    correo!: string;

    @Field()
    claveAcceso!: string;
}

@ObjectType()
export class SocioSeguro {

    @Field()
    rfc!: string;

    @Field()
    nombre!: String;

    @Field()
    correo!: string;
}