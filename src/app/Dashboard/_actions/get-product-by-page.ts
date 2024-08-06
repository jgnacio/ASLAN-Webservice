"use server";
import getProduct from "@/Resources/UNICOM/APIConnection";
import { Product } from "@/Types/ProductTypes";

export const getProductsByPage = async ({ page }: { page: number }) => {
  // TODO Implementar una forma de paginar los productos
  const request = {
    rango_articulos_informe: {
      desde_articulo_nro: page,
      hasta_articulo_nro: page + 1,
    },
  };
  const products = new ProductsList(await getProduct(request));
  products.validate();
  return products.products;
};

class ProductsList {
  products: Product;
  constructor(products: any) {
    this.products = products;
  }

  validate() {
    if (!this.products) {
      throw new Error("No products found");
    }
  }
}
