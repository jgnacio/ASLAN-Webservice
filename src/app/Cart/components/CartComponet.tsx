"use client";
import { use, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { addProduct, removeProduct } from "@/lib/features/cart/addProduct";
import { getRelevantProducts } from "@/app/Dashboard/_actions/get-relevant-products";
import { getFeaturedProductsByPage } from "@/app/Dashboard/_actions/get-featured-products";
import { Button } from "@nextui-org/button";

export default function CartComponet() {
  const cart = useAppSelector((state: RootState) => state.cart);
  const dispatch = useAppDispatch();

  const handleGetProducts = () => {
    console.log("Cart:", cart.products);
    console.log("total:", cart.total);
    // return cart.products;
  };

  const handleAddProduct = async () => {
    const getRelevantProduct = await getFeaturedProductsByPage({ page: 1 });
    console.log("getRelevantProduct:", getRelevantProduct);
    // Choose a random product from the list
    const product =
      getRelevantProduct[Math.floor(Math.random() * getRelevantProduct.length)];
    dispatch(addProduct(product));
  };

  const handleRemoveProduct = async () => {
    const lastProduct = cart.products[cart.products.length - 1];
    dispatch(removeProduct(lastProduct.toPlainObject()));
  };

  useEffect(() => {
    console.log("Cart:", cart.products);
  }, [cart]);

  return (
    <div>
      <h1 className="text-xl font-bold">Cart</h1>
      <div>
        <Button onClick={handleAddProduct}>Add Product</Button>
        <Button onClick={handleRemoveProduct}>Remove Product</Button>
        <Button onClick={handleGetProducts}>Get Products</Button>
      </div>
      <div>
        {cart.products.map((product) => (
          <div key={product.id}>
            <p>{product.title}</p>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
