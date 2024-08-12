import { ProductType } from "@/domain/product/entities/Product";

function createCart() {
  localStorage.setItem("cartStore", JSON.stringify({ products: [] }));
  return { products: [] };
}

function getCart() {
  return JSON.parse(
    localStorage.getItem("cartStore") || JSON.stringify({ products: [] })
  );
}

function addProduct(product: ProductType) {
  const cartStore = getCart();
  product.estimatedArrivalDate = null;
  product.submitDate = null;
  cartStore.products.push(product);
  localStorage.setItem("cartStore", JSON.stringify(cartStore));
}

function removeProduct() {
  const cartStore = getCart();
  cartStore.products.pop();
  localStorage.setItem("cartStore", JSON.stringify(cartStore));
}

function setProduct(product: ProductType[]) {
  localStorage.setItem("cartStore", JSON.stringify({ products: product }));
}

export { createCart, getCart, addProduct, removeProduct, setProduct };
