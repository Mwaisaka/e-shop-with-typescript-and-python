import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

export default function CartPreview() {
    const { items, removeFromCart, updateQuantity } = useCart();
    
    console.log("Items", items)

    const subtotal = items.reduce(
        (total, item) => total + item.product_price * item.quantity,
        0
    );

    return (
        <div className="absolute right-0 top-full w-80 bg-white dark:bg-gray-800 shadow-xl rounded p-4 z-50 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-md mb-3">🛒 Your Cart</h4>
            {items.length === 0 && <p className="text-sm text-gray-500">Your cart is empty</p>}

            <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.slice(0, 4).map(item => (
                    <div key={item.id} className="flex items-center gap-3 border-b pb-2">
                        {/* Product image */}
                        <img
                            src={item.product_image || "/placeholder.png"}
                            alt={item.product_name}
                            className="w-12 h-12 object-cover rounded"
                        />
                        {/* Product info */}
                        <div className="flex-1">
                            <p className="text-sm font-medium line-clamp-1">
                                {item.product_name}
                            </p>
                            <p className="text-xs text-gray-500">
                                Kes. {item.product_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-1">
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                -
                            </button>
                            <span className="text-sm font-semibold">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                +
                            </button>
                        </div>
                        {/* Remove Button */}
                        <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 text-sm hover:text-red-700"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
            {items.length > 0 && (
                <>
                    {/* Subtotal */}
                    <div className="flex justify-between mt-4 font-semibold">
                        <span>Subtotal</span>
                        <span>Kes. {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    {/* View Cart Button */}
                    <Link
                        to="/cart/"
                        className="block text-center mt-3 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-900 transition"
                    >
                        View Cart
                    </Link>
                </>
            )}
        </div>
    )
}