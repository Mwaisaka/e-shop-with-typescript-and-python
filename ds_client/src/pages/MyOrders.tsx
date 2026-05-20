import { useEffect, useState } from "react";
import { fetchOrders } from "../api/orders";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  product_description: string;
  price: string;
  product_image?: string | null;
}

interface Order {
  id: number;
  order_number: string;
  total: string;
  order_status: string;
  delivery_status: string;
  shipping_address: string;
  created_at: string;
  items: OrderItem[];
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetchOrders();

        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "processing":
        return "bg-yellow-100 text-yellow-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "delivered":
        return "bg-purple-100 text-purple-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg font-medium text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="bg-white shadow-md rounded-xl p-10 text-center">
          <h2 className="text-2xl font-semibold mb-2">No Orders Yet.</h2>
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden"
            >
              {/* Order Header */}
              <div className="border-b px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">
                    Order #{order.order_number.slice(0, 8)}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Placed on {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col md:items-end gap-2">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(order.order_status)}`}
                  >
                    {order.order_status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Delivery:{" "}
                    <span className="font-medium capitalize">
                      {order.delivery_status.replace("_", " ")}
                    </span>
                  </span>
                </div>
              </div>
              {/* Shipping Address */}
              <div className="px-6 py-4 border-b">
                <h3 className="font-semibold mb-2">Shipping Address</h3>

                <p className="text-gray-600 text-sm">
                  {order.shipping_address}
                </p>
              </div>
              {/* Order Items */}
              <div className="p-6 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row md:items-center gap-4 border rounded-xl p-4"
                  >
                    {/* Product Image */}
                    <img
                      src={item.product_image || "/placeholder.png"}
                      alt={item.product_name}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {item.product_name}
                      </h3>
                      <p className="font-normal text-sm italic">
                        {item.product_description}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Quantity: {item.quantity}
                      </p>

                      <p className="text-gray-500 text-sm">
                        Price: Kes.{" "}
                        {Number(item.price).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    {/* Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        Kes.{" "}
                        {(Number(item.price) * item.quantity).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-700">
                  Total Amount Due
                </span>

                <span className="text-2xl font-bold text-green-600">
                  Kes.{" "}
                  {Number(order.total).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
