export interface IntcomexAPIPriceType {
  Sku: string;
  Mpn: string;
  Price: IntcomexAPIPriceObjectType;
}

export interface IntcomexAPIPriceObjectType {
  CurrencyId: string;
  UnitPrice: number;
}
