import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProduct } from "../api/products";
import ReviewList from "../components/products/ReviewList";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        if (!id) return;

        fetchProduct(Number(id))
            .then(res => {
                console.log("ProductDetails mounted", id);
                setProduct(res.data)
            })
            .catch(() => alert("Product details not found"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <p className="text-center py-6">Loading product detais...</p>
    }

    if (!product) {
        return <p className="text-center py-6">Product not found</p>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img
                src={product.image}
                alt={product.name}
                className="rounded-lg"
            />
            <div>
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="my-6 text-gray-500">{product.description}</p>
                <button
                    onClick={() => addToCart(product)}
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Add to Cart
                </button>
                <ReviewList productId={product.id} />
            </div>
        </div>
    );
}