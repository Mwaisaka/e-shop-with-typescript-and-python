import { Link } from "react-router-dom";

export default function OrderSuccess() {
    return (
        <div className="max-w-2xl mx-auto text-center py-20 px-4">
            <div className="bg-white shadow rounded-xl p-8">
                <h1 className="text-3xl font-bold text-green-600 mb-4">
                    ✅ Order Placed Successfully!
                </h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase.
                    Your order has been received and is being processed.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/#products-section" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                        Continue Shopping
                    </Link>
                    <Link to="/my-orders/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                        View Orders
                    </Link>
                </div>
            </div>
        </div>
    );
}