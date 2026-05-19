import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders";
import { useState } from "react";

export default function CheckOut() {
  const { items, clearCartHandler } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    shipping_address: "",
  });

  const total = items.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0,
  );

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async () => {
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone ||
      !formData.shipping_address
    ) {
      alert("Please fill in all customer details fields");
      return;
    }

    const confirmOrder = window.confirm(
      "Are you sure you want to place this order?",
    );

    if (!confirmOrder) {
      return;
    }
    try {
      const orderData = {
        ...formData,
        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.product_price,
        })),
        total: total,
      };
      console.log(orderData);
      await createOrder(orderData);

      alert("✅ Order placed successfully!");

      clearCartHandler();

      navigate("/order-success/");
    } catch (err: any) {
      console.error(err.response?.data);
      alert("❌ Failed to place order");
    }
  };

  if (items.length === 0) {
    return <p className="text-center mt-10">No items in cart.</p>;
  }
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">🧾 Check Out</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT : Customer static data */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-4">Delivery Details</h3>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />
          <textarea
            name="shipping_address"
            placeholder="Delivery Address"
            value={formData.shipping_address}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />
        </div>
        {/* RIGHT : Order Summary */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-4">Order Summary</h3>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>
                {item.product_name} x {item.quantity}
              </span>
              <span>
                Kes{" "}
                {(item.product_price * item.quantity).toLocaleString(
                  undefined,
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                )}
              </span>
            </div>
          ))}

          <div className="flex justify-between font-bold text-lg border-t border-b py-2 mt-4 mb-4">
            <span>Total</span>
            <span>
              Kes{" "}
              {total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="m-6 font-semibold italic">
            <h3>Note : Dear valued customer, All payments to be done on delivery.</h3>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
