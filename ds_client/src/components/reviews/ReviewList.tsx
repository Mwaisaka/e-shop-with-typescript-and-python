import { useEffect, useState } from "react";
import { fetchReviews } from "../../api/reviews"
import { Review } from "../../types/reviews";

export default function ReviewList({ productId }: { productId: number }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchReviews(productId)
            .then(res => setReviews(res.data))
            .catch(() => setReviews([]))
            .finally(() => setLoading(false))
    }, [productId]);

    return (
        <div>
            <h3 className="font-bold mb-2">Reviews</h3>
            {reviews.map(rev => (
                <div key={rev.id} className="border-b py-2">
                    <p>{"⭐".repeat(rev.rating)}</p>
                    <p>{rev.comment}</p>
                </div>
            ))}
        </div>
    );
}