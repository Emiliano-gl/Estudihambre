import { Arg, Mutation, Resolver } from "type-graphql";
import { dbConnection } from "../../config/database";
import { ClienteInput, ClienteInputUpdate } from "../inputs/ClienteInput";
import { Cliente } from "../models/ClienteModel";
import { ClienteQuery } from "../Queries/ClienteQuery";

@Resolver()
export class ClienteMutation {
  @Mutation((returns) => Cliente)
  async crearCliente(
    @Arg("input", (type) => ClienteInput) input: ClienteInput
  ) {
    const db = await dbConnection();

    await db.execute(`INSERT INTO cliente VALUES(?, ?, ?, ?)`, [
      input.correo,
      input.claveAcceso,
      input.nombreUsuario,
      input.nombre,
    ]);

    if (input.gustos) {
      for (const gusto of input.gustos) {
        await db.execute(`INSERT INTO tipo_comida_cliente VALUES(?, ?)`, [
          input.nombreUsuario,
          gusto,
        ]);
      }
    } else {
      input.gustos = [];
    }

    return input;
  }

  @Mutation((returns) => Cliente)
  async agregarGustos(
    @Arg("nombreUsuario") nombreUsuario: string,
    @Arg("gustos", (type) => [String]) gustos: string[]
  ) {
    const db = await dbConnection();

    for (const gusto of gustos) {
      await db.execute(`INSERT INTO tipo_comida_cliente VALUES(?, ?)`, [
        nombreUsuario,
        gusto,
      ]);
    }

    return await new ClienteQuery().cliente(nombreUsuario);
  }

  @Mutation((returns) => Boolean)
  async borrarCliente(@Arg("nombreUsuario") nombreUsuario: string) {
    const db = await dbConnection();

    const [data, _] = await db.execute(
      `SELECT * FROM cliente WHERE nombreUsuario = '${nombreUsuario}'`
    );
    const dataParse: Cliente[] = JSON.parse(JSON.stringify(data));

    if (dataParse.length != 0) {
      await db.execute(
        `DELETE FROM cliente WHERE nombreUsuario = '${nombreUsuario}'`
      );
      return true;
    } else {
      return false;
    }
  }

  @Mutation((returns) => Cliente)
  async actualizarCliente(
    @Arg("nombreUsuario") nombreUsuario: string,
    @Arg("input", (type) => ClienteInputUpdate, { nullable: true }) input: ClienteInputUpdate
  ) {
    const db = await dbConnection();

    if (Object.keys(input).length != 0) {
      let sqlQuery = `UPDATE cliente SET `;

      if (input.claveAcceso) {
        sqlQuery += `claveAcceso = '${input.claveAcceso}' `;
      }

      if (input.nombre) {
        sqlQuery += `nombre = '${input.nombre}' `;
      }

      if (input.gustos) {
        await db.execute(
          `DELETE FROM tipo_comida_cliente WHERE usuario = '${nombreUsuario}'`
        );
        await this.agregarGustos(nombreUsuario, input.gustos);
      }

      await db.execute(`${sqlQuery} WHERE nombreUsuario = '${nombreUsuario}'`);
    }

    return await new ClienteQuery().cliente(nombreUsuario);
  }
}
