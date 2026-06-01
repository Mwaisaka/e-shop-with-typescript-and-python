import { useState } from "react";
import { createReview } from "../../api/reviews";

interface Props {
    productId: number;
    onSuccess?: () => void;
}
export default function ReviewFrom({ productId, onSuccess }: Props) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            await createReview(productId, {
                rating,
                comment,
            });

            alert("Review submitted");
            setComment("");

            onSuccess?.();
        } catch (err: any) {
            console.error(err);
            alert(
                err?.response?.data?.detail ||
                "Failed to submit review"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow mt-6">
            <h3 className="font-bold text-lg mb-4">Write a Review</h3>
            <select
                value={rating}
                onChange={(e) =>
                    setRating(Number(e.target.value))
                }
                className="border p-2 rounded w-full mb-3"
            >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
            </select>
            <textarea
                value={comment}
                onChange={(e) =>
                    setComment(e.target.value)
                }
                placeholder="Write your review..."
                className="border p-2 rounded w-full mb-3"
                rows={4}
            />
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded"
            >
                {loading
                    ? "Submitting..."
                    : "Submit Review"}
            </button>
        </div>
    );
}