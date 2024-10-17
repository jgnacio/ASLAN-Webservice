import { IAPITokenRepository, IToken } from "@/domain/auth/IAPITokerRepository";
import axios from "axios";

const API_PCSERVICE_USER = process.env.API_PCSERVICE_USER;
const API_PCSERVICE_PASS = process.env.API_PCSERVICE_PASS;
const API_PCSERVICE_URL = process.env.API_PCSERVICE_URL;

export class PCServiceAPITokenAdapter implements IAPITokenRepository {
  private static TOKEN = {
    token: "",
    expiration: 0,
  };

  constructor() {}

  private async fetchToken(): Promise<string> {
    const response = await axios.post(`${API_PCSERVICE_URL}/auth/login`, {
      username: API_PCSERVICE_USER,
      password: API_PCSERVICE_PASS,
    });
    return response.data.token;
  }

  async getToken(): Promise<IToken> {
    if (PCServiceAPITokenAdapter.TOKEN.expiration < Date.now()) {
      const token = await this.fetchToken();
      this.setToken(token);
      return PCServiceAPITokenAdapter.TOKEN;
    } else {
      return PCServiceAPITokenAdapter.TOKEN;
    }
  }

  private setToken(token: string): void {
    PCServiceAPITokenAdapter.TOKEN.token = token;
    PCServiceAPITokenAdapter.TOKEN.expiration = Date.now() + 600000;
  }
}
