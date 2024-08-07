/**
 * TArticulo, Schema for type Model.UserData.TArticulo
 */
export interface UnicomAPIOfferProduct {
  codigo?: string;
  dadoDeBaja?: boolean;
  datosUltimoPartnumber?: TDatosPartNumber;
  descripcion?: string;
  disponibilidad?: TformatoDisponibilidadInventario;
  encargadoGarantia?: string;
  favorito?: boolean;
  /**
   * fecha estimada de ingreso. Formato ISO 8601
   */
  fechaEstimadaLlegada?: string;
  garantiaDias?: number;
  grupoArticulo?: TgrupoArticulos;
  inventario?: number;
  linkEspecificaciones?: string;
  marca?: TMarca;
  pesoYMedidasAprox?: TpesoYMedidas;
  precio?: number;
  precioBonificado?: number;
  producto?: string;
  tagsDeBusqueda?: string[];
  tieneDctosXCantidad?: boolean;
  valorBilleteRma?: number;
  [property: string]: any;
}

/**
 * TDatos_PartNumber, Schema for type Model.UserData.TDatos_PartNumber
 */
export interface TDatosPartNumber {
  ean?: number;
  partnumber?: any;
  unidadesXCaja?: number;
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

/**
 * Tgrupo_articulos, Schema for type Model.UserData.Tgrupo_articulos
 */
export interface TgrupoArticulos {
  codigoGrupo?: string;
  descripcion?: string;
  /**
   * no incluido en formato plano
   */
  gruposHijos?: TgrupoArticulos[];
  [property: string]: any;
}

/**
 * TMarca, Schema for type Model.UserData.TMarca
 */
export interface TMarca {
  codigoMarca?: number;
  marca?: any;
  url?: any;
  [property: string]: any;
}

/**
 * Tpeso_y_medidas, Schema for type Model.UserData.Tpeso_y_medidas
 */
export interface TpesoYMedidas {
  alto?: number;
  ancho?: number;
  largo?: number;
  peso?: number;
  unidadMedida?: string;
  unidadPeso?: string;
  unidades?: number;
  [property: string]: any;
}
