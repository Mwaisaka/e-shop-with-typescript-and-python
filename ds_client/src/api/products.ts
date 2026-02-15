import api from "./axios";

export const fetchProducts = () => api.get("/products"); //For creating new products/fetching all products
export const fetchProduct = (product_id: number) =>
  api.get(`/products/product-detail/${product_id}/`);
export const fetchRelatedProducts = (categoryId: number) =>
  api.get(`/products/?category=${categoryId}`);
export const searchProducts = (params: { q?: string; category?: string; max_price?:number; rating?:number }) =>
  api.get("/products",{params});
