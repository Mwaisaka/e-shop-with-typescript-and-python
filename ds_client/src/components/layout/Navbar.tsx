import { Link } from "react-router-dom";
import { Menu, ShoppingCart, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchCategories } from "../../api/categories";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext"
import CartPreview from "../cart/CartPreview";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { dark, setDark } = useTheme();
    const { items } = useCart();
    const [categories, setCategories] = useState<any[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        fetchCategories()
            .then(res => setCategories(res.data))
            .catch(() => setCategories([]))
    }, [])

    return (
        <nav className="bg-white dark:bg-gray-100 border-b">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Left */}
                <div className="flex items-center gap-4">
                    <button className="md:hidden" onClick={() => setMobile(true)}>
                        Menu
                    </button>

                    {/* Shop Logo */}
                    <Link to="/" className="text-xl font-bold text-indigo-600">
                        ShopIt
                    </Link>

                    {/* Categories dropdown */}
                    <div className="hidden md:block relative group">
                        <button className="font-medium">Categories</button>
                        <div className="absolute hidden group-hover:block bg-white shadow rounded mt-2">
                            {categories.map(c => (
                                <Link
                                    key={c.id}
                                    to={`/category/${c.slug}`}
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4 relative">
                    <button onClick={() => setDark(!dark)}>
                        {dark ? <Sun /> : <Moon />}
                    </button>
                    <div className="relative">
                        <ShoppingCart
                            className="cursor-pointer"
                            onMouseEnter={() => setShowCart(true)}
                            onMouseLeave={() => setShowCart(false)}
                        />
                        {showCart && <CartPreview />}
                    </div>
                    {user ? (
                        <button onClick={logout} className="text-sm">
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="border border-indigo-600 text-indigo-600 px-4 py-1.5 rounded hover:bg-indigo-50"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}