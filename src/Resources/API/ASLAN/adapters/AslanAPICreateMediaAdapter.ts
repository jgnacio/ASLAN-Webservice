import wpRAPI, {
  WordPressRestAPIMediaAttributes,
} from "../entities/AslanWPAPI";
import FormData from "form-data";

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
