import { useState, useEffect } from "react";
import ProductCard from "../components/products/ProductCard";
import { searchProducts } from "../api/products";
import { useSearchQuery } from "../hooks/useSearchQuery";

export default function Home() {
    const { q, category, maxPrice, rating, page, setQuery } = useSearchQuery();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setLoading(true);
        searchProducts({ q, category, max_price: maxPrice, rating, page })
            .then((res) => {
                setProducts(res.data.results);
                setTotalPages(Math.ceil(res.data.count / 8));
            })
            .catch(() => alert("Failed to load products"))
            .finally(() => setLoading(false));
    }, [q, category, maxPrice, rating, page]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                {q ? `Search results for "${q}"` : "All Products"}
            </h2>
            {products.length === 0 ? (
                <p>No products found</p>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {products.map((p: any) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                        <button
                            disabled={page === 1}
                            onClick={() => setQuery("page", 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >First</button>
                        <button
                            disabled={page === 1}
                            onClick={() => setQuery("page", -1)}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >Prev</button>
                        <span className="px-4 py-1">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setQuery("page", +1)}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >Next</button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setQuery("page", totalPages)}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >Last</button>
                    </div>
                </>

            )}
        </div>
    );
}
