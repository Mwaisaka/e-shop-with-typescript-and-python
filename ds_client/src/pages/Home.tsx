import { useState, useEffect } from "react";
import ProductCard from "../components/products/ProductCard";
import { searchProducts } from "../api/products";
import { useSearchQuery } from "../hooks/useSearchQuery";

export default function Home() {
    const { q, category, maxPrice, rating } = useSearchQuery();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        searchProducts({ q, category, max_price: maxPrice, rating })
            .then((res) => setProducts(res.data))
            .catch(() => alert("Failed to load products"))
            .finally(() => setLoading(false));
    }, [q, category, maxPrice, rating]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                {q ? `Search results for "${q}"` : "All Products"}
            </h2>
            {products.length === 0 ? (
                <p>No products found</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {products.map((p: any) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
}
