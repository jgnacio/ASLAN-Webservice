// import { getTokenDev } from "@/adapters/Auth/token(remove-on-prod)";

const getTokenDev = {
  token: process.env.API_UNICOM_TOKEN,
};

export interface ProductAdapter {
  solo_modificados_desde?: string;
  tipo_informe?: string;
  solo_articulos_destacados?: boolean;
  solo_favoritos?: boolean;
  codigo_grupo?: string;
  codigo_marca?: string;
  rango_articulos_informe: {
    desde_articulo_nro: number;
    hasta_articulo_nro: number;
  };
  [key: string]: any;
}

export default async function getProduct(request: ProductAdapter) {
  const formattedData: ProductAdapter = {
    solo_modificados_desde: request.solo_modificados_desde || "",
    tipo_informe: request.tipo_informe || "completo",
    solo_articulos_destacados: request.solo_articulos_destacados || false,
    solo_favoritos: request.solo_favoritos || false,
    codigo_grupo: request.codigo_grupo || "",
    codigo_marca: request.codigo_marca || "",
    rango_articulos_informe: {
      desde_articulo_nro: request.rango_articulos_informe.desde_articulo_nro,
      hasta_articulo_nro: request.rango_articulos_informe.hasta_articulo_nro,
    },
  };

  // Eliminar campos vacíos si son ""
  Object.keys(formattedData).forEach(
    (key) => formattedData[key] === "" && delete formattedData[key]
  );

  const products = await fetch(
    process.env.NEXT_PUBLIC_API_UNICOM_URL + "/articulos",
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + getTokenDev.token,
      },
      body: JSON.stringify(formattedData),
    }
  )
    .then((res) => {
      console.log("res", res);
      return res.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  return products;
}
