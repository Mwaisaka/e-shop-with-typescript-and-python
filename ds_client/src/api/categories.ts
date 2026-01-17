import api from "./axios"

export const fetchCategories = ()=> 
    api.get("/categories/categories-list-create/"); //For creating new categories/fetching all categories
export const fetchCategory = (category_id:number) => 
    api.get(`/categories/category-detail/${category_id}`);