"use server";
import { UnicomAPIUserDataAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIUserDataAdapter";
import { UnicomAPIUserData } from "@/Resources/API/Unicom/entities/UserData/UnicomAPIUserData";

export async function getUserDataForDropshipping(): Promise<UnicomAPIUserData> {
  const unicomAPIUserDataAdapter = new UnicomAPIUserDataAdapter();
  return await unicomAPIUserDataAdapter.getUserData();
}
