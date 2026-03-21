import { useCart } from "../context/CartContext";

export default function Cart() {
    const { items, removeFromCart, updateQuantity, clearCart } = useCart();

    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty 🛒</h2>
                <p className="text-gray-500">Start adding products to your cart.</p>
            </div>
        );
    }

    const handleCheckout = () =>{
        alert("Proceeding to checkout...");
        clearCart();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h4 className="text-2xl font-bold mb-6 text-center">Shoping Cart</h4>
            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.product.id}
                        className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                    >
                        {/* Product info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{item.product.name}</h3>
                            <p className="text-gray-500 mb-2">Item Price: Kes.{item.product.formatted_price.toLocaleString()}</p>
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1 mb-2">
                                <button
                                    onClick={() =>
                                        updateQuantity(
                                            item.product.id,
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
                                            item.product.id,
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
                                Subtotal: Kes {(item.product.price * item.quantity).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>

                            <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-red-500 hover:text-red-700  mt-2"
                            >
                                Remove
                            </button>
                        </div>

                         {/* RIGHT SIDE: Product Image */}
                        <div className="ml-6">
                            <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Total + Checkout*/}
            <div className="mt-8 pb-4 border-t border-b pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xl font-bold">
                    Total: Kes {total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </p>
                    <button
                    onClick={handleCheckout}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                        Proceed to Checkout
                    </button>

            </div>
        </div>
    );
}