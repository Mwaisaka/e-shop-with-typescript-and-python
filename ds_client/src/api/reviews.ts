import api from "./axios";

export const fetchReviews = (product_id : number) => 
    api.get(`products/${product_id}/reviews/`);
export const createReview = (product_id:number, data : any) => 
    api.get(`products/${product_id}/reviews/add_review/`, data);
export const updateReview = (review_id:number) => 
    api.get(`/reviews/${review_id}/update_review/`);
export const deleteReview = (review_id: number) =>
    api.get(`/reviews/${review_id}/delete_review/`)

export const fetchAverageRating = (productId: number) =>
    api.get(`/reviews/average/${productId}/`);

