"use server";
import { Product } from "@/domain/product/Product";
import { getProductsByPage } from "./_actions/get-product-by-page";

export default async function ProductList() {
  const productsList = await getProductsByPage({ page: 0 });
  console.log(productsList);
  return (
    <div>
      <h2>ProductList</h2>
      <div>
        {productsList?.map((product: Product) => (
          <div
            key={product.getId()}
            className="flex flex-col border-1 border-black"
          >
            <h3>Producto:{product.title}</h3>
            <p>Precio:{product.getPrice()}</p>
            <p>Stock:{product.stock}</p>
            {/* <p>Disponibilidad:{product.disponibilidad}</p> */}
            {/* <p>En Remate:{product.estaEnRemate || "no"}</p> */}
            {/* <p>Marca:{product.marca?.marca}</p> */}
            {/* <p>Arribo:{product.fechaEstimadaLlegada}</p> */}
            <p>Codigo:{product.getSku()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
