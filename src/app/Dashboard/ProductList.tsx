"use server";
import { Product } from "@/Types/ProductTypes";
import { getProductsByPage } from "./_actions/get-product-by-page";
import { useMutation } from "@tanstack/react-query";

export default async function ProductList() {
  const productsList = await getProductsByPage({ page: 0 });
  return (
    <div>
      <h2>ProductList</h2>
      <div>
        {productsList?.map((product: Product) => (
          <div
            key={product.codigo}
            className="flex flex-col border-1 border-black"
          >
            <h3>Producto:{product.producto}</h3>
            <p>Precio:{product.precio}</p>
            <p>Stock:{product.inventario}</p>
            <p>Disponibilidad:{product.disponibilidad}</p>
            <p>En Remate:{product.estaEnRemate || "no"}</p>
            <p>Marca:{product.marca?.marca}</p>
            <p>Arribo:{product.fechaEstimadaLlegada}</p>
            <p>Codigo{product.codigo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
