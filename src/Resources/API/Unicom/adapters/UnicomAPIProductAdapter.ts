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
import { UnicomAPIProductDetailResponse } from "../entities/Product/UnicomAPIProductDetailResponse";
import { UnicomAPIProductDetailRequest } from "../entities/Product/UnicomAPIProductDetailRequest";

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
  }): Promise<
    | UnicomAPIProduct[]
    | UnicomAPIOfferCombo[]
    | UnicomAPIOfferProduct[]
    | UnicomAPIPreAssembledPC[]
    | null
  > {
    const response:
      | UnicomAPIProduct[]
      | UnicomAPIOfferCombo[]
      | UnicomAPIOfferProduct[]
      | UnicomAPIPreAssembledPC[] = await fetch(this.baseUrl + route, {
      method,
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + this.token,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        // console.log("res", res);
        if (!res.ok) {
          return null;
        }
        return res.json();
      })
      .catch((error) => {
        console.error("Error:", error);
        return null;
      });

    if (!response) {
      return null;
    }

    return response;
  }

  private async fetchProduct({
    body,
    route,
    method = "GET",
  }: {
    route: string;
    body?: UnicomAPIProductDetailRequest;
    method?: string;
  }): Promise<UnicomAPIProductDetailResponse | null> {
    const response: UnicomAPIProductDetailResponse = await fetch(
      this.baseUrl + route,
      {
        method,
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + this.token,
        },
        body: JSON.stringify(body),
      }
    )
      .then((res) => {
        // console.log("res", res);
        if (!res.ok) {
          return null;
        }
        return res.json();
      })
      .catch((error) => {
        console.error("Error:", error);
        return null;
      });

    if (!response) {
      return null;
    }

    return response;
  }

  async getBySKU(sku: string): Promise<Product | null> {
    const response = await this.fetchProduct({
      method: "GET",
      route: `/articulos/${sku}`,
    });

    if (!response) {
      return null;
    }

    console.log(response);

    try {
      const product = new Product({
        sku: response.codigo || "",
        price: response.precio || 0,
        title: response.producto || "",
        description: response.descripcion || "",
        images: [],
        category: {
          id: response.grupo_articulo?.codigo_grupo || "",
          name: response.grupo_articulo?.descripcion || "",
        },
        marca: response.marca?.marca || "",
        stock: response.inventario || 0,
        submitDate: new Date(),
        estimatedArrivalDate: response.fecha_estimada_llegada
          ? new Date(response.fecha_estimada_llegada)
          : null,
        guaranteeDays: response.garantia_dias,
      });
      return product;
    } catch {
      return null;
    }
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
    const response = await this.fetchProducts({
      method: "PUT",
      body: UnicomProductRequest,
      route: "/articulos",
    });

    if (!response) {
      return [];
    }

    const products = this.mapUnicomProduct(response);

    return products;
  }

  async getFeatured(request?: UnicomAPIProductRequest): Promise<Product[]> {
    const defaultRequest = request || defaultUnicomAPIProductRequest;
    // Only featured
    defaultRequest.solo_articulos_destacados = true;
    const UnicomProductRequest = this.mapToUnicomRequest(defaultRequest);
    const response = await this.fetchProducts({
      method: "PUT",
      body: UnicomProductRequest,
      route: "/articulos",
    });

    if (!response) {
      return [];
    }

    const products = this.mapUnicomProduct(response);

    return products;
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
    const flatResponse = response.flat();

    // console.log("flatResponse", flatResponse);

    const products = this.mapUnicomProduct(flatResponse as Product[]);

    return products;
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

  private mapUnicomProduct(
    productsResponse:
      | UnicomAPIProduct[]
      | UnicomAPIOfferCombo[]
      | UnicomAPIOfferProduct[]
      | UnicomAPIPreAssembledPC[]
      | null
  ): Product[] {
    if (!productsResponse) {
      return [];
    }
    const products = productsResponse.map(
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
      (product): product is Product => product !== null
    );

    return productsFiltered;
  }
}
