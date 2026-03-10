import { useState, useEffect } from "react";
import ProductCard from "../components/products/ProductCard";
import { fetchProducts, searchProducts } from "../api/products";
import { useSearchQuery } from "../hooks/useSearchQuery";
import CategorySlider from "../components/home/CategorySlider";
import HeroBanner from "../components/home/HeroBanner";

export default function Home() {
    const { q, category, max_price, rating, page, setQuery } = useSearchQuery();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = async () => {
        setLoading(true);
        try {
            // const res = await searchProducts({ q, category, max_price, rating });

            const filters: any = { page };

            if (q) filters.q = q;
            if (category) filters.category = category;
            if (max_price !== 500000) filters.max_price = max_price;
            if (rating > 0) filters.rating = rating;

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

    const handleRefresh = async () => {
        setQuery("page", 1);
    };


    if (loading) return <p>Loading...</p>;

    return (
        <div >

            {/* Hero Banner */}
            <HeroBanner />
            
            {/* Category Slider */}
            <CategorySlider />

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold ">
                    {q ? `Search results for "${q}"` : "All Products"}
                </h2>
                {/* Refresh button */}
                <button
                    onClick={handleRefresh}
                    className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-sm"
                >
                    🔄 Refresh
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
    );
}
