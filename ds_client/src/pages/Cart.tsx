import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const { items, removeFromCart, updateQuantity, clearCartHandler } = useCart();
    const navigate = useNavigate();

    const total = items.reduce(
        (sum, item) => sum + item.product_price * item.quantity,
        0
    );
    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-2">🛒 Your Cart is Empty</h2>
                <p className="text-gray-500 mb-4">Start adding products to your cart.</p>

                <button
                    onClick={() => navigate("/")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    const handleCheckout = () => {
        alert("Proceeding to checkout...");
        clearCartHandler();
    };

    const handleContinueShopping = () => {
        navigate("/");
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h4 className="text-2xl font-bold mb-6 text-center">🛒 Your Shopping Cart</h4>
            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.product.id}
                        className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                    >
                        {/* Product info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{item.product_name}</h3>
                            <p className="text-gray-500 mb-2">Item Price: Kes.{item.product_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1 mb-2">
                                <button
                                    onClick={() =>
                                        updateQuantity(
                                            item.id,
                                            item.quantity - 1
                                        )
                                    }
                                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    -
                                </button>

                                <span className="w-6 text-center">
                                    {item.quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        updateQuantity(
                                            item.id,
                                            item.quantity + 1
                                        )
                                    }
                                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    +
                                </button>
                            </div>

                            {/* Subtotal */}
                            <div className="font-semibold">
                                Subtotal: Kes {(item.product_price * item.quantity).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700  mt-2"
                            >
                                Remove
                            </button>
                        </div>

                        {/* RIGHT SIDE: Product Image */}
                        <div className="ml-6">
                            <img
                                src={item.product_image || "/placeholder.png"}
                                alt={item.product_name}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Total + Checkout*/}
            <div className="mt-8 pb-4 border-t border-b pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="bg-gray-300 text-xl font-bold border rounded-md py-1 px-1">
                    Total: Kes. {total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </p>
                <div className="flex gap-5">
                    <button
                        onClick={handleContinueShopping}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-500 ease-out hover:scale-105"
                    >
                        Continue Shopping
                    </button>

                    <button
                        onClick={handleCheckout}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-500 ease-out hover:scale-105"
                    >
                        Proceed to Checkout
                    </button>

                </div>
            </div>
        </div>
    );
}