import { ProductType, Product } from "@/domain/product/entities/Product";

export function ProductObjToClass(product: ProductType): Product {
  return new Product({
    title: product.title,
    price: product.price,
    priceHistory: product.priceHistory,
    partNumber: product.partNumber,
    sku: product.sku,
    description: product.description,
    images: product.images,
    category: product.category,
    marca: product.marca,
    stock: product.stock,
    provider: product.provider,
    availability: product.availability,
    submitDate: product.submitDate,
    favorite: product.favorite,
    onSale: product.onSale,
    guaranteeDays: product.guaranteeDays,
    estimatedArrivalDate: product.estimatedArrivalDate,
  });
}

export function ProductClassToObj(product: Product): ProductType {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    priceHistory: product.priceHistory,
    partNumber: product.partNumber,
    sku: product.getSku(),
    description: product.description,
    images: product.images,
    category: product.category,
    marca: product.marca,
    stock: product.stock,
    provider: product.provider,
    availability: product.availability,
    submitDate: product.submitDate,
    favorite: product.favorite,
    onSale: product.onSale,
    guaranteeDays: product.guaranteeDays,
    estimatedArrivalDate: product.estimatedArrivalDate,
  };
}

export function ProductClassToObjFixed(product: Product): ProductType {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    priceHistory: product.priceHistory,
    partNumber: [
      {
        partNumber: (product.partNumber as any) || product.getSku(),
        ean: 0,
        units_x_box: 0,
      },
    ],
    sku: product.getSku(),
    description: product.description,
    images: product.images,
    category: product.category,
    marca: product.marca,
    stock: product.stock,
    provider: product.provider,
    availability: product.availability,
    submitDate: product.submitDate,
    favorite: product.favorite,
    onSale: product.onSale,
    guaranteeDays: product.guaranteeDays,
    estimatedArrivalDate: product.estimatedArrivalDate,
  };
}
