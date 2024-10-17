export interface IAPITokenRepository {
  getToken(): Promise<IToken>;
}
export interface IToken {
  token: string;
  expiration: number;
}
