// import { getTokenDev } from "@/adapters/Auth/token(remove-on-prod)";

import { IProductRepository } from "@/domain/product/repositories/IProductRepository";
import { Product } from "@/domain/product/Product";
import {
  defaultUnicomAPIProductRequest,
  UnicomAPIProductRequest,
} from "./UnicomAPIRequets";
import { v4 as uuidv4 } from "uuid";

const API_UNICOM_TOKEN = process.env.API_UNICOM_TOKEN;
const API_UNICOM_URL = process.env.API_UNICOM_URL;

export class UnicomAPIProductAdapter implements IProductRepository {
  private readonly baseUrl = API_UNICOM_URL;
  private readonly token = API_UNICOM_TOKEN;

  constructor() {}

  private async fetchProducts(
    body: UnicomAPIProductRequest
  ): Promise<Product[]> {
    const response = await fetch(this.baseUrl + "/articulos", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + this.token,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        console.log("res", res);
        return res.json();
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    if (!response) {
      return [];
    }

    return response.map(
      (item: any) =>
        new Product(
          uuidv4(),
          item.codigo,
          item.precio,
          item.producto,
          item.detalle,
          [item.imagen],
          item.grupo,
          item.marca,
          item.inventario,
          new Date(item.ultima_actualizacion)
        )
    );
  }

  async getById(id: number): Promise<Product | null> {
    return null;
  }

  async getAll(request?: UnicomAPIProductRequest): Promise<Product[]> {
    const finalRequest = request || defaultUnicomAPIProductRequest;
    const UnicomProductRequest = this.mapToUnicomRequest(finalRequest);
    return this.fetchProducts(UnicomProductRequest);
  }

  async save(product: Product): Promise<void> {
    return;
  }

  async update(product: Product): Promise<void> {
    return;
  }

  async delete(id: number): Promise<void> {
    return;
  }

  private mapToUnicomRequest(
    request: UnicomAPIProductRequest
  ): UnicomAPIProductRequest {
    const formattedData: UnicomAPIProductRequest = {
      solo_modificados_desde: request.solo_modificados_desde || "",
      tipo_informe: request.tipo_informe || "completo",
      solo_articulos_destacados: request.solo_articulos_destacados || false,
      solo_favoritos: request.solo_favoritos || false,
      codigo_grupo: request.codigo_grupo || "",
      codigo_marca: request.codigo_marca || "",
      rango_articulos_informe: {
        desde_articulo_nro: request.rango_articulos_informe?.desde_articulo_nro,
        hasta_articulo_nro: request.rango_articulos_informe?.hasta_articulo_nro,
      },
    };

    // Eliminar campos vacíos si son ""
    Object.keys(formattedData).forEach(
      (key) => formattedData[key] === "" && delete formattedData[key]
    );
    return formattedData;
  }
}
