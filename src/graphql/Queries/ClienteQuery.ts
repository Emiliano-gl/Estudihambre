import { Arg, Query, Resolver } from "type-graphql";
import { dbConnection } from "../../config/database";
import { Cliente } from "../models/ClienteModel";
import { TipoComida } from "../inputs/ClienteInput";

@Resolver()
export class ClienteQuery {
  @Query((returns) => [Cliente])
  async clientes() {
    const db = await dbConnection();
    let clientes: Cliente[] = [];

    const [data, _] = await db.execute("SELECT * FROM cliente");
    const dataParse: Cliente[] = JSON.parse(JSON.stringify(data));

    for (const cliente of dataParse) {
      let clienteAux = cliente;
      clienteAux.gustos = await this.getGustos(cliente.nombreUsuario);

      clientes.push(clienteAux);
    }

    return clientes;
  }

  @Query((returns) => Cliente)
  async cliente(@Arg("nombreUsuario") nombreUsuario: string) {
    const db = await dbConnection();

    const [data, _] = await db.execute(
      `SELECT * FROM cliente WHERE nombreUsuario = '${nombreUsuario}'`
    );
    const dataParse: Cliente[] = JSON.parse(JSON.stringify(data));
    let cliente = dataParse[0];

    cliente.gustos = await this.getGustos(nombreUsuario);

    return cliente;
  }

  private async getGustos(nombreUsuario: string) {
    const db = await dbConnection();

    const [data, _] = await db.execute(
      `SELECT * FROM tipo_comida_cliente WHERE usuario = '${nombreUsuario}'`
    );
    const gustos: TipoComida[] = JSON.parse(JSON.stringify(data));

    return gustos.map((gusto) => gusto.tipo_de_comida);
  }
}
