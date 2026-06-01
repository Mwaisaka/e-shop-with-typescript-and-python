import { useEffect, useState } from "react";
import { fetchReviews } from "../../api/reviews"
import { Review } from "../../types/reviews";

export default function ReviewList({ productId }: { productId: number }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const res = await fetchReviews(productId);
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadReviews();
    }, [productId]);

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">Customer Reviews ({reviews.length})</h3>
            {reviews.length === 0 && (
                <p>No reviews yet.</p>
            )}
            {reviews.map(rev => (
                <div key={rev.id} className="border-b py-4">
                    <div className="flex items-center gap-2">
                        <strong>
                            {rev.user_name}
                        </strong>
                        <span>
                            {"⭐".repeat(rev.rating)}
                        </span>
                    </div>
                    <p className="mt-2">{rev.comment}</p>
                </div>
            ))}
        </div>
    );
}