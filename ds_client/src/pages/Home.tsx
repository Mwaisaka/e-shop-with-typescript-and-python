import { useState, useEffect } from "react";
import { fetchProducts } from "../api/products";
import ProductCard from "../components/products/ProductCard";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    stock: number;
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts()
            .then(res => setProducts(res.data))
            .catch(() => alert("Failed to load products"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            {/* Loading indicator... */}
            {loading && <p className="text-center py-4">Loading products...</p>}

            {/* Products display grid */}
            {!loading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {products.map((p: any) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    )
}