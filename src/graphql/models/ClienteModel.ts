import {ObjectType, Field} from 'type-graphql';

@ObjectType()
export class Cliente {
    
    @Field()
    nombreUsuario!: string;
    
    @Field()
    correo!: string;

    @Field()
    claveAcceso!: string;

    @Field()
    nombre!: string;

    @Field(type => [String])
    gustos?: string[];
}

@ObjectType()
export class ClienteSeguro {
    
    @Field()
    nombreUsuario!: string;
    
    @Field()
    correo!: string;

    @Field()
    nombre!: string;

    @Field(type => [String])
    gustos?: string[];
}