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

export default function Navbar() {
    const { user, logout } = useAuth();
    const { dark, setDark } = useTheme();
    const { items } = useCart();
    const [categories, setCategories] = useState<any[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [mobile, setMobile] = useState(false);
    const { q, category, setQuery } = useSearchQuery();
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    const selectedCategory = categories.find((cat) => cat.slug === category)?.name || "All Categories";

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

    return (
        <nav className="sticky top-0 bg-gray-200 dark:bg-gray-900 relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Left */}
                <div className="flex items-center gap-4">
                    {/* Shop Logo */}
                    <Link to="/" className="text-2xl italic font-bold text-indigo-600">
                        Nzisa Fashions
                    </Link>
                    <button className="md:hidden mr-6" onClick={() => setMobile(true)}>
                        Menu
                    </button>

                    {mobile && (
                        <div className="absolute top-full left-0 w-full bg-gray-300 dark:bg-gray-800 shadow-md md:hidden z-50 rounded-lg">
                            <div className="flex flex-col p-4 space-y-2">
                                {/* Close button */}
                                <button
                                    className="self-end mb-2 font-bold "
                                    onClick={() => setMobile(false)}
                                >
                                    ✕ Close
                                </button>
                                <div className="flex items-center bg-gray-100 dark:bg-gray-300 rounded px-3 py-1">
                                    <Search size={18} className="text-gray-500" />
                                    <input
                                        value={q}
                                        onChange={(e) => setQuery("q", e.target.value)}
                                        className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-300 text-black"
                                        placeholder="Search products, categories ..."
                                    />
                                </div>

                                {/* Categories */}
                                {categories.map(c => (
                                    <Link
                                        key={c.id}
                                        to={`/?q=${c.slug}`}
                                        className="block px-4  hover:bg-gray-100 dark:hover:bg-gray-700 "
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
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => setMobile(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                    <div id="categories-dropdown" className=" hidden md:flex ml-14 relative"
                        onMouseEnter={() => setCategoriesOpen(true)}
                        onMouseLeave={() => setCategoriesOpen(false)}
                    >
                        <button
                            className="font-medium px-4 py-2 bg-gray-100 rounded-xl text-black "
                        // onClick={() => setCategoriesOpen(!categoriesOpen)}
                        >
                            {selectedCategory}
                        </button>
                        {categoriesOpen && (
                            <div className="absolute z-50 mt-10 w-48 bg-white dark:bg-gray-800 shadow rounded">
                                <Link
                                    to="/"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setCategoriesOpen(false)}
                                >
                                    All Categories
                                </Link>
                                {categories.map(c => (
                                    <Link
                                        key={c.id}
                                        to={`/?category=${c.slug}`}
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
                <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-300 rounded-xl px-3 py-1">
                    <Search size={18} className="text-gray-500" />
                    <input
                        type="text"
                        value={q}
                        placeholder="Search products, categories ..."
                        onChange={(e) => setQuery("q", e.target.value)}
                        className="bg-transparent outline-none px-2 text-md w-90 text-black py-2"
                    />
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
                    <div>
                        {user?.is_staff && (
                            <a
                                href="/admin/"
                                target="_blank"
                                className="text-red-600 font-semibold w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Admin
                            </a>
                        )}
                    </div>
                    {user ? (
                        <div className="relative group">
                            <button className="text-sm font-medium px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                Hi, {user ? user.first_name
                                    .split(" ")
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ") : " "
                                }
                            </button>

                            <div className="absolute right-0 mt-0 w-40 bg-white dark:bg-gray-800 shadow-md rounded-lg hidden group-hover:block">
                                <Link
                                    to="/profile/"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    My Profile
                                </Link>
                                <Link
                                    to="/orders/"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    My Orders
                                </Link>
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>

                    ) : (
                        <>
                            <Link
                                to="/login/"
                                className="border border-indigo-600 text-indigo-600 px-4 py-1.5 rounded-xl hover:bg-indigo-50"
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/register/"
                                className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl hover:bg-indigo-700"
                            >
                                Create account
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}