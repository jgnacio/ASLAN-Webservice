import axios from "axios";

export class SKUInternalServiceAPIAdapter {
  private readonly SKU_INTERNAL_SERVICE_URL =
    process.env.SKU_INTERNAL_SERVICE_URL;

  constructor() {}

  async getAllSKURelations(): Promise<any> {
    console.log(`${this.SKU_INTERNAL_SERVICE_URL}/api/relationProducts`);
    const response = await axios
      .get(`${this.SKU_INTERNAL_SERVICE_URL}/api/relationProducts`)
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });

    return response;
  }

  async deleteProductRelation(SKU_Relation: string): Promise<any> {
    console.log(
      `${this.SKU_INTERNAL_SERVICE_URL}/api/relationProducts/deletebySKU/${SKU_Relation}`
    );
    const response = await axios
      .delete(
        `${this.SKU_INTERNAL_SERVICE_URL}/api/relationProducts/deletebySKU/${SKU_Relation}`
      )
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });

    return response;
  }
}
