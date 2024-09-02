"use server";
import { AslanAPICreateMediaAdapter } from "@/Resources/API/ASLAN/adapters/AslanAPICreateMediaAdapter";
import { WordPressRestAPIMediaAttributes } from "@/Resources/API/ASLAN/entities/AslanWPAPI";

import FormData from "form-data";

export const createMedia = async ({
  content,
  title,
}: {
  content: File;
  title: string;
}): Promise<any> => {
  const formData = new FormData();
  formData.append("file", content);
  formData.append("title", title);
  return await AslanAPICreateMediaAdapter.createMedia(formData);
};
