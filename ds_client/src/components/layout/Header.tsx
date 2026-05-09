import { Link } from "react-router-dom";
import { Menu, ShoppingCart, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchCategories } from "../../api/categories";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext"
import CartPreview from "../cart/CartPreview";
import { Search } from "lucide-react";
import { useSearchQuery } from "../../hooks/useSearchQuery";

export default function Header() {
    const { user, logout } = useAuth();
    const { dark, setDark } = useTheme();
    const { items } = useCart();
    const [categories, setCategories] = useState<any[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [mobile, setMobile] = useState(false);
    const { q, category, setQuery } = useSearchQuery();
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    const selectedCategory = categories.find((cat) => cat.slug === category)?.name || "All Categories";
    const toggleCart = () => setShowCart(!showCart);

    useEffect(() => {
        fetchCategories()
            .then(res => setCategories(res.data))
            .catch(() => setCategories([]))
    }, [category])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("#categories-dropdown")) {
                setCategoriesOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const itemCount = items?.reduce((sum, item) => sum + item.quantity, 0);
    
    return (
        <div className="sticky top-0 bg-gray-200 dark:bg-gray-900 relative z-50 mb-6">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Left */}
                <div className="flex items-center gap-4">
                    {/* Shop Logo */}
                    <Link to="/" className="text-3xl italic font-bold text-indigo-600">
                        Nzisa Fashions
                    </Link>
               </div>
            </div>
        </div>
    )
}