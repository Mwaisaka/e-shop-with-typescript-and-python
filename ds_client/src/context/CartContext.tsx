import { createContext, useContext, useEffect, useState } from "react";
import {fetchCart} from "../api/cart";

interface CartItem {
    id: number;
    product : string;
    quantity: number;
    price : number;
}

interface CartContextType {
    items : CartItem[];
    loading : boolean;
}

const CartContext = createContext<CartContextType | null >(null);

export const CartProvider = ({children} : any) =>{
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        fetchCart()
        .then((res)=>setItems(res.data))
        .catch(()=>setItems([]))
        .finally(()=>setLoading(false));
    },[]);

    return(
        <CartContext.Provider value  ={{items, loading}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context=useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used inside a CartProvider");
    }
    return context;
};