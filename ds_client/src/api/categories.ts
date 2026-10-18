import api from "./axios";

export interface Category {
  id: number;
  name: string;
  slug?: string;
}

//For fetching all categories
export const fetchCategories = () =>
  api.get("/categories/categories-list-create/");

//For creating new categories
export const createCategory = (name: string) =>
  api.post("/categories/categories-list-create/", { name });

//For fetching one category
export const fetchCategory = (category_id: number) =>
  api.get(`/categories/category-detail/${category_id}`);

// Update a category
export const updateCategory = (category_id: number, name: string) =>
  api.patch(`/categories/category-detail/${category_id}/`, { name });

// Delete a category
export const deleteCategory = (category_id: number) =>
  api.delete(`/categories/category-detail/${category_id}/`);
