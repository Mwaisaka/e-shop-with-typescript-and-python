import { useState, useEffect } from "react";
import ProductCard from "../components/products/ProductCard";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../api/products";

import { Product } from "../types/product";
import { fetchProducts } from "../api/products";

// interface Product {
//     id: number;
//     name: string;
//     price: number;
//     image: string;
//     stock: number;
// }

export default function Home() {
    const [params] = useSearchParams();
    const q = params.get("q") || "";
    const category = params.get("category") || "";
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     setLoading(true);
    //     searchProducts({q,category})
    //     fetchProducts()
    //         .then(res => setProducts(res.data))
    //         .catch(() => alert("Failed to load products"))
    //         .finally(() => setLoading(false));
    // }, []);

    useEffect(() => {
        setLoading(true);
        searchProducts({ q, category })
            .then(res => setProducts(res.data))
            .catch(() => alert("Failed to load products"))
            .finally(() => setLoading(false));
    }, [q, category]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            {/* Loading indicator... */}
            {/* {loading && <p className="text-center py-4">Loading products...</p>} */}

            <h2 className="text-xl font-semibold mb-4">
                Search results {q && `for "${q}"`}
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
            {/* Products display grid */}
            {/* {!loading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {products.map((p: any) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )} */}
        </div>
    )
}