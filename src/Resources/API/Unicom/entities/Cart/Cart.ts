export interface UnicomAPICart {
  /**
   * Lista de artículos, combos, equipos pre-stamados que componen el carrito
   */
  articulos?: TArticuloCarrito[];
  /**
   * Forma de pago disponible para pagar el carrito
   */
  formaDePago?: TFormaPagoCarrito;
  /**
   * Opciones de entrega disponibles para el carrito
   */
  opcionesEntrega?: OpcionesEntrega;
  /**
   * total del carrito con impuestos incluidos.
   */
  totalConImpuestos?: number;
  [property: string]: any;
}

/**
 * TArticulo_Carrito
 */
export interface TArticuloCarrito {
  cantidad?: number;
  codigoArticulo?: string;
  costoUnitario?: number;
  descripcion?: string;
  disponibilidad?: TformatoDisponibilidadInventario;
  estaRematandose?: boolean;
  ivaUnitario?: number;
  tieneIngDeptoTecnico?: boolean;
  tipoArticulo?: TtiposArticulos;
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
 * Ttipos_articulos
 */
export enum TtiposArticulos {
  Articulo = "articulo",
  Desconocido = "desconocido",
  Equipo = "equipo",
  Oferta = "oferta",
}

/**
 * Forma de pago disponible para pagar el carrito
 *
 * tForma_pago_carrito, formas de pago disponibles para el carrito
 */
export interface TFormaPagoCarrito {
  formaDePagoCliente?: TFormaDePagoCliente;
  tieneCreditoParaEntregarCarrito?: boolean;
  [property: string]: any;
}

/**
 * TForma_de_pago_cliente, Schema for type Model.UserData.TForma_de_pago_cliente
 */
export interface TFormaDePagoCliente {
  creditoDisponible?: number;
  formaDePago?: TFormaPago;
  limiteCredito?: number;
  [property: string]: any;
}

/**
 * TForma_Pago
 */
export enum TFormaPago {
  PagoChequeContraEntrega = "pago_cheque_contra_entrega",
  PagoConforme = "pago_conforme",
  PagoContado = "pago_contado",
  PagoCuentaCorriente = "pago_cuenta_corriente",
}

/**
 * Opciones de entrega disponibles para el carrito
 */
export interface OpcionesEntrega {
  /**
   * Direcciones de sucursales con sus metodos de entrega y horarios disponibles
   */
  direccionesEntrega?: TDireccionEntrega[];
  /**
   * modalidades de DropShipping disponibles
   */
  opcionesDropshipping?: OpcionesDropshipping[];
  [property: string]: any;
}

/**
 * TDireccion_Entrega, Schema for type Model.UserData.TDireccion_Entrega
 */
export interface TDireccionEntrega {
  ciudad?: string;
  codigoDireccion?: number;
  codigoPostal?: string;
  departamento?: string;
  direccion?: string;
  pais?: string;
  tiposFleteValidos?: TFlete[];
  [property: string]: any;
}

/**
 * TFlete, Schema for type Model.UserData.TFlete
 */
export interface TFlete {
  costo?: number;
  descripcion?: string;
  minimaCompraParaFlete?: number;
  minimaCompraParaNoTenerCosto?: number;
  proximasFranjasHorariasDeEntrega?: TProximaFranjaHorariaDeEntrega[];
  tipoFlete?: number;
  zona?: string;
  [property: string]: any;
}

/**
 * TProxima_Franja_Horaria_De_Entrega, Schema for type
 * Model.UserData.TProxima_Franja_Horaria_De_Entrega
 */
export interface TProximaFranjaHorariaDeEntrega {
  /**
   * formato ISO 8601 ej. "2024-09-21T12:31:52.000-03:00"
   */
  diaHoraDeCorte?: string;
  /**
   * formato ISO 8601 ej. "2024-09-21T12:31:52.000-03:00"
   */
  diaHoraDeEntrega?: string;
  /**
   * formato ISO 8601 ej. "2024-09-21T12:31:52.000-03:00"
   */
  finDiaHoraEntrega?: string;
  [property: string]: any;
}

export interface OpcionesDropshipping {
  /**
   * para el caso de que sea la entrega en uun centro logístico
   */
  centroLogistico?: TCentroLogistico;
  codigoMetodoEntregaEspecial?: number;
  descripcion?: string;
  /**
   * es true si la entrega se hace directamente al consumidor
   */
  entregaAlConsumidor?: boolean;
  /**
   * información que se requiere al ingresar la orden
   */
  informacionRequerida?: InformacionRequerida;
  /**
   * como se entregaría el pedido
   */
  metodoEntrega?: TOpcionesMetodosEntregaEspecial;
  /**
   * costo sin impuestos del servicio
   */
  montoACobrar?: number;
  /**
   * Monto mínimo sin impuestos para poder realizar el servicio
   */
  montoMinimo?: number;
  /**
   * Monto mínimo sin impuestos para que no tenga cossto
   */
  montoMinimoSinCosto?: number;
  /**
   * Nombre referencial del servicio DropShipping
   */
  nombreReferencial?: string;
  /**
   * horarios de entrega disponibles
   */
  proximasFranjasHorariasDeEntrega?: TProximaFranjaHorariaDeEntrega[];
  /**
   * es true cuando el servicio es "inmediato", y no se respeta la hora de corte
   */
  servicioFast?: boolean;
  /**
   * es true si solo se puede entregar en montevideo
   */
  soloAMontevideo?: boolean;
  [property: string]: any;
}

/**
 * para el caso de que sea la entrega en uun centro logístico
 *
 * TCentro_Logistico, Schema for type Model.UserData.TCentro_Logistico
 */
export interface TCentroLogistico {
  codigo?: number;
  /**
   * si es true el centro logístico incluye sub-operadores. Por ej. 3 cruces
   */
  incluyeOperadores?: boolean;
  nombre?: string;
  [property: string]: any;
}

/**
 * información que se requiere al ingresar la orden
 */
export interface InformacionRequerida {
  /**
   * dir. consumidor final. Si es r_condcional, es requerido si no se ingresó la imágen de la
   * etiqueta
   */
  requiereDireccion?: TOpcionesRequerimientosMetodoEntregaEspecial;
  /**
   * Doc. consumidor final
   */
  requiereDocumento?: TOpcionesRequerimientosMetodoEntregaEspecial;
  /**
   * Email consumidor final
   */
  requiereEmail?: TOpcionesRequerimientosMetodoEntregaEspecial;
  /**
   * Enviará el código QR
   */
  requiereEnvioQr?: TOpcionesRequerimientosMetodoEntregaEspecial;
  requiereImagenEtiqueta?: string;
  /**
   * imagen factura distribuidor
   */
  requiereImagenFactura?: TOpcionesRequerimientosMetodoEntregaEspecial;
  /**
   * Nombre Consumidor Final
   */
  requiereNombre?: TOpcionesRequerimientosMetodoEntregaEspecial;
  /**
   * tel consumidor Final. Si es r_condcional, es requerido si se ingresa la dirección
   */
  requiereTelefono?: TOpcionesRequerimientosMetodoEntregaEspecial;
  [property: string]: any;
}

/**
 * dir. consumidor final. Si es r_condcional, es requerido si no se ingresó la imágen de la
 * etiqueta
 *
 * TOpciones_Requerimientos_metodo_entrega_especial
 *
 * Doc. consumidor final
 *
 * Email consumidor final
 *
 * Enviará el código QR
 *
 * imagen factura distribuidor
 *
 * Nombre Consumidor Final
 *
 * tel consumidor Final. Si es r_condcional, es requerido si se ingresa la dirección
 */
export enum TOpcionesRequerimientosMetodoEntregaEspecial {
  RCondicional = "r_condicional",
  RDesconocido = "r_desconocido",
  RNoRequerido = "r_no_requerido",
  ROpcional = "r_opcional",
  RRequerido = "r_requerido",
}

/**
 * como se entregaría el pedido
 *
 * TOpciones_Metodos_entrega_especial
 */
export enum TOpcionesMetodosEntregaEspecial {
  EntregaCentroLogistico = "entrega_centro_logistico",
  EntregaDesconocida = "entrega_desconocida",
  EntregaEnLocalDistribuidor = "entrega_en_local_distribuidor",
  EntregaFleteInterior = "entrega_flete_interior",
  EntregaMostrador = "entrega_mostrador",
  EntregaTodoMontevideo = "entrega_todo_montevideo",
  EntregaZona1 = "entrega_zona_1",
  EntregaZona2 = "entrega_zona_2",
  EntregaZona3 = "entrega_zona_3",
  EntregaZona4 = "entrega_zona_4",
}
