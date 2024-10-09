"use server";

import { ProductType } from "@/domain/product/entities/Product";
import { ProductTypeWithProvider } from "@/Resources/API/Unicom/entities/Product/UnicomProductInterfaces";
import axios from "axios";

export const makeProductRelation = async ({
  productToPublish,
  productList,
}: {
  productToPublish: ProductType;
  productList: ProductTypeWithProvider[];
}) => {
  // console.log(productList);
  console.log(productToPublish);
  // Make all products if not exist
  const body = {
    title: productToPublish.title,
    price: productToPublish.price,
    description: productToPublish.description,
    stock: productToPublish.stock,
    category: productToPublish.category.name,
    brand: productToPublish.marca,
  };

  const headers = {
    "Content-Type": "application/json",
  };
  const product = await axios
    .post(
      "https://product-sku-internal-service-207026078475.us-west1.run.app/api/products",
      body,
      { headers }
    )
    .then((response) => response.data.data)
    .catch((error) => {
      console.log("Error:", error);
    });

  if (!product) {
    throw new Error("Product not found");
  }

  const providersOnSkuInternalService = await axios
    .get(
      "https://product-sku-internal-service-207026078475.us-west1.run.app/api/providers"
    )
    .then((response) => response.data.data)
    .catch((error) => {
      console.log("Error:", error);
    });

  let bodyRelations: any[] = [];

  for (const productOnList of productList) {
    if (!productOnList.partNumber) {
      continue;
    }
    // si es objeto
    let partNumber = "";
    if (typeof productOnList.partNumber === "object") {
      partNumber = productOnList.partNumber[0].partNumber;
    } else {
      partNumber = productOnList.partNumber;
    }

    if (!partNumber) {
      throw new Error("Part number is required");
    }

    // si contiene una palabra del proveedore

    const provider = providersOnSkuInternalService.find((provider: any) =>
      productOnList.provider.includes(provider.name)
    );

    if (!provider) {
      throw new Error("Provider not found");
    }

    const toSend = {
      PartNumber: partNumber,
      sku_provider: productOnList.sku,
      price: productOnList.price,
      stock: productOnList.stock,
      products: {
        connect: {
          SKU: product.SKU,
        },
      },
      providers: {
        connect: {
          ID_Provider: provider.ID_Provider,
        },
      },
    };
    bodyRelations.push(toSend);
  }

  for (const relation of bodyRelations) {
    console.log(
      await axios
        .post(
          "https://product-sku-internal-service-207026078475.us-west1.run.app/api/relationProducts",
          relation,
          { headers }
        )
        .then((response) => response.data)
        .catch((error) => {
          console.log("Error:", error);
        })
    );
  }
  return product;
};
