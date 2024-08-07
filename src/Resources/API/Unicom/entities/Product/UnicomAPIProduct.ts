/**
 * TArticulo_completo, Schema for type Model.UserData.TArticulo_completo
 */
export interface UnicomAPIProduct {
  /**
   * artículos que tenemos relacionados. En los datos de relación está el campo que los
   * relaciona (memoria, color, etc)
   */
  articulosRelacionados?: ArticulosRelacionado[];
  /**
   * codigo artículo de Unicom
   */
  codigo?: string;
  /**
   * si es true, fue dado de baja
   */
  dadoDeBaja?: boolean;
  /**
   * Datos para publicar en MercadoLibre
   */
  datosMercadoLibre: DatosMercadoLibre;
  /**
   * partnumbers del artículo. Puede haber mas de uno en el mismo artículo. Se ingresan en
   * formato de pila
   */
  datosPartnumbers?: TDatosPartNumber[];
  /**
   * descuentos adicionales
   */
  dctosXCantidad?: TDctoXCantidad[];
  descripcion?: string;
  /**
   * Disponibilidad
   */
  disponibilidad?: TformatoDisponibilidadInventario;
  /**
   * unidades que ya se tienen en el carrito del usuario
   */
  enCarrito?: number;
  encargadoGarantia?: string;
  /**
   * es true si está rematandose. En este caso el precio y precio bonificado se verían
   * afectados
   */
  estaEnRemate?: boolean;
  /**
   * el cliente lo tiene como favorito
   */
  favorito?: boolean;
  /**
   * Si está en transito. Incluye la fecha estimada de llegada
   */
  fechaEstimadaLlegada?: string;
  /**
   * fotos en base64
   */
  fotos?: TFoto[];
  garantiaDias?: number;
  grupoArticulo?: TgrupoArticulos;
  /**
   * Unidades disponibles.
   */
  inventario?: number;
  /**
   * Link en la web del fabricante
   */
  linkEspecificaciones?: string;
  linksVideos?: TLinkVideoArticulo[];
  marca?: TMarca;
  nombrePm?: string;
  /**
   * pesos y medidas del artícuo. Pero son referenciales, ya que depende como se embale
   */
  pesoYMedidasAprox?: TpesoYMedidas;
  /**
   * precio sin impuestos
   */
  precio?: number;
  /**
   * precio bonificado sin impuestos. Precio de vta del momento
   */
  precioBonificado?: number;
  /**
   * nombre
   */
  producto?: string;
  tablaEspecificaciones?: string;
  tagsDeBusqueda?: string[];
  /**
   * importe del billete de RMA impuestos incluidos
   */
  valorBilleteRma?: number;
  [property: string]: any;
}

export interface ArticulosRelacionado {
  codigo?: string;
  disponibilidad?: TformatoDisponibilidadInventario;
  enCarrito?: number;
  estaEnRemate?: boolean;
  precio?: number;
  producto?: string;
  /**
   * relaciones del artículo. Puede tener mas de un aspecto que lo relacione.
   */
  relacion?: TDefRelacionArticulos;
  tieneDctosXCantidad?: boolean;
  [property: string]: any;
}

/**
 * Tformato_disponibilidad_inventario
 *
 * Disponibilidad
 */
export enum TformatoDisponibilidadInventario {
  ConInventario = "con_inventario",
  Consultar = "consultar",
  SinInventario = "sin_inventario",
}

/**
 * relaciones del artículo. Puede tener mas de un aspecto que lo relacione.
 *
 * TDef_Relacion_Articulos, Schema for type Model.UserData.TDef_Relacion_Articulos
 */
export interface TDefRelacionArticulos {
  codigoRelacion?: number;
  nombreRelacion?: string;
  valorRelacion?: string;
  [property: string]: any;
}

/**
 * Datos para publicar en MercadoLibre
 */
export interface DatosMercadoLibre {
  /**
   * atributos
   */
  atributos: Atributo[];
  /**
   * ID de la categoría de MELI
   */
  categoryid: string;
  descripcion: string;
  nombre: string;
  [property: string]: any;
}

export interface Atributo {
  /**
   * ID de atributo de MELI
   */
  idAtributo: string;
  valor: string;
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
 * TDcto_X_Cantidad, Schema for type Model.UserData.TDcto_X_Cantidad
 */
export interface TDctoXCantidad {
  cantidad?: number;
  /**
   * precio unitario mas impuestos
   */
  precioUnitario?: number;
  /**
   * si es true. El descuento se realiza por caja cerrada, en caso contrario por cantidad de
   * unidades
   */
  xCaja?: boolean;
  [property: string]: any;
}

/**
 * TFoto, Schema for type Model.UserData.TFoto
 */
export interface TFoto {
  formato?: string;
  fotoBase64?: string;
  resolucion?: string;
  [property: string]: any;
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
 * TLink_Video_Articulo, Schema for type Model.UserData.TLink_Video_Articulo
 */
export interface TLinkVideoArticulo {
  linkVideo?: string;
  nombreReferencial?: string;
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
 * pesos y medidas del artícuo. Pero son referenciales, ya que depende como se embale
 *
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
