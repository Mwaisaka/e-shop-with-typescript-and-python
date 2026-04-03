import api from "./axios";

export const fetchCart = () => api.get("/cart/cart-items/");
export const removeCartItem = (item_id: number) =>
  api.delete(`/cart/remove-cart-item/${item_id}/`);
export const clearCart = () => api.delete("/cart/clear-cart/");
export const addToCartAPI = (productId: number, quantity: number) =>
  api.post("/cart/add-to-cart/", {
    product_id: productId,
    quantity,
  });
export const updateCartItem = (item_id: number, quantity: number) =>
  api.put(`/cart/update-cart-item/${item_id}/`, {
    quantity,
  });
