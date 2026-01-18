import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

export default function CartPreview() {
    const { items } = useCart();

    return (
        <div className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-800 shadow-lg rounded p-4">
            <h4 className="font-semibold mb-2">Cart</h4>
            {items.length === 0 && <p className="text-sm">Cart is empty</p>}

            {items.slice(0, 3).map(item => (
                <div key={item.id} className="text-sm flex justify-between">
                    <span>{item.product.name}</span>
                    <span>x{item.quantity}</span>
                </div>
            ))}

            <Link
                to="/cart"
                className="block text-center mt-3 bg-indigo-600 text-white py-1 rounded"
            >
                View Cart
            </Link>
        </div>
    )
}