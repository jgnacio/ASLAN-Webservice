import { Product, Provider } from "@/domain/product/entities/Product";
import { IProductRepository } from "@/domain/product/repositories/IProductRepository";
import axios from "axios";
import {
  PCServiceProductByDate,
  PCServiceProductDetails,
  PCServiceRootObject,
} from "../entities/Product/PCServiceAPIProduct";
import {
  defaultPCServiceRelevantCategories,
  PCServiceCategoryCodeType,
} from "../PCServiceAPIRequest";
import { PCServiceAPITokenAdapter } from "./PCServiceAPITokenAdapter";
import { getDateInYYYY } from "@/lib/functions/DateFunctions";
type Request = {
  body?: any;
  route: string;
  method: string;
};
type FetchProductsByCategory = {
  category: string;
  id?: never;
  request?: Request;
};

type FetchProductsById = {
  id: number;
  category?: never;
  request?: Request;
};
type FetchProductsRequest = {
  id?: number;
  category?: never;
  request: Request;
};

type FetchProductsParams =
  | FetchProductsByCategory
  | FetchProductsById
  | FetchProductsRequest;

export const logoPCService: Provider = {
  name: "PC Service",
  mainPageUrl: "https://www.pcservice.com.uy/",
  searchPageUrl:
    "https://www.pcservice.com.uy/others/PCsResults.jsp?queryref=17031901&reforderby=relev&querypage=1&searchstr=",
  logoUrl:
    "https://res.cloudinary.com/dhq5ewbyu/image/upload/v1729171066/ASLAN/hao6sciafwm5rqllsknh.png",
};

export class PCServiceAPIProductAdapter implements IProductRepository {
  private readonly API_PCSERVICE_URL = process.env.API_PCSERVICE_URL;

  constructor() {}

  private async fetchProduct(id: number): Promise<any> {
    const token = await new PCServiceAPITokenAdapter().getToken();
    const response = await axios
      .get(`${this.API_PCSERVICE_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      })
      .then((response) => {
        return response.data as PCServiceProductDetails;
      });
    console.log(response);
    return response;
  }

  private async fetchProducts(params: FetchProductsParams): Promise<Product[]> {
    const token = await new PCServiceAPITokenAdapter().getToken();
    if (params.category) {
      let category: PCServiceCategoryCodeType = {
        name: "",
        nameES: "",
        code: 0,
        subCategories: [
          {
            name: "",
            nameES: "",
            code: 0,
          },
        ],
      };

      console.log(params.category);

      category = defaultPCServiceRelevantCategories.find(
        (category) => category.nameES === params.category
      ) as PCServiceCategoryCodeType;

      if (!category) {
        return [];
      }

      let productListMapped: Product[][] = [];

      const response = await Promise.all(
        category.subCategories.map(async (subCategory) => {
          const productsByCategories = await axios
            .get(
              `${this.API_PCSERVICE_URL}/categories/${category.code}/${subCategory.code}/products`,
              {
                headers: {
                  Authorization: `Bearer ${token.token}`,
                },
              }
            )
            .then((response) => {
              return response.data as PCServiceRootObject;
            })
            .catch((error) => {
              throw new Error(error);
            });
          const productList = await Promise.all(
            productsByCategories.childs.map(async (child) => {
              const productsWithDetails = await Promise.all(
                child.products.map((product) => {
                  return this.fetchProduct(
                    product.id
                  ) as Promise<PCServiceProductDetails>;
                })
              );

              // Llama a productMapperList para mapear los productos con detalles
              return this.productMapperList(
                productsWithDetails,
                category
              ).flat();
            })
          );
          productListMapped.push(productList.flat());
          return productList.flat();
        })
      );

      return productListMapped.flat();
    } else {
      const { method, route, body } = params.request || {};

      const response = await axios({
        method: method,
        url: `${this.API_PCSERVICE_URL}${route}`,
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      })
        .then((response) => {
          return response.data as PCServiceProductByDate[];
        })
        .catch((error) => {
          throw new Error(error);
        });

      const productList = response.map((product) => {
        let category: PCServiceCategoryCodeType = {
          name: "Not Defined",
          nameES: "Not Defined",
          code: 0,
          subCategories: [
            {
              name: "Not Defined",
              nameES: "Not Defined",
              code: 0,
            },
          ],
        };

        // Busca en las categorías de producto
        const foundCategory = product.categories.find((cat) => {
          return defaultPCServiceRelevantCategories.some(
            (categoryCode) => categoryCode.code === cat.id
          );
        });

        // Si se encuentra una categoría, mapea a PCServiceCategoryCodeType
        if (foundCategory) {
          const categoryCode = defaultPCServiceRelevantCategories.find(
            (categoryCode) => categoryCode.code === foundCategory.id
          );

          if (categoryCode) {
            category = categoryCode; // Asignar la categoría encontrada
          }
        }

        return this.productMapper(product, category);
      });
      return productList.flat();
    }
  }

  async getBySKU(sku: string): Promise<Product | null> {
    console.log(sku);
    const skuNumber = parseInt(sku);
    const product = await this.fetchProduct(skuNumber).then((product) => {
      const categoryName = product.title.split(" ")[0];
      return this.productMapper(product, {
        name: categoryName,
        nameES: categoryName,
        code: 0,
        subCategories: [
          {
            nameES: categoryName,
            name: categoryName,
            code: 0,
          },
        ],
      });
    });
    return product;
  }
  async getByCategory(category: string): Promise<Product[]> {
    const productsByCategory = await this.fetchProducts({
      category: category,
    });

    return productsByCategory;
  }
  getAll(): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  getFeatured(request?: any): Promise<Product[]> {
    const productsList = this.fetchProducts({
      request: {
        route: `/products/bydate/?from=${getDateInYYYY(-3 * 60 * 60 * 1000)}`,
        method: "GET",
      },
    });

    return productsList;
  }
  getOffers(request?: any): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }

  productMapper(
    product: PCServiceProductDetails,
    category: PCServiceCategoryCodeType
  ): Product {
    const newProduct = new Product({
      partNumber: [
        {
          partNumber: product.sku,
          ean: 0,
          units_x_box: 1,
        },
      ],
      sku: product.id.toString(),
      title: product.title,
      description: product.body,
      price: product.price.price,
      provider: logoPCService,
      category: {
        id: category.code.toString(),
        name: category.name,
      },
      stock: product.availability.stock,
      availability: product.availability.availability
        ? "in_stock"
        : "out_of_stock",
      images: [""],
      marca: product.extraData.brand || "Not Defined",
      submitDate: new Date(),
    });

    return newProduct;
  }
  productMapperList(
    products: PCServiceProductDetails[],
    category: PCServiceCategoryCodeType
  ): Product[] {
    return products.map((product) => this.productMapper(product, category));
  }
}
