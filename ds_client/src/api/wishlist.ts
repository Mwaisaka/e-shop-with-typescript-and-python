import api from "./axios";

export const toggleWishlist = (productId: number) =>
    api.post("/wishlist/toggle/", { product_id: productId });
