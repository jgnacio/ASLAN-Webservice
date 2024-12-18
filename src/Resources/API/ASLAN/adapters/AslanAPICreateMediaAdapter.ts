import FormData from "form-data";
import wpRAPI from "../entities/AslanWPAPI";

export class AslanAPICreateMediaAdapter {
  constructor() {}
  public static async createMedia(formData: FormData): Promise<any> {
    try {
      return await wpRAPI.uploadMedia(formData);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
