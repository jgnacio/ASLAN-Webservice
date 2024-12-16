"use server";
import { CDRMediosAPIProductAdapter } from "@/Resources/API/CDRMedios/adapters/CDRMediosAPIProductAdapter";

export const getCDROptions = async () => {
  const adapter = new CDRMediosAPIProductAdapter();
  await adapter.getOptions();
};
