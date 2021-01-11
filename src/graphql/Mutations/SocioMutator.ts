import { Arg, Mutation, Resolver } from "type-graphql";
import { dbConnection } from "../../config/database";
import { SocioInput, SocioInputUpdate } from "../inputs/SocioInput";
import { Socio } from "../models/SocioModel";
import { SocioQuery } from "../Queries/SocioQuery";

@Resolver()
export class SocioMutation {
  @Mutation((returns) => Socio)
  async crearSocio(@Arg("input", (type) => SocioInput) input: SocioInput) {
    const db = await dbConnection();

    await db.execute(`INSERT INTO socio VALUES(?, ?, ?, ?)`, [
      input.rfc,
      input.correo,
      input.claveAcceso,
      input.nombre,
    ]);

    return input;
  }

  @Mutation((returns) => Boolean)
  async borrarSocio(@Arg("rfc") rfc: string) {
    const db = await dbConnection();

    const [data, _] = await db.execute(
      `SELECT * FROM socio WHERE rfc = '${rfc}'`
    );
    const dataParse: Socio[] = JSON.parse(JSON.stringify(data));

    if (dataParse.length != 0) {
      await db.execute(`DELETE FROM socio WHERE rfc = '${rfc}'`);
      return true;
    } else {
      return false;
    }
  }

  @Mutation((returns) => Socio)
  async actualizarSocio(
    @Arg("rfc") rfc: string,
    @Arg("input", (type) => SocioInputUpdate, { nullable: true }) input: SocioInputUpdate
  ) {
    const db = await dbConnection();

    if (Object.keys(input).length != 0) {
      let sqlQuery = `UPDATE socio SET `;

      if (input.claveAcceso) {
        sqlQuery += `claveAcceso = '${input.claveAcceso}' `;
      }

      if (input.nombre) {
        sqlQuery += `nombre = '${input.nombre}' `;
      }

      if (input.correo) {
        sqlQuery += `correo = '${input.correo}' `;
      }

      await db.execute(`${sqlQuery} WHERE rfc = '${rfc}'`);
    }

    return await new SocioQuery().socio(rfc);
  }
}
