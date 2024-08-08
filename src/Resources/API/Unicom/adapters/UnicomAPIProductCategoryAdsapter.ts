import { IProductCategoryRepository } from "@/domain/product/repositories/IProductCategoryRepository";
import { UnicomAPICategory } from "../entities/Category/UnicomAPICategory";
import {
  defaultUnicomAPIProductRequest,
  UnicomAPIProductRequest,
} from "../UnicomAPIRequets";
import { ProductCategory } from "@/domain/product/entities/Product";

const API_UNICOM_TOKEN = process.env.API_UNICOM_TOKEN;
const API_UNICOM_URL = process.env.API_UNICOM_URL;

export class UnicomAPIProductCategoryAdapter
  implements IProductCategoryRepository
{
  private readonly baseUrl = API_UNICOM_URL;
  private readonly token = API_UNICOM_TOKEN;

  async fetchCategories({
    body,
    route,
    method = "GET",
  }: {
    route: string;
    body?: UnicomAPIProductRequest;
    method?: string;
  }): Promise<UnicomAPICategory[]> {
    const response: UnicomAPICategory[] = await fetch(this.baseUrl + route, {
      method,
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
    console.log("Categories", response);

    return response;
  }

  async getById(id: string): Promise<ProductCategory> {
    return {} as ProductCategory;
  }

  async getAll(): Promise<ProductCategory[]> {
    const defaultCategoryRequest = defaultUnicomAPIProductRequest;

    const categories = await this.fetchCategories({
      method: "GET",
      route: "/articulos/grupos_articulos",
      // body: defaultCategoryRequest,
    });
    // console.log("Categories", categories);

    if (!categories) {
      return [];
    }

    const mappedCategories = this.UnicomMapCategories(categories);
    // console.log("Mapped categories", mappedCategories);

    return mappedCategories;
  }

  private UnicomMapSubCategory(
    category: UnicomAPICategory
  ): ProductCategory | null {
    if (!category.codigo_grupo || !category.descripcion) {
      return null;
    }
    return {
      id: category.codigo_grupo,
      name: category.descripcion,
      subCategories:
        category.gruposHijos
          ?.map(this.UnicomMapSubCategory.bind(this))
          .filter(
            (subCategory): subCategory is ProductCategory =>
              subCategory !== null
          ) || [],
    };
  }
  private UnicomMapCategories(
    categories: UnicomAPICategory[]
  ): ProductCategory[] {
    const mappedCategories: ProductCategory[] = categories
      .map((category: UnicomAPICategory) => this.UnicomMapSubCategory(category))
      .filter((category): category is ProductCategory => category !== null);
    return mappedCategories;
  }
}
