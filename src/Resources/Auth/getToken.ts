import axios from "axios";

const WEB_UNICOM_USERNAME = process.env.NEXT_PUBLIC_ASLAN_WEB_UNICOM_USERNAME;
const WEB_UNICOM_PASSWORD = process.env.NEXT_PUBLIC_ASLAN_WEB_UNICOM_PASSWORD;
const API_UNICOM_USERNAME = process.env.NEXT_PUBLIC_ASLAN_API_UNICOM_USERNAME;
export const API_UNICOM_URL = process.env.API_UNICOM_URL;
export const API_UNICOM_TOKEN = process.env.API_UNICOM_TOKEN;

export async function getToken() {
  const body = {
    usuario: WEB_UNICOM_USERNAME,
    password: WEB_UNICOM_PASSWORD,
    usuario_api: API_UNICOM_USERNAME,
  };
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const response = await axios.put(`${API_UNICOM_URL}/token` as any, body, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
