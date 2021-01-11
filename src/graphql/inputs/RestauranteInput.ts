import { Field, InputType, Int } from "type-graphql";

@InputType()
export class RestauranteInput {

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
    
    @Field()
    rfcPropietario!: string;

    @Field((type) => [String], {nullable: true})
    tipoComida?: string[];
}

@InputType()
export class RestauranteInputUpdate {

    @Field(type => Int, { nullable: true })
    precioMinimo!: number;

    @Field(type => Int, { nullable: true })
    precioMaximo!: number;

    @Field({ nullable: true })
    telefono!: string;

    @Field({ nullable: true })
    direccion!: string;

    @Field({ nullable: true })
    nombre!: string;
    
    @Field({ nullable: true })
    rfcPropietario!: string;

    @Field((type) => [String], {nullable: true})
    tipoComida?: string[];
}

export interface RestauranteResponse {
    clave: string;
    precioMinimo: number;
    precioMaximo: number;
    telefono: string;
    direccion: string;
    nombreEstablecimiento: string;
    rfc_socio: string;
    correo: string;
    nombre: string;
}

export interface TipoComida {
    clave_res: string;
    tipo_de_comida: string;
  }
