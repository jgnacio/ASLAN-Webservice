// import { getTokenDev } from "@/adapters/Auth/token(remove-on-prod)";

import { IProductRepository } from "@/domain/product/repositories/IProductRepository";
import {
  Product,
  ProductCategory,
  ProductType,
} from "@/domain/product/entities/Product";
import {
  defaultUnicomAPIProductRequest,
  UnicomAPIProductRequest,
} from "../UnicomAPIRequets";
import { UnicomAPIOfferCombo } from "../entities/Product/UnicomAPIOfferCombo";
import { UnicomAPIProduct } from "../entities/Product/UnicomAPIProduct";
import { UnicomAPIOfferProduct } from "../entities/Product/UnicomAPIOfferProduct";
import { UnicomAPIPreAssembledPC } from "../entities/Product/UnicomAPIPreAssembledPC";
import {
  ProductClassToObj,
  ProductObjToClass,
} from "@/lib/Utils/Functions/ClassToObject";

const API_UNICOM_TOKEN = process.env.API_UNICOM_TOKEN;
const API_UNICOM_URL = process.env.API_UNICOM_URL;

export class UnicomAPIProductAdapter implements IProductRepository {
  private readonly baseUrl = API_UNICOM_URL;
  private readonly token = API_UNICOM_TOKEN;

  constructor() {}

  private async fetchProducts({
    body,
    route,
    method = "GET",
  }: {
    route: string;
    body?: UnicomAPIProductRequest;
    method?: string;
  }): Promise<Product[]> {
    const response:
      | UnicomAPIProduct
      | UnicomAPIOfferCombo
      | UnicomAPIOfferProduct
      | UnicomAPIPreAssembledPC = await fetch(this.baseUrl + route, {
      method,
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + this.token,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        // console.log("res", res);
        return res.json();
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    if (!response) {
      return [];
    }

    const products = response.map(
      (
        item:
          | UnicomAPIProduct
          | UnicomAPIOfferCombo
          | UnicomAPIOfferProduct
          | UnicomAPIPreAssembledPC
      ) => {
        try {
          return new Product({
            sku: item.codigo,
            price: item.precio,
            title: item.producto,
            description: item.descripcion,
            images: item.fotos,
            category: item.grupo_articulo.descripcion,
            marca: item.marca.marca,
            stock: item.inventario,
            submitDate: new Date(),
            estimatedArrivalDate: item.fecha_estimada_llegada
              ? new Date(item.fecha_estimada_llegada)
              : null,
            guaranteeDays: item.garantia_dias,
          });
        } catch {
          return null;
        }
      }
    );

    // Clean all null values
    const productsFiltered = products.filter(
      (
        product:
          | UnicomAPIOfferCombo
          | UnicomAPIOfferProduct
          | UnicomAPIProduct
          | UnicomAPIPreAssembledPC
          | null
      ) => product !== null
    );

    return productsFiltered;
  }

  async getById(id: number): Promise<Product | null> {
    return null;
  }

  async getAll({
    request,
    page,
    category,
  }: {
    request?: UnicomAPIProductRequest;
    page?: number;
    category?: string;
  }): Promise<Product[]> {
    const defaultRequest: UnicomAPIProductRequest =
      request || defaultUnicomAPIProductRequest;
    if (page) {
      defaultRequest.rango_articulos_informe.hasta_articulo_nro = page * 200;
      defaultRequest.rango_articulos_informe.desde_articulo_nro =
        200 * page - 199;
    }
    if (category) {
      defaultRequest.codigo_grupo = category;
    }
    const UnicomProductRequest = this.mapToUnicomRequest(defaultRequest);
    const response = this.fetchProducts({
      method: "PUT",
      body: UnicomProductRequest,
      route: "/articulos",
    });
    return response;
  }

  async getFeatured(request?: UnicomAPIProductRequest): Promise<Product[]> {
    const defaultRequest = request || defaultUnicomAPIProductRequest;
    // Only featured
    defaultRequest.solo_articulos_destacados = true;
    const UnicomProductRequest = this.mapToUnicomRequest(defaultRequest);
    const response = this.fetchProducts({
      method: "PUT",
      body: UnicomProductRequest,
      route: "/articulos",
    });
    return response;
  }

  async getOffers(request?: UnicomAPIProductRequest): Promise<Product[]> {
    const onSaleResponse = this.fetchProducts({
      method: "GET",
      route: "/ofertas/liquidaciones",
    });

    const combosOffersResponse = this.fetchProducts({
      method: "GET",
      route: "/ofertas/combos",
    });

    const pcOffersResponse = this.fetchProducts({
      method: "GET",
      route: "/ofertas/equipos",
    });

    // Merge all responses on one array
    const response = await Promise.all([
      onSaleResponse,
      combosOffersResponse,
      pcOffersResponse,
    ]);

    // Validate response
    if (!response) {
      return [];
    }

    return response.flat();
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