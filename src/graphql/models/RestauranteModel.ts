import {ObjectType, Field, ID, Int} from 'type-graphql';
import {SocioSeguro} from './SocioModel';

@ObjectType()
export class Restaurante {

    @Field(type => ID)
    clave!: string;

    @Field(type => Int)
    precioMinimo!: number;

    @Field(type => Int)
    precioMaximo!: number;

    @Field()
    telefono!: string;

    @Field()
    direccion!: string;

    @Field()
    nombre!: string;

    @Field(type => SocioSeguro)
    propietario!: SocioSeguro;

    @Field(type => [String])
    tipoComida?: string[];
}
