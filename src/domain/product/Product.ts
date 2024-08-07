/**
 * Representa una entidad de producto en el dominio de la aplicación.
 */
export class Product {
  constructor(
    private readonly id: string,
    private readonly sku: string,
    public readonly price: number,
    public title: string,
    public description: string,
    public images: string[],
    public category: string,
    public marca: string,
    public stock: number,
    public submitDate: Date
  ) {}

  public getId() {
    return this.id;
  }

  public getSku() {
    return this.sku;
  }

  public getPrice() {
    return this.price;
  }

  public changeTitle(newTitle: string) {
    if (!newTitle || newTitle.trim().length === 0) {
      throw new Error("Title cannot be empty");
    }
    this.title = newTitle;
  }

  public changeDescription(newDescription: string) {
    this.description = newDescription;
  }

  public changeImages(newImages: string[]) {
    this.images = newImages;
  }

  public changeStock(newStock: number) {
    if (newStock < 0) {
      throw new Error("Stock cannot be negative");
    }
    this.stock = newStock;
  }
  public changeSubmitDate(newDate: Date) {
    if (!(newDate instanceof Date) || isNaN(newDate.getTime())) {
      throw new Error("SubmitDate must be a valid date");
    }
    this.submitDate = newDate;
  }

  private validate() {
    if (!this.id) {
      throw new Error("No id found");
    }
    if (this.price <= 0) {
      throw new Error("Price must be a positive number");
    }
    if (this.stock < 0) {
      throw new Error("Stock cannot be negative");
    }
    if (
      !(this.submitDate instanceof Date) ||
      isNaN(this.submitDate.getTime())
    ) {
      throw new Error("SubmitDate must be a valid date");
    }
  }
}
