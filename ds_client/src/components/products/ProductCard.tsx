import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types/product";

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onToggleWishlist?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onToggleWishlist, }: ProductCardProps) {

    const [wishListed, setWishListed] = useState(product.isWishListed ?? false);
    const isOutOfStock = product.stock <= 0;
    const rating = product.avg_rating ?? 0;
    const rounded = Math.round(rating);

    const handleWishList = () => {
        setWishListed(!wishListed);
        onToggleWishlist?.(product);
    };

    return (
        <div className="relative border rounded-xl p-4 bg-white transform transition duration-300 ease-in-out hover:scale-105">

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
                <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-4 h-4 ${star <= rounded
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                        />
                    ))}

                    <span className="text-xs text-gray-500 ml-1">
                        ({rating.toFixed(1)} • {product.review_count ?? 0})
                    </span>
                </div>

                {/*Wish list icon*/}
                <button
                    onClick={handleWishList}
                    aria-label="Add to wishlist"
                    className="relative top-1- right-1 left-4 group">
                    <Heart
                        className={`w-5 h-5 transition-all duration-300 ease-out
                        ${wishListed
                                ? "fill-red-500 text-red-500 scale-125 animate-pulse"
                                : "text-gray-400 group-hover:scale-110"
                            }`}
                    />
                </button>
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