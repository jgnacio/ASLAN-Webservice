import { IAPITokenRepository, IToken } from "@/domain/auth/IAPITokerRepository";
import axios from "axios";

const ASLAN_WEB_UNICOM_USERNAME = process.env.ASLAN_WEB_UNICOM_USERNAME;
const ASLAN_WEB_UNICOM_PASSWORD = process.env.ASLAN_WEB_UNICOM_PASSWORD;
const ASLAN_API_UNICOM_USERNAME = process.env.ASLAN_API_UNICOM_USERNAME;

interface Token {
  token: string;
  expiration: number;
}

export class UnicomAPITokenAdapter implements IAPITokenRepository {
  private URL = process.env.API_UNICOM_URL;
  private static TOKEN: Token = {
    token: "",
    expiration: 0,
  };

  constructor() {}

  private async fetchToken(): Promise<{
    mensaje: string;
    token: string;
    vencimiento: number;
  } | null> {
    if (
      !ASLAN_WEB_UNICOM_USERNAME ||
      !ASLAN_WEB_UNICOM_PASSWORD ||
      !ASLAN_API_UNICOM_USERNAME
    ) {
      throw new Error("No se han configurado las credenciales de Unicom");
    }

    const body = {
      usuario: ASLAN_WEB_UNICOM_USERNAME,
      password: ASLAN_WEB_UNICOM_PASSWORD,
      usuario_api: ASLAN_API_UNICOM_USERNAME,
    };

    try {
      const response = await axios.put(`${this.URL}/token`, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
    return { mensaje: "", token: "", vencimiento: 0 };
  }

  async getToken(): Promise<IToken> {
    if (UnicomAPITokenAdapter.TOKEN.expiration < Date.now()) {
      const tokenData = await this.fetchToken();
      if (!tokenData) {
        throw new Error("Error al obtener el token");
      }
      this.setToken(tokenData.token, tokenData.vencimiento * 1000);
      return UnicomAPITokenAdapter.TOKEN;
    } else {
      return UnicomAPITokenAdapter.TOKEN;
    }
  }

  private setToken(token: string, expiration: number): void {
    UnicomAPITokenAdapter.TOKEN.token = token;
    UnicomAPITokenAdapter.TOKEN.expiration = Date.now() + expiration;
  }
}
