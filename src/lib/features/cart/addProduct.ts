import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import { Cart } from "@/domain/product/entities/Cart";
import { Product, ProductType } from "@/domain/product/entities/Product";
import { ProductObjToClass } from "@/lib/Utils/Functions/ClassToObject";

const initialState: Cart = new Cart({});

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<ProductType>) => {
      const product: Product = ProductObjToClass(action.payload);
      const newCart = new Cart({ products: [...state.getProducts()] });
      newCart.addProduct(product);

      return newCart;
    },
    removeProduct: (state, action: PayloadAction<ProductType>) => {
      const product: Product = ProductObjToClass(action.payload);

      const newCart = new Cart({ products: [...state.getProducts()] });
      newCart.removeProduct(product);

      return newCart;
    },
  },
});

export const { addProduct, removeProduct } = cartSlice.actions;

export const selectCart = (state: RootState) => state.cart;
export const cartReducer = cartSlice.reducer;
