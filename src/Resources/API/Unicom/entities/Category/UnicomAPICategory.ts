/**
 * Tgrupo_articulos, Schema for type Model.UserData.Tgrupo_articulos
 */
export interface UnicomAPICategory {
  codigoGrupo?: string;
  descripcion?: string;
  /**
   * no incluido en formato plano
   */
  gruposHijos?: UnicomAPICategory[];
  [property: string]: any;
}
