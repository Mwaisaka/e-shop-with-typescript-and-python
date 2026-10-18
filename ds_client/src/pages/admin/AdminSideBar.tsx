import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

export default function AdminSideBar() {
    return (
        <aside className= "w-25 bg-gray-400 text-white transition-all duration-300 flex flex-col">
            <Link to="/">Home</Link>
            <Link to="/admin/dashboard/">Dashboard</Link>
            <Link to="/admin/products/">Products</Link>
            <Link to="/admin/categories/">Categories</Link>
            <Link to="/admin/orders/">Orders</Link>
            <Link to="/admin/users/">Users</Link>
        </aside>
    )
}