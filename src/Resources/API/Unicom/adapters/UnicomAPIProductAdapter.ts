// import { getTokenDev } from "@/adapters/Auth/token(remove-on-prod)";

import { IProductRepository } from "@/domain/product/repositories/IProductRepository";
import {
  Product,
  ProductAvailability,
  ProductCategory,
  ProductPartNumber,
  ProductType,
} from "@/domain/product/entities/Product";
import {
  defaultUnicomAPIProductRequest,
  UnicomAPIProductRequest,
} from "../UnicomAPIRequets";
import { UnicomAPIOfferCombo } from "../entities/Product/UnicomAPIOfferCombo";
import {
  TDatosPartNumber,
  UnicomAPIProduct,
} from "../entities/Product/UnicomAPIProduct";
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

    const datosPartnumbers = response.datos_partnumbers ?? [];

    const mappedPartnumbers: ProductPartNumber[] = datosPartnumbers.map(
      (partNumber: TDatosPartNumber) => {
        const { partnumber, ean, unidades_x_caja } = partNumber;
        return {
          partNumber: partnumber || "",
          ean: ean || 0,
          units_x_box: unidades_x_caja || 0,
        };
      }
    );

    let mappedAvailability: ProductAvailability = "out_of_stock";

    if (response.disponibilidad === "con_inventario") {
      mappedAvailability = "in_stock";
    }

    if (response.disponibilidad === "sin_inventario") {
      mappedAvailability = "out_of_stock";
    }

    if (response.disponibilidad === "consultar") {
      mappedAvailability = "on_demand";
    }

    try {
      const product = new Product({
        partNumber: mappedPartnumbers,
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
        availability: mappedAvailability,
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

    // console.log("response", response);

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

    // const combosOffersResponse = this.fetchProducts({
    //   method: "GET",
    //   route: "/ofertas/combos",
    // });

    const pcOffersResponse = this.fetchProducts({
      method: "GET",
      route: "/ofertas/equipos",
    });

    // Merge all responses on one array
    const response = await Promise.all([
      onSaleResponse,
      // pcOffersResponse,
      // combosOffersResponse,
    ]);

    console.log("response", response);

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
          let mappedPartnumber = [
            {
              partNumber: "",
              ean: 0,
              units_x_box: 0,
            },
          ];

          if (item.datos_ultimo_partnumber) {
            const { partnumber, ean, unidades_x_caja } =
              item.datos_ultimo_partnumber;
            mappedPartnumber = [
              {
                partNumber: partnumber || "",
                ean: ean || 0,
                units_x_box: unidades_x_caja || 0,
              },
            ];
          }

          let mappedAvailability: ProductAvailability = "out_of_stock";

          if (item.disponibilidad === "con_inventario") {
            mappedAvailability = "in_stock";
          }

          if (item.disponibilidad === "sin_inventario") {
            mappedAvailability = "out_of_stock";
          }

          if (item.disponibilidad === "consultar") {
            mappedAvailability = "on_demand";
          }

          if (item.articulos && item.articulos.length > 0) {
            return new Product({
              title: item.producto,
              sku: item.codigo || "",
              price: item.precio,
              partNumber: mappedPartnumber,
              description: "",
              images: item.fotos || [],
              category: item.grupo_articulo.descripcion || "",
              availability: "out_of_stock",
              marca: item.marca.marca || "",
              stock: item.inventario || 0,
              submitDate: new Date(),
              estimatedArrivalDate: item.fecha_estimada_llegada
                ? new Date(item.fecha_estimada_llegada)
                : null,
              guaranteeDays: item.garantia_dias || 0,
            });
          }
          console.log("item", item);

          return new Product({
            title: item.producto,
            sku: item.codigo || "",
            price: item.precio,
            partNumber: mappedPartnumber,
            description: item.descripcion || "",
            images: item.fotos || [],
            category: item.grupo_articulo.descripcion || "",
            availability: mappedAvailability || "out_of_stock",
            marca: item.marca.marca || "",
            stock: item.inventario || 0,
            submitDate: new Date(),
            estimatedArrivalDate: item.fecha_estimada_llegada
              ? new Date(item.fecha_estimada_llegada)
              : null,
            guaranteeDays: item.garantia_dias || 0,
          });
        } catch (error) {
          console.error("Error:", error);
          return null;
        }
      }
    );

    // Clean all null values
    const productsFiltered = products.filter(
      (product): product is Product => product !== null
    );
    // console.log("productsFiltered", productsFiltered);

    return productsFiltered;
  }
}
