export interface UnicomAPIProductRequest {
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

export const defaultUnicomAPIProductRequest: UnicomAPIProductRequest = {
  solo_modificados_desde: "",
  tipo_informe: "completo",
  solo_articulos_destacados: false,
  solo_favoritos: false,
  codigo_grupo: "",
  codigo_marca: "",
  rango_articulos_informe: {
    desde_articulo_nro: 1,
    hasta_articulo_nro: 10,
  },
};
