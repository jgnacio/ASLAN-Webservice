import { Product } from "./Product";
import { v4 as uuid } from "uuid";
export class Cart {
  public readonly id: string;
  public userId: string;
  public lastUpdate: Date;
  public total: number;
  public products: Product[];
  constructor({ products }: { products?: Product[] }) {
    this.id = uuid();
    // TODO GET USER ID FROM CLERK
    this.userId = "";
    this.products = products || [];
    this.lastUpdate = new Date();
    this.total = this.products.length;
  }

  public addProduct(product: Product) {
    this.products.push(product);
    this.total += 1;
  }

  public removeProduct(product: Product) {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.total -= 1;
    }
  }

  public clear() {
    this.products = [];
    this.total = 0;
  }

  public getTotal() {
    return this.total;
  }

  public getProducts() {
    return this.products;
  }

  public getLastUpdate() {
    return this.lastUpdate;
  }

  public getUserId() {
    return this.userId;
  }

  public getId() {
    return this.id;
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  public setLastUpdate(lastUpdate: Date) {
    this.lastUpdate = lastUpdate;
  }

  public setProducts(products: Product[]) {
    this.products = products;
    this.total = products.length;
  }

  public updateProduct(product: Product) {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
    }
  }
}

export class CartControler {
  constructor(
    public readonly id: string,
    public userId: string,
    public lastUpdate: Date,
    public total: number,
    public carts: Cart[]
  ) {}

  public addCart(cart: Cart) {
    this.carts.push(cart);

    // iter the carts and get the total
    this.carts.map((cart) => {
      this.total += cart.getTotal();
    });
  }

  public deleteCart(cart: Cart) {
    const index = this.carts.findIndex((c) => c.id === cart.id);
    if (index !== -1) {
      this.carts.splice(index, 1);
      this.total -= cart.getTotal();
    }
  }

  public updateCart(cart: Cart) {
    const index = this.carts.findIndex((c) => c.id === cart.id);
    if (index !== -1) {
      this.carts[index] = cart;
    }
  }

  public addProduct(cart: Cart, product: Product) {
    const index = this.carts.findIndex((c) => c.id === cart.id);
    if (index !== -1) {
      this.carts[index].addProduct(product);
    }
  }

  public removeProduct(cart: Cart, product: Product) {
    const index = this.carts.findIndex((c) => c.id === cart.id);
    if (index !== -1) {
      this.carts[index].removeProduct(product);
    }
  }

  public updateProduct(cart: Cart, product: Product) {
    const index = this.carts.findIndex((c) => c.id === cart.id);
    if (index !== -1) {
      this.carts[index].updateProduct(product);
    }
  }

  public clear() {
    this.carts = [];
    this.total = 0;
  }

  public getTotal() {
    return this.total;
  }

  public getCarts() {
    return this.carts;
  }

  public getLastUpdate() {
    return this.lastUpdate;
  }

  public getUserId() {
    return this.userId;
  }
}
