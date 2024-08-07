/**
 * TCombo, Schema for type Model.UserData.TCombo
 */
export interface UnicomAPIOfferCombo {
  /**
   * artículos que componen la orferta
   */
  articulos?: TComboArticulo[];
  codigoOferta?: string;
  costo?: number;
  costoBonificado?: number;
  disponibilidad?: TformatoDisponibilidadInventario;
  enCarrito?: number;
  fechaFin?: string;
  fechaInicio?: string;
  nombreOferta?: string;
  [property: string]: any;
}

/**
 * TCombo_Articulo, Schema for type Model.UserData.TCombo_Articulo
 */
export interface TComboArticulo {
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
