import api from "./axios";

// export const fetchProducts = () => api.get("/products/"); //For creating new products/fetching all products
export const fetchProduct = (product_id: number) =>
  api.get(`/products/product-detail/${product_id}/`);
export const fetchCategories = (categoryId: number) =>
  api.get(`/products/?category=${categoryId}`);
export const searchProducts = (params: {
  q?: string;
  category?: string;
  max_price?: number;
  rating?: number;
  page?: Number;
}) => api.get("/products/", { params });

export const fetchRelatedProducts = (productId: number) =>
  api.get(`/products/${productId}/related/`);

export const fetchGroupedProducts = () => 
  api.get('/products/grouped-products/')

export const fetchProducts = (params?: Record<string, string | number>) =>
  api.get("/products/products-list-create/", { params });

export const createProduct = (data: FormData) =>
  api.post("/products/products-list-create/", data);

export const updateProduct = (id: number, data: FormData) =>
  api.patch(`/products/product-detail/${id}/`, data);

export const deleteProduct = (id: number) =>
  api.delete(`/products/product-detail/${id}/`);
