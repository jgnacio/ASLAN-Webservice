import { IAPITokenRepository, IToken } from "@/domain/auth/IAPITokerRepository";
import axios from "axios";

const API_SOLUTIONBOX_USER = process.env.API_SOLUTIONBOX_USER;
const API_SOLUTIONBOX_PASS = process.env.API_SOLUTIONBOX_PASS;

interface Token {
  token: string;
  expiration: number;
}

export class SolutionboxAPITokenAdapter implements IAPITokenRepository {
  private URL = process.env.API_SOLUTIONBOX_URL;
  private static TOKEN: Token = {
    token: "",
    expiration: 0,
  };

  constructor() {}

  private async fetchToken(): Promise<{
    mensaje: string;
    token: string;
    expira_en: number;
  } | null> {
    const auth = btoa(`${API_SOLUTIONBOX_USER}:${API_SOLUTIONBOX_PASS}`);
    try {
      const response = await axios.post(
        `${this.URL}/usuario/createToken`,
        {},
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
    return { mensaje: "", token: "", expira_en: 0 };
  }

  async getToken(): Promise<IToken> {
    if (SolutionboxAPITokenAdapter.TOKEN.expiration < Date.now()) {
      const tokenData = await this.fetchToken();
      if (!tokenData) {
        throw new Error("Error al obtener el token");
      }
      this.setToken(tokenData.token, tokenData.expira_en * 1000);
      return SolutionboxAPITokenAdapter.TOKEN;
    } else {
      return SolutionboxAPITokenAdapter.TOKEN;
    }
  }

  private setToken(token: string, expiration: number): void {
    SolutionboxAPITokenAdapter.TOKEN.token = token;
    SolutionboxAPITokenAdapter.TOKEN.expiration = Date.now() + expiration;
  }
}
