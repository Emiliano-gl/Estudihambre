import { Arg, Query, Resolver } from "type-graphql";
import { Restaurante } from "../models/RestauranteModel";
import { RestauranteResponse, TipoComida } from "../inputs/RestauranteInput";
import { dbConnection } from "../../config/database";
import { SocioSeguro } from "../models/SocioModel";

@Resolver()
export class RestauranteQuery {
  @Query((returns) => [Restaurante])
  async restaurantes() {
    const db = await dbConnection();
    let restaurantes: Restaurante[] = [];

    const [data, _] = await db.execute(
      "SELECT * FROM restaurante INNER JOIN socio ON rfc_socio = socio.rfc"
    );
    const dataParse: RestauranteResponse[] = JSON.parse(JSON.stringify(data));

    for (const res of dataParse) {
      let resAux = new Restaurante();
      let propietarioAux = new SocioSeguro();

      propietarioAux.correo = res.correo;
      propietarioAux.nombre = res.nombre;
      propietarioAux.rfc = res.rfc_socio;

      resAux.clave = res.clave;
      resAux.direccion = res.direccion;
      resAux.nombre = res.nombreEstablecimiento;
      resAux.precioMaximo = res.precioMaximo;
      resAux.precioMinimo = res.precioMinimo;
      resAux.telefono = res.telefono;
      resAux.propietario = propietarioAux;
      resAux.tipoComida = await this.getTipoComida(res.clave);

      restaurantes.push(resAux);
    }

    return restaurantes;
  }

  @Query((returns) => Restaurante)
  async restaurante(@Arg("clave") clave: string) {
    const db = await dbConnection();
    let resAux = new Restaurante();

    const [data, _] = await db.execute(
      `SELECT * FROM restaurante INNER JOIN socio ON rfc_socio = socio.rfc WHERE clave = '${clave}'`
    );
    const rest: RestauranteResponse = JSON.parse(JSON.stringify(data))[0];

    let propietarioAux = new SocioSeguro();

    propietarioAux.correo = rest.correo;
    propietarioAux.nombre = rest.nombre;
    propietarioAux.rfc = rest.rfc_socio;

    resAux.clave = rest.clave;
    resAux.direccion = rest.direccion;
    resAux.nombre = rest.nombreEstablecimiento;
    resAux.precioMaximo = rest.precioMaximo;
    resAux.precioMinimo = rest.precioMinimo;
    resAux.telefono = rest.telefono;
    resAux.propietario = propietarioAux;
    resAux.tipoComida = await this.getTipoComida(rest.clave);

    return resAux;
  }

  private async getTipoComida(clave: string) {
    const db = await dbConnection();

    let [data, _] = await db.execute(
      `SELECT * FROM tipo_comida_restaurante WHERE clave_res = '${clave}'`
    );
    const tiposComidas: TipoComida[] = JSON.parse(JSON.stringify(data));
    return tiposComidas.map((comida) => comida.tipo_de_comida);
  }
}
