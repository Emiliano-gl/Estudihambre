import { Arg, Query, Resolver } from "type-graphql";
import { dbConnection } from "../../config/database";
import { Socio } from "../models/SocioModel";

@Resolver()
export class SocioQuery {
  @Query((returns) => [Socio])
  async socios() {
    const db = await dbConnection();

    const [data, _] = await db.execute("SELECT * FROM socio");

    return data;
  }

  @Query((returns) => Socio)
  async socio(@Arg("rfc") rfc: string) {
    const db = await dbConnection();

    const [data, _] = await db.execute(
      `SELECT * FROM socio WHERE rfc = '${rfc}'`
    );
    const dataParse: Socio[] = JSON.parse(JSON.stringify(data));

    return dataParse[0];
  }
}
