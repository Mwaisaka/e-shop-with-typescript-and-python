import api from "./axios";

export const fetchCart = () => api.get("/cart/cart-items/");
export const addCart = () => api.get("/cart/add-to-cart/");
export const updateCartItem = (item_id:number) => 
    api.get(`/cart/update-cart-item/${item_id}/`);
export const removeCartItem = (item_id:number) => 
    api.get(`/cart/remove-cart-item/${item_id}/`);
export const clearCart = () => api.get("/cart/clear-cart/");
