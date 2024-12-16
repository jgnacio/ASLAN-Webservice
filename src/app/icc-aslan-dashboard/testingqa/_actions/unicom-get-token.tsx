"use server";
import { UnicomAPITokenAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPITokenAdapter";

export const unicom_getToken = async () => {
  const unicomAPITokenAdapter = new UnicomAPITokenAdapter();
  return await unicomAPITokenAdapter.getToken();
};
