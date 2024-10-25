export interface SolutionboxAPIProduct {
  Alias: string;
  Numero_de_Parte: string;
  Descripcion: string;
  Detalle: null | string;
  Precio: number;
  Moneda: Moneda;
  Cotizacion: number;
  Tasa_IVA: string;
  Tasa_Impuestos_Internos: string;
  Stock: number;
  Marca: string;
}

export enum Moneda {
  Dolares = "DOLARES",
}
