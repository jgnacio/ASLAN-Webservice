import { UnicomAPICategory } from "@/Resources/API/Unicom/entities/Category/UnicomAPICategory";
import { UnicomAPIProductCategoryAdapter } from "@/Resources/API/Unicom/adapters/UnicomAPIProductCategoryAdsapter";

export const getAllCategories = async (): Promise<UnicomAPICategory[]> => {
  const unicomAPICategoryAdapter = new UnicomAPIProductCategoryAdapter();
  const response = unicomAPICategoryAdapter.getAll();
  //   console.log(response);
  return response;
};
