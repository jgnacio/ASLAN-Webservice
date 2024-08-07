"use server";
import { getAllCategories } from "../_actions/get-category";
export default async function CategoryList() {
  const categories = await getAllCategories();
  console.log(categories);
  return (
    <div>
      <h1>CategoryList</h1>
      <pre>{JSON.stringify(categories, null, 2)}</pre>
    </div>
  );
}
