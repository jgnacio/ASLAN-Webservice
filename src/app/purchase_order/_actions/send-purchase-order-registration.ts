"use server";
import { UnicomAPIPurchaseOrderAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIPurchaseOrderAdapter";
import { UnicomAPIPurchaseOrderRequest } from "@/Resources/API/Unicom/UnicomAPIRequets";
export async function sendPurchaseOrderRegistration(
  purchaseOrder: UnicomAPIPurchaseOrderRequest
): Promise<void> {
  const unicomAPIPurchaseOrderAdapter = new UnicomAPIPurchaseOrderAdapter();
  const response =
    await unicomAPIPurchaseOrderAdapter.purchaseOrderRegistration(
      purchaseOrder
    );

  return response;
}
