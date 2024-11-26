import { Product, Provider } from "@/domain/product/entities/Product";
import { IProductRepository } from "@/domain/product/repositories/IProductRepository";
import { getFormattedDate } from "@/lib/functions/DateFunctions";
const soap = require("soap");

export class CDRMediosAPIProductAdapter implements IProductRepository {
  private readonly API_URL = process.env.API_CDRMEDIOS_URL || "";
  private soapClient: any | null = null; // Variable para almacenar el cliente SOAP

  constructor() {}

  private async getSoapClient(): Promise<any> {
    if (!this.soapClient) {
      try {
        // Crea el cliente SOAP solo si no existe
        this.soapClient = await soap.createClientAsync(this.API_URL);
        console.log("SOAP client initialized.");
      } catch (error) {
        console.error("Error initializing SOAP client:", error);
        throw error;
      }
    }
    return this.soapClient;
  }

  private async fetchProducts(): Promise<any> {
    const client = await this.getSoapClient();

    const params = {
      email: process.env.API_CDRMEDIOS_USER,
      token: process.env.API_CDRMEDIOS_TOKEN,
      fecha: getFormattedDate(),
      formato: "",
    };

    try {
      const response = await client.productos_con_galeriaAsync(params);

      // Accede al contenido de 'productos_con_galeriaReturn'
      const rawData = response[0]?.productos_con_galeriaReturn?.$value;

      if (!rawData) {
        throw new Error(
          "No se encontró la propiedad $value en la respuesta SOAP."
        );
      }

      // Convierte la cadena JSON en un objeto
      const data = JSON.parse(rawData);
      console.log("Data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getBySKU(sku: string): Promise<Product | null> {
    throw new Error("Method not implemented.");
  }
  async getAll({
    request,
    page,
    category,
    provider,
  }: {
    request?: any;
    page?: number;
    category?: string;
    provider?: string;
  }): Promise<Product[]> {
    const response = await this.fetchProducts();
    console.log("Response:", response);
    return [];
  }
  async getByCategory(category: string): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  async getFeatured(request?: any): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  async getOffers(request?: any): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }

  async getOptions(): Promise<any> {
    const client = await this.getSoapClient();

    console.log("Funciones disponibles en el servicio:");
    console.log(client.describe());
  }
}
