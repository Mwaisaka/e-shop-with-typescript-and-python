import { createContext, useContext, useEffect, useState } from "react";
import { fetchCart, addToCartAPI, removeCartItem, updateCartItem, clearCart } from "../api/cart";
import toast from "react-hot-toast";

interface CartItem {
    id: number;
    product: any;
    quantity: number;
    product_price: number;
    product_name: string;
    product_image: string | null;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any, quantity: number) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, qty: number) => void;
    clearCartHandler: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: any) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load cart from backend
    const loadCart = async () => {
        try {
            const res = await fetchCart();
            setItems(res.data?.items || []);
        } catch (error) {
            console.error(error);
            setItems([]);
        }
    };

    useEffect(() => {
        const initCart = async () => {
            await loadCart(); // ensures session is created
        };
        initCart();
    }, []);

    const addToCart = async (product: any, quantity: number) => {
        try {
            const res = await addToCartAPI(product.id, quantity);
             setItems(res.data?.items || []);

            toast.success(`${product.name} added to cart 🛒`);

        } catch (error) {
            console.error(error);
            toast.error("Failed to add item to cart");
        }
    };

    const removeFromCart = async (id: number) => {
        try {
            const existingItem = items.find(i => i.id === id);

            const res = await removeCartItem(id);
             setItems(res.data?.items || []);

            toast(`${existingItem?.product_name} removed from cart`, {
                icon: "❌",
                id: `cart-remove-${id}`,
            });

        } catch (error) {
            console.error(error);
        }
    };

    const updateQuantity = async (id: number, qty: number) => {
        try {
            const existingItem = items.find(i => i.id === id);

            if (qty < 1) {
                // remove item instead
                const res = await removeCartItem(id);
                 setItems(res.data?.items || []);

                toast(`${existingItem?.product_name} removed from cart`, {
                    icon: "❌",
                    id: `cart-remove-${id}`,
                });

                return;
            }

            const res = await updateCartItem(id, qty);
             setItems(res.data?.items || []);

            toast.success(
                `Updated ${existingItem?.product_name} quantity to ${qty}`,
                { id: `cart-update-${id}` }
            );

        } catch (error) {
            console.error(error);
        }
    };

    // Clear cart
    const clearCartHandler = async () => {
        try {
            await clearCart(); // API call
            setItems([]);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCartHandler }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside a CartProvider");
    return context;
};