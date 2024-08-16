import { IPurchaseOrderRepository } from "@/domain/product/repositories/IPurchaseOrderRepository";
import axios from "axios";
import { EntryModes, UnicomAPIPurchaseOrderRequest } from "../UnicomAPIRequets";

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

    purchaseOrder.modo = EntryModes.ModoPrueba;

    console.log(purchaseOrder);

    const body = {
      purchaseOrder,
    };

    const response = await axios
      .post(`${API_UNICOM_URL}/ordenes_de_compra`, body, config)
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
      });

    console.log(response);

    console.log("Orden de compra registrada correctamente");
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
