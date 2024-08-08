"use server";
import { Product, ProductType } from "@/domain/product/entities/Product";
import { getProductsByPage } from "../_actions/get-product-by-page";
import { getRelevantProducts } from "../_actions/get-relevant-products";

export default async function ProductList() {
  const productsList = await getRelevantProducts({ page: 1 });
  // console.log(productsList);
  return (
    <div>
      <h2>ProductList</h2>
      <div>
        {productsList?.map((product: ProductType) => (
          <div key={product.id} className="flex flex-col border-1 border-black">
            <h3>Producto:{product.title}</h3>
            <p>Precio:{product.price}</p>
            <p>Stock:{product.stock}</p>
            <p>Marca:{product.marca}</p>
            <p>{product.category.name}</p>
            <p>Codigo:{product.sku}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
