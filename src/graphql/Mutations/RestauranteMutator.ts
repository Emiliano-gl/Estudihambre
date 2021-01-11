import { Arg, Mutation, Resolver } from "type-graphql";
import { dbConnection } from "../../config/database";
import {
  RestauranteInput,
  RestauranteInputUpdate,
} from "../inputs/RestauranteInput";
import { Restaurante } from "../models/RestauranteModel";
import { SocioQuery } from "../Queries/SocioQuery";
import { RestauranteQuery } from "../Queries/RestauranteQuery";

@Resolver()
export class RestauranteMutation {
  @Mutation((returns) => Restaurante)
  async crearRestaurante(
    @Arg("input", (type) => RestauranteInput) input: RestauranteInput
  ) {
    const db = await dbConnection();
    const clave = `${input.nombre.substr(0, 2)}${Date.now()}`;

    await db.execute(`INSERT INTO restaurante VALUES(?, ?, ?, ?, ?, ?, ?)`, [
      clave,
      input.precioMinimo,
      input.precioMaximo,
      input.telefono,
      input.direccion,
      input.nombre,
      input.rfcPropietario,
    ]);

    let restaurante = new Restaurante();

    restaurante.clave = clave;
    restaurante.precioMinimo = input.precioMinimo;
    restaurante.precioMaximo = input.precioMaximo;
    restaurante.telefono = input.telefono;
    restaurante.direccion = input.direccion;
    restaurante.nombre = input.nombre;
    restaurante.propietario = await this.getPropietario(input.rfcPropietario);

    if (input.tipoComida) {
      for (const comida of input.tipoComida) {
        await db.execute(`INSERT INTO tipo_comida_restaurante VALUES(?, ?)`, [
          clave,
          comida,
        ]);
      }
      restaurante.tipoComida = input.tipoComida;
    } else {
      restaurante.tipoComida = [];
    }

    return restaurante;
  }

  @Mutation((returns) => Restaurante)
  async agregarTipoComida(
    @Arg("clave") clave: string,
    @Arg("tipoComida", (type) => [String]) tipoComida: string[]
  ) {
    const db = await dbConnection();

    for (const comida of tipoComida) {
      await db.execute(`INSERT INTO tipo_comida_restaurante VALUES(?, ?)`, [
        clave,
        comida,
      ]);
    }

    return await new RestauranteQuery().restaurante(clave);
  }

  @Mutation((returns) => Boolean)
  async borrarRestaurante(@Arg("clave") clave: string) {
    const db = await dbConnection();

    const [data, _] = await db.execute(
      `SELECT * FROM restaurante WHERE clave = '${clave}'`
    );
    const dataParse: Restaurante[] = JSON.parse(JSON.stringify(data));

    if (dataParse.length != 0) {
      await db.execute(`DELETE FROM restaurante WHERE clave = '${clave}'`);
      return true;
    } else {
      return false;
    }
  }

  @Mutation((returns) => Restaurante)
  async actualizarRestaurante(
    @Arg("clave") clave: string,
    @Arg("input", (type) => RestauranteInputUpdate, { nullable: true })
    input: RestauranteInputUpdate
  ) {
    const db = await dbConnection();

    if (Object.keys(input).length != 0) {
      let sqlQuery = `UPDATE restaurante SET `;

      if (input.direccion) {
        sqlQuery += `direccion = '${input.direccion}' `;
      }

      if (input.nombre) {
        sqlQuery += `nombre = '${input.nombre}' `;
      }

      if (input.precioMaximo) {
        sqlQuery += `precioMaximo = '${input.precioMaximo}' `;
      }

      if (input.precioMinimo) {
        sqlQuery += `precioMinimo = '${input.precioMinimo}' `;
      }

      if (input.rfcPropietario) {
        sqlQuery += `rfc_socio = '${input.rfcPropietario}' `;
      }

      if (input.telefono) {
        sqlQuery += `telefono = '${input.telefono}' `;
      }

      if (input.tipoComida) {
        await db.execute(
          `DELETE FROM tipo_comida_restaurante WHERE clave_res = '${clave}'`
        );
        await this.agregarTipoComida(clave, input.tipoComida);
      }

      await db.execute(`${sqlQuery} WHERE clave = '${clave}'`);
    }

    return await new RestauranteQuery().restaurante(clave);
  }

  private async getPropietario(rfc: string) {
    return await new SocioQuery().socio(rfc);
  }
}
