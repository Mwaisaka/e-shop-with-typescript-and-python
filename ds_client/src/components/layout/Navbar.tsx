import { Link } from "react-router-dom";
import { Menu, ShoppingCart, Moon, Sun } from "lucide-react";
import React, { useState, useEffect } from "react";
import { fetchCategories } from "../../api/categories";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext"
import CartPreview from "../cart/CartPreview";
import { Search } from "lucide-react";
import { useNavigate, replace } from "react-router-dom";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { dark, setDark } = useTheme();
    const { items } = useCart();
    const [categories, setCategories] = useState<any[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [mobile, setMobile] = useState(false);
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (query.trim()) {
                navigate(`?q=${encodeURIComponent(query)}`, { replace: true });
            } else {
                navigate("", { replace: true });
            }
        }, 400); //Debounce time

        return () => clearTimeout(delay)
    }, [query, navigate]);

    useEffect(() => {
        fetchCategories()
            .then(res => setCategories(res.data))
            .catch(() => setCategories([]))
    }, [])

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

    return (
        <nav className="bg-white dark:bg-gray-900 border-b relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Left */}
                <div className="flex items-center gap-4">
                    {/* Shop Logo */}
                    <Link to="/" className="text-xl font-bold text-indigo-600">
                        ShopIt
                    </Link>
                    <button className="md:hidden" onClick={() => setMobile(true)}>
                        Menu
                    </button>

                    {mobile && (
                        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-100 shadow-md md:hidden z-50">
                            <div className="flex flex-col p-4 space-y-2">
                                {/* Close button */}
                                <button
                                    className="self-end mb-2 font-bold"
                                    onClick={() => setMobile(false)}
                                >
                                    ✕ Close
                                </button>
                                <form className="flex items-center bg-gray-100 dark:bg-gray-800 rounded px-3 py-1">
                                    <Search size={18} className="text-gray-500" />
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-800"
                                        placeholder="Search products..."
                                    />
                                </form>

                                {/* Categories */}
                                {categories.map(c => (
                                    <Link
                                        key={c.id}
                                        to={`?q=${c.slug}`}
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-200"
                                        onClick={() => setMobile(false)} // close menu on click
                                    >
                                        {c.name}
                                    </Link>
                                ))}


                                {/* Auth Links */}
                                {user ? (
                                    <button onClick={logout} className="text-left px-4 py-2">
                                        Logout
                                    </button>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            onClick={() => setMobile(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block px-4 py-2 hover:bg-indigo-50"
                                            onClick={() => setMobile(false)}
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Categories dropdown */}
                    <div id="categories-dropdown" className="relative">
                        <button
                            className="font-medium px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                            onClick={() => setCategoriesOpen(!categoriesOpen)}
                        >
                            All Categories
                        </button>
                        {categoriesOpen && (
                            <div className="absolute z-50 mt-2 w-48 bg-white dark:bg-gray-800 shadow rounded">
                                {categories.map(c => (
                                    <Link
                                        key={c.id}
                                        to={`?q=${c.slug}`}
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => setCategoriesOpen(false)} // close after click
                                    >
                                        {c.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <form className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded px-3 py-1">
                    <Search size={18} className="text-gray-500" />
                    <input
                        type="text"
                        value={query}
                        placeholder="Search products ..."
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-transparent outline-none px-2 text-sm w-90"
                    />
                </form>

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