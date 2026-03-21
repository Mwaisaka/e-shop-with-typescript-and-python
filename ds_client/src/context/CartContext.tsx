import { createContext, useContext, useEffect, useState } from "react";
import { fetchCart } from "../api/cart";
import toast from "react-hot-toast";

interface CartItem {
    id: number;
    product: any;
    quantity: number;
    price: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, qty: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: any) => {
    const [items, setItems] = useState<any[]>([]);

    // Load cart from local storage
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            setItems(JSON.parse(saved));
        }
    }, []);

    // Save cart to local storage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    // Add to cart
    const addToCart = (product: any) => {
        setItems(prev => {
            const existing = prev.find(i => i.product.id === product.id);

            if (existing) {
                return prev.map(i =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }

            return [
                ...prev,
                {
                    id: product.id,
                    product,
                    quantity: 1,
                }
            ];
        });
        toast.success(
            `${product.name} ${items.find(i => i.product.id === product.id) ? "quantity updated 🛒" : "added to cart 🛒"}`,
            { id: `cart-${product.id}` } // prevents duplicates
        );
    };

    // Remove item from cart
    const removeFromCart = (id: number) => {
        setItems(prev => {
            const item = prev.find(i => i.product.id === id);

            if (item) {
                toast(`${item.product.name} removed from cart`, {
                    icon: "❌",
                    id: `cart-remove-${id}`, // prevents duplicates
                });
            }
            return prev.filter(item => item.product.id !== id);
        });
    };

    // Update Qauntity
    const updateQuantity = (id: number, qty: number) => {
        setItems(prev =>
            prev
                .map(item =>
                    item.product.id === id
                        ? { ...item, quantity: qty }
                        : item
                )
                .filter(item => item.quantity > 0)//Remove if qty = 0
        );

        const item = items.find(i => i.product.id === id);
        if (item) {
            toast.success(`Updated ${item.product.name} quantity to ${qty}`, {
                id: `cart-update-${id}`,
            });
        }
    };

    // Clear cart
    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside a CartProvider");
    return context;
};