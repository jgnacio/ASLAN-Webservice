import { IPurchaseOrderRepository } from "@/domain/product/repositories/IPurchaseOrderRepository";
import axios from "axios";
import { UnicomAPIPurchaseOrderRequest } from "../UnicomAPIRequets";

const API_UNICOM_TOKEN = process.env.API_UNICOM_TOKEN;
const API_UNICOM_URL = process.env.API_UNICOM_URL;

export class UnicomAPIPurchaseOrderAdapter implements IPurchaseOrderRepository {
  async purchaseOrderRegistration(
    purchaseOrder: UnicomAPIPurchaseOrderRequest
  ): Promise<void> {
    const config = {
      headers: {
        Authorization: `Bearer ${API_UNICOM_TOKEN}`,
      },
    };

    const {
      codigo_promocion,
      comentarios,
      comentarios_dt,
      fecha_hora_entrega,
      forma_entrega,
      modo,
    } = purchaseOrder;

    const body = {
      codigo_promocion: codigo_promocion,
      comentarios: comentarios,
      comentarios_dt: comentarios_dt,
      fecha_hora_entrega: fecha_hora_entrega,
      forma_entrega: forma_entrega,
      modo: "modo_prueba",
    };

    const response = await axios.post(
      `${API_UNICOM_URL}/ordenes_de_compra`,
      body,
      config
    );

    if (response.status !== 200) {
      throw new Error("Error al registrar la orden de compra");
    }

    console.log("Orden de compra registrada correctamente");
    console.log(response.data);
    return;
  }

  async cancellation(): Promise<void> {
    const config = {
      headers: {
        Authorization: `Bearer ${API_UNICOM_TOKEN}`,
      },
    };

    await axios.delete(`${API_UNICOM_URL}/ordenes_de_compra`, config);

    return;
  }
}
