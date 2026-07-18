import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import {  searchProducts } from "../api/products";
import { useSearchQuery } from "../hooks/useSearchQuery";

export default function Products() {
    const { q, category, max_price, rating, page, setQuery } = useSearchQuery();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const location = useLocation();

    const fetchData = async () => {
        setLoading(true);
        try {
            // const res = await searchProducts({ q, category, max_price, rating });

            const filters: any = { page };

            if (q) filters.q = q;
            if (category) filters.category = category;
            if (max_price !== 500000) filters.max_price = max_price;
            if (rating > 0) filters.rating = rating;

            console.log("Category:", category);
            console.log("Filters:", filters);

            const res = await searchProducts(filters);
            setProducts(res.data.results);
            setTotalPages(Math.ceil(res.data.count / 8));
        } catch {
            alert("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [q, category, max_price, rating, page]);

    useEffect(() => {
        if (!loading && location.hash) {
            setTimeout(() => {
                const element = document.querySelector(location.hash);

                if (element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }, 100);
        }
    }, [location, loading]);

    const handleRefresh = async () => {
        setQuery("page", 1);
    };


    if (loading) return <p>Loading...</p>;

    return (
        <div >
            <div id="products-section" className="p-4 bg-gray-400 mt-6 rounded-xl shadow-xl">
                <div className="flex justify-between items-center mb-4 mt-0 bg-gray-200 p-2 rounded-xl">
                    <h2 className="text-xl font-semibold">
                        {q ? `Search results for "${q}"` : `${category}`}
                    </h2>
                    {/* Refresh button */}
                    <button
                        onClick={handleRefresh}
                        className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                        🔄 Refresh Products
                    </button>
                </div>
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
                                onClick={() => setQuery("page", page - 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >Prev</button>
                            <span className="px-4 py-1">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setQuery("page", page + 1)}
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
        </div>
    );
}