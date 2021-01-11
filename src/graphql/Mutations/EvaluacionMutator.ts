import { Arg, Mutation, Resolver } from "type-graphql";
import { dbConnection } from "../../config/database";
import {
  EvaluacionInput,
  EvaluacionInputUpdate,
} from "../inputs/EvaluacionInput";
import { Evaluacion } from "../models/EvaluacionModel";
import { ClienteQuery } from "../Queries/ClienteQuery";
import { EvaluacionQuery } from "../Queries/EvaluacionQuery";
import { RestauranteQuery } from "../Queries/RestauranteQuery";

@Resolver()
export class EvaluacionMutation {
  @Mutation((returns) => Evaluacion)
  async crearEvaluacion(
    @Arg("input", (type) => EvaluacionInput) input: EvaluacionInput
  ) {
    const db = await dbConnection();
    let evalAux = new Evaluacion();

    await db.execute(`INSERT INTO evalua VALUES(?, ?, ?, ?)`, [
      input.claveRestaurante,
      input.nombreUsuario,
      input.puntuacion,
      input.comentario,
    ]);

    evalAux.cliente = await this.getCliente(input.nombreUsuario);
    evalAux.comentario = input.comentario;
    evalAux.puntuacion = input.puntuacion;
    evalAux.restaurante = await this.getRestaurante(input.claveRestaurante);

    return evalAux;
  }

  @Mutation((returns) => Boolean)
  async borrarEvaluacion(
    @Arg("clave") clave: string,
    @Arg("nombreUsuario") nombreUsuario: string
  ) {
    const db = await dbConnection();

    const [data, _] = await db.execute(
      `SELECT * FROM evalua WHERE clave_res = '${clave}' AND usuario = '${nombreUsuario}'`
    );
    const dataParse: Evaluacion[] = JSON.parse(JSON.stringify(data));

    if (dataParse.length != 0) {
      await db.execute(
        `DELETE FROM restaurante WHERE clave_res = '${clave}' AND usuario = '${nombreUsuario}'`
      );
      return true;
    } else {
      return false;
    }
  }

  @Mutation((returns) => Evaluacion)
  async actualizarEvaluacion(
    @Arg("clave") clave: string,
    @Arg("nombreUsuario") nombreUsuario: string,
    @Arg("input", (type) => EvaluacionInputUpdate, { nullable: true }) input: EvaluacionInputUpdate
  ) {
    const db = await dbConnection();

    if (Object.keys(input).length != 0) {
      let sqlQuery = `UPDATE evalua SET `;

      if (input.comentario) {
        sqlQuery += `comentario = '${input.comentario}' `;
      }

      if (input.puntuacion) {
        sqlQuery += `puntuacion = '${input.puntuacion}' `;
      }

      await db.execute(
        `${sqlQuery} WHERE clave_res = '${clave}' AND usuario = '${nombreUsuario}'`
      );
    }

    return await new EvaluacionQuery().evaluacion(nombreUsuario, clave);
  }

  private async getCliente(nombreUsuario: string) {
    return await new ClienteQuery().cliente(nombreUsuario);
  }

  private async getRestaurante(clave: string) {
    return await new RestauranteQuery().restaurante(clave);
  }
}
