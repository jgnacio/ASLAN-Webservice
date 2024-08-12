import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import { ICart } from "@/domain/product/entities/Cart";
import { Product, ProductType } from "@/domain/product/entities/Product";
import { ProductObjToClass } from "@/lib/Utils/Functions/ClassToObject";
import { v4 as uuid4 } from "uuid";
import { ICartProduct } from "@/domain/product/entities/Cart";

const initialState: ICart = {
  id: uuid4(),
  products: [],
  total: 0,
  lastUpdate: new Date().toISOString(),
  userId: "",
  delivery_options: [],
  payment_options: [],
  total_including_tax: 0,
};

// const initialState: Cart = new Cart({});

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<ICartProduct>) => {
      // const product: Product = ProductObjToClass(action.payload);
      // const newCart = new Cart({});
      // newCart.setPlainProducts(state.products);
      // newCart.addProduct(product);
      // const newCartState = newCart.toPlainObject();

      const product = action.payload;
      state.products.push(product);
    },
    removeProduct: (state, action: PayloadAction<ProductType>) => {
      // const product: Product = ProductObjToClass(action.payload);

      // const newCart = new Cart({});
      // newCart.setPlainProducts(state.products);
      // newCart.removeProduct(product);
      // const newCartState = newCart.toPlainObject();

      const product = action.payload;
      state.products = state.products.filter((p) => p.id !== product.id);
    },
  },
});

export const { addProduct, removeProduct } = cartSlice.actions;

export const selectCart = (state: RootState) => state.cart;
export const cartReducer = cartSlice.reducer;
