import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTiktok, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="bg-gray-200 dark:bg-gray-900 text-gray-500 mt-2">
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand details */}
                <div>
                    <h2 className="text-xl font-bold text-gray-500">Nzisa Fashions</h2>
                    <p className="mt-3 text-sm">
                        Your trusted online marketplace for quality products at unbelievable prices.
                    </p>
                    {/* Social media Links */}
                    <div className="flex items-center gap-4 mt-4 text-xl">
                        <a
                            href="https://instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-pink-500 transition"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="https://facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition"
                        >
                            <FaFacebookF />
                        </a>
                        <a
                            href="https://tiktok.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-black dark:hover:text-white transition"
                        >
                            <FaTiktok />
                        </a>
                        <a
                            href="https://x.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-black dark:hover:text-white transition"
                        >
                            <FaXTwitter />
                        </a>
                    </div>
                </div>

                {/* E-Shop */}
                <div>
                    <h3 className="text-gray-500 font-bold mb-3">Shop</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-white">All Products</Link></li>
                        <li><Link to="/categories" className="hover:text-white">Categories</Link></li>
                        {/* <li><Link to="/my-orders/" className="hover:text-white">My Orders</Link></li> */}
                    </ul>
                </div>

                {/* User Account Navigation */}
                <div>
                    <h3 className="text-gray-500 font-bold mb-3">My Account</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/login" className="hover:text-white">Login</Link></li>
                        <li><Link to="/register" className="hover:text-white">Register</Link></li>
                        <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-gray-500 font-bold mb-3">Contact</h3>
                    <p className="text-sm">Located: Along xxx Road, xxx Building</p>
                    <p className="text-sm mt-1">Email: support@nzisafashions.co.ke</p>
                    <p className="text-sm mt-1">Phone: +254 xxx xxx xxx</p>
                </div>
            </div>
            <div className="bg-gray-300 dark:bg-gray-900 py-4 text-center text-sm mt-4">
                © {new Date().getFullYear()} Nzisa Fashions. All rights reserved.
            </div>
        </footer>
    )
}