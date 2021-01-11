import { Arg, Query, Resolver } from "type-graphql";
import { dbConnection } from "../../config/database";
import { EvaluaResponse } from "../inputs/EvaluacionInput";
import {
  Evaluacion,
  EvaluacionCliente,
  EvaluacionRestaurante,
} from "../models/EvaluacionModel";
import { ClienteQuery } from "./ClienteQuery";
import { RestauranteQuery } from "./RestauranteQuery";

@Resolver()
export class EvaluacionQuery {
  @Query((returns) => [EvaluacionRestaurante])
  async evaluacionesRestaurante(@Arg("clave") clave: string) {
    const db = await dbConnection();
    let evaluaciones: EvaluacionRestaurante[] = [];

    let [data, _] = await db.execute(
      `SELECT * FROM evalua WHERE clave_res = '${clave}'`
    );
    const evals: EvaluaResponse[] = JSON.parse(JSON.stringify(data));

    for (const evalua of evals) {
      let evaluacion = new EvaluacionRestaurante();

      evaluacion.cliente = await this.getCliente(evalua.usuario);
      evaluacion.comentario = evalua.comentario;
      evaluacion.puntuacion = evalua.puntuacion;

      evaluaciones.push(evaluacion);
    }

    return evaluaciones;
  }

  @Query((returns) => [EvaluacionCliente])
  async evaluacionesCliente(@Arg("nombreUsuario") nombreUsuario: string) {
    const db = await dbConnection();
    let evaluaciones: EvaluacionCliente[] = [];

    let [data, _] = await db.execute(
      `SELECT * FROM evalua WHERE usuario = '${nombreUsuario}'`
    );
    const evals: EvaluaResponse[] = JSON.parse(JSON.stringify(data));

    for (const evalua of evals) {
      let evaluacion = new EvaluacionCliente();

      evaluacion.restaurante = await this.getRestaurante(evalua.clave_res);
      evaluacion.comentario = evalua.comentario;
      evaluacion.puntuacion = evalua.puntuacion;

      evaluaciones.push(evaluacion);
    }

    return evaluaciones;
  }

  @Query((returns) => Evaluacion)
  async evaluacion(
    @Arg("nombreUsuario") nombreUsuario: string,
    @Arg("clave") clave: string
  ) {
    const db = await dbConnection();

    let [data, _] = await db.execute(
      `SELECT * FROM evalua WHERE clave_res = '${clave}' AND usuario = '${nombreUsuario}'`
    );
    const evals: EvaluaResponse[] = JSON.parse(JSON.stringify(data));
    const evalua = evals[0];

    let evaluacion = new Evaluacion();

    evaluacion.restaurante = await this.getRestaurante(evalua.clave_res);
    evaluacion.cliente = await this.getCliente(evalua.usuario);
    evaluacion.comentario = evalua.comentario;
    evaluacion.puntuacion = evalua.puntuacion;

    return evaluacion;
  }

  private async getCliente(nombreUsuario: string) {
    return await new ClienteQuery().cliente(nombreUsuario);
  }

  private async getRestaurante(clave: string) {
    return await new RestauranteQuery().restaurante(clave);
  }
}
