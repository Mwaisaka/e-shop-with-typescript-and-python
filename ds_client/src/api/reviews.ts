import api from "./axios";

export const fetchReviews = (product_id: number) =>
  api.get(`products/${product_id}/reviews/`);

export const createReview = (
  product_id: number,
  data: {
    rating: number;
    comment: string;
  }
) => api.post(`products/${product_id}/reviews/add_review/`, data);

export const updateReview = (
  review_id: number,
  data: {
    rating: number;
    comment: string;
  }
) => api.put(`/reviews/${review_id}/update_review/`, data);

export const deleteReview = (review_id: number) =>
  api.delete(`/reviews/${review_id}/delete_review/`);

export const fetchAverageRating = (productId: number) =>
  api.get(`/reviews/average/${productId}/`);
