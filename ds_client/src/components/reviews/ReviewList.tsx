import { useEffect, useState } from "react";
import { fetchReviews } from "../../api/reviews"
import { Review } from "../../types/reviews";

export default function ReviewList({ productId }: { productId: number }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

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
            <h3 className="text-xl font-bold mb-2 border-b-2">Customer Reviews ({reviews.length})</h3>
            {reviews.length === 0 && (
                <p>No reviews yet.</p>
            )}
            {reviews.map(rev => (
                <div key={rev.id} className="border-b py-4">
                    <div className="flex items-center gap-2">
                        
                        <span>
                            {"⭐".repeat(rev.rating)}
                        </span>
                    </div>
                    <p className="mt-2 text-sm">{rev.comment}</p>
                    <p className="flex items-center gap-1 mt-2 text-sm">{formatDate(rev.created_at)} by
                        <span>
                            {rev.user_name.charAt(0).toUpperCase() + rev.user_name.slice(1).toLocaleLowerCase()}
                        </span>
                    </p>
                </div>
            ))}
        </div>
    );
}