import { Link } from "react-router-dom";

export default function AdminNavbar() {
    return (
        <nav className="bg-gray-900 text-white px-6 py-3 flex gap-6">
            <Link to="/amdin/dashboard">Dashboard</Link>
            <Link to="/amdin/products">Products</Link>
            <Link to="/amdin/orders">Orders</Link>
            <Link to="/amdin/users">Users</Link>
        </nav>
    )
}