"use server";
import { CDRMediosAPIProductAdapter } from "@/Resources/API/CDRMedios/adapters/CDRMediosAPIProductAdapter";

export const getCDRProducts = async () => {
  const adapter = new CDRMediosAPIProductAdapter();
  try {
    await adapter.getAll({});
  } catch (error) {
    console.error("Error fetching CDR products:", error);
  }
};