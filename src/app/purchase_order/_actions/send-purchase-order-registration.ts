"use server";
import { UnicomAPIPurchaseOrderAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIPurchaseOrderAdapter";
import {
  DocumentTypes,
  EntryModes,
  UnicomAPIPurchaseOrderRequest,
} from "@/Resources/API/Unicom/UnicomAPIRequets";
export async function sendPurchaseOrderRegistration(
  purchaseOrder: UnicomAPIPurchaseOrderRequest
): Promise<void> {
  // const purchaseOrderTest = {
  //   modo: EntryModes.ModoPrueba,
  //   fecha_hora_entrega: "string",
  //   codigo_promocion: "string",
  //   forma_entrega: {
  //     entrega_dropshipping: {
  //       codigo_dropshipping: 0,
  //       hora_entrega: "string",
  //       hora_cierre: "string",
  //       hora_fin: "string",
  //       nombre_destinatario: "string",
  //       tipo_documento: DocumentTypes.Ci,
  //       documento: "string",
  //       email: "string",
  //       direccion: "string",
  //       apartamento: "string",
  //       ciudad: "string",
  //       departamento: "string",
  //       longitud: 0,
  //       latitud: 0,
  //       codpostal: "string",
  //       operador_logistico: "string",
  //       tel: "string",
  //       etiqueta_base64: "string",
  //       factura_base64: "string",
  //       enviar_qr_a_consumidor: true,
  //     },
  //   },
  //   comentarios_dt: "string",
  //   comentarios: "string",
  // };

  const unicomAPIPurchaseOrderAdapter = new UnicomAPIPurchaseOrderAdapter();
  const response =
    await unicomAPIPurchaseOrderAdapter.purchaseOrderRegistration(
      purchaseOrder
    );

  return response;
}
