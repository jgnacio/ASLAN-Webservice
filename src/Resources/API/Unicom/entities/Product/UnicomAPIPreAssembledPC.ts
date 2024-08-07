/**
 * TEquipo, Schema for type Model.UserData.TEquipo
 */
export interface UnicomAPIPreAssembledPC {
  articulos?: TEquipoArticulo[];
  codigoEquipo?: string;
  costo?: number;
  costoBonificado?: number;
  disponibilidad?: TformatoDisponibilidadInventario;
  enCarrito?: number;
  nombreEquipo?: string;
  [property: string]: any;
}

/**
 * TEquipo_Articulo, Schema for type Model.UserData.TEquipo_Articulo
 */
export interface TEquipoArticulo {
  codigoArticulo?: string;
  descripcion?: string;
  garantia?: number;
  [property: string]: any;
}

/**
 * Tformato_disponibilidad_inventario
 */
export enum TformatoDisponibilidadInventario {
  ConInventario = "con_inventario",
  Consultar = "consultar",
  SinInventario = "sin_inventario",
}
