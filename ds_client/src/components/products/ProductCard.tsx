import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Product {
    id: number;
    name: string;
    formatted_price: string;
    image: string | null;
    rating: number;
    stock: number;
    isWishListed: boolean;
}

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onToggleWishlist?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onToggleWishlist, }: ProductCardProps) {
    const [wishListed, setWishListed] = useState(product.isWishListed ?? false);

    const handleWishList = () => {
        setWishListed(!wishListed);
        onToggleWishlist?.(product);
    };

    const isOutOfStock = product.stock <= 0;

    return (
        <div className="relative border rounded-xl p-4 bg-white hover:shadow-lg transition">
            {/*Wish list icon*/}
            <button
                onClick={handleWishList}
                aria-label="Add to wishlist"
                className="absolute top-3 right-3 group">
                <Heart
                    className={`w-5 h-5 transition-all duration-300 ease-out
                        ${wishListed
                            ? "fill-red-500 text-red-500 scale-125 animate-pulse"
                            : "text-gray-400 group-hover:scale-110"
                        }`}
                />
            </button>
            {/* Image of the product */}
            <Link to={`/products/${product.id}/`}>
                <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="h-40 w-full object-cover rounded-md"
                />
                {/* Name of the product */}
                <h3 className="font-semibold mt-2">{product.name}</h3>
            </Link>

            {/* Rating of the product */}
            <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < product.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                            }`}
                    />
                ))}
            </div>

            {/* Price of the product */}
            <p className="text-sm text-gray-600 mt-1">
                Kes.{product.formatted_price}
            </p>
            {/* Status of the stock */}
            {isOutOfStock ? (<p className="text-sm text-red-500 mt-1">Out of Stock</p>) :
                (<p className="text-sm text-green-600 mt-1">In Stock</p>)
            }

            {/* 🛒 Add to Cart */}
            <button
                disabled={isOutOfStock}
                onClick={() => onAddToCart?.(product)}
                className={`
                    mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg transition
                     ${isOutOfStock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    }
                    `}
            >
                <ShoppingCart className="w-4 h-4" />
                {isOutOfStock ? "Unavailable" : "Add to Cart"}
            </button>
        </div>
    );
}