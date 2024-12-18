import axios, { AxiosResponse } from "axios";
import fs from "fs";
import FormData from "form-data";

const WP_URL = process.env.WP_URL || "";
const WP_REST_API_USER = process.env.WP_REST_API_USER || "";
const WP_REST_API_PASSWORD = process.env.WP_REST_API_PASSWORD || "";

interface WPConfig {
  url: string;
  username: string;
  password: string;
}

interface Post {
  title: string;
  content: string;
  status: string;
}

export interface WordPressRestAPIMediaAttributes {
  title: string;
}

class WordPressRestAPIEntity {
  private static instance: WordPressRestAPIEntity;
  private url: string;
  private headers: Record<string, string>;

  private constructor(wpConfig: WPConfig) {
    this.url = wpConfig.url;
    this.headers = {
      Authorization: `Basic ${Buffer.from(
        `${wpConfig.username}:${wpConfig.password}`
      ).toString("base64")}`,
      "Content-Type": "application/json",
    };
  }

  public static getInstance(wpConfig: WPConfig): WordPressRestAPIEntity {
    if (!WordPressRestAPIEntity.instance) {
      WordPressRestAPIEntity.instance = new WordPressRestAPIEntity(wpConfig);
    }
    return WordPressRestAPIEntity.instance;
  }

  public async createPost(post: Post): Promise<any> {
    const response: AxiosResponse = await axios.post(
      `${this.url}/wp-json/wp/v2/posts`,
      post,
      {
        headers: this.headers,
      }
    );
    return response.data;
  }

  public async uploadMedia(formData: FormData): Promise<any> {
    const response: AxiosResponse = await axios
      .post(`${this.url}/wp-json/wp/v2/media`, formData, {
        headers: {
          ...this.headers,
          ...formData.getHeaders(),
        },
      })
      .then((response) => {
        // console.log(response);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  }

  public async getProducts(page: number, per_page: number): Promise<any> {
    const response = await axios.get(
      `${this.url}/wp-json/wc/v3/products?per_page=${per_page}&page=${page}`,
      { headers: this.headers }
    );
    return response.data;
  }
}

const wpConfig: WPConfig = {
  url: WP_URL,
  username: WP_REST_API_USER,
  password: WP_REST_API_PASSWORD,
};

const wpRAPI = WordPressRestAPIEntity.getInstance(wpConfig);

export default wpRAPI;
