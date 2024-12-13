export interface CategoriesProvider {
  providerMainCategoryName?: string | number;
  providerMainCategoryCode?: number | string;
  providerCategoryName: string;
  providerCategoryCode: number | string;
}

export interface RelevantCategoriesType {
  name: string;
  nameES: string;
  code: string;
  provider: string;
  providerCategories: CategoriesProvider[] | [];
}

export type RelevantCategoriesBASE = {
  provider: string;
  categories: [
    {
      name: "Notebooks Gamer";
      nameES: "Laptops Gamer";
      code: "notebooks-gamer";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    },
    {
      name: "Notebooks Home/Office";
      nameES: "Laptops Home/Office";
      code: "notebooks-home-office";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    },
    {
      name: "MacBooks";
      nameES: "MacBooks";
      code: "macbooks";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    },
    {
      name: "Monitors";
      nameES: "Monitores";
      code: "monitors";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    },
    {
      name: "Storage";
      nameES: "Almacenamiento";
      code: "storage";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    },
    {
      name: "Power Supplies";
      nameES: "Fuentes";
      code: "power-supplies";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    },
    {
      name: "Cases";
      nameES: "Gabinetes";
      code: "cases";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    },
    {
      name: "GPU";
      nameES: "GPU";
      code: "gpu";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    },
    {
      name: "RAM";
      nameES: "RAM";
      code: "ram";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    },
    {
      name: "Motherboards";
      nameES: "Motherboards";
      code: "motherboards";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    },
    {
      name: "Peripherals";
      nameES: "Periféricos";
      code: "peripherals";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    },
    {
      name: "CPU";
      nameES: "CPU";
      code: "cpu";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    },
    {
      name: "Cooling";
      nameES: "Refrigeración";
      code: "cooling";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    },
    {
      name: "Chairs";
      nameES: "Sillas";
      code: "chairs";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    },
    {
      name: "Other";
      nameES: "Otros";
      code: "other";
      provider: string;
      providerCategories: CategoriesProvider[] | [];
    }
  ];
};
