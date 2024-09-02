import axios, { AxiosResponse } from "axios";
import fs from "fs";
import FormData from "form-data";

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
        console.log(response);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  }
}

const wpConfig: WPConfig = {
  url: process.env.WP_URL || "",
  username: process.env.WP_REST_API_USER || "",
  password: process.env.WP_REST_API_PASSWORD || "",
};

const wpRAPI = WordPressRestAPIEntity.getInstance(wpConfig);

export default wpRAPI;
