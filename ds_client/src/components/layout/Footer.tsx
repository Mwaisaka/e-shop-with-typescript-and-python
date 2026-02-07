import { Link } from "react-router-dom";

export default function Footer(){
    return(
        <footer className="bg-white dark:bg-gray-900 text-gray-500 mt-16 border-t">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand details */}
                <div>
                    <h2 className="text-xl font-bold text-gray-500">Nzisa Fashions</h2>
                    <p className="mt-3 text-sm">
                         Your trusted online marketplace for quality products at unbelievable prices.
                    </p>
                </div>

                {/* E-Shop */}
                <div>
                    <h3 className="text-gray-500 font-semibold mb-3">Shop</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-white">All Products</Link></li>
                        <li><Link to="/categories" className="hover:text-white">Categories</Link></li>
                        <li><Link to="/orders" className="hover:text-white">My Orders</Link></li>
                    </ul>
                </div>

                {/* User Account Navigation */}
                <div>
                    <h3 className="text-gray-500 font-semibold mb-3">My Account</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/login" className="hover:text-white">Login</Link></li>
                        <li><Link to="/register" className="hover:text-white">Register</Link></li>
                        <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-gray-500 font-semibold mb-3">Contact</h3>
                    <p className="text-sm">Email: support@shopit.co.ke</p>
                    <p className="text-sm mt-1">Phone: +254 xxx xxx xxx</p>
                </div>
            </div>
            <div className="border-t border-gray-700 py-4 text-center text-sm">
                © {new Date().getFullYear()} ShopIt. All rights reserved.
            </div>
        </footer>
    )
}