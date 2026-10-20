import { Link } from "react-router-dom";
import { PlusCircle, List, LayoutList, LayoutDashboard } from "lucide-react";

interface SidebarProps {
    sidebarOpen: boolean;
    activeMenu: string;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
    onLogout?: () => void;
}

export default function AdminSideBar(
    {
        sidebarOpen,
        activeMenu,
        setSidebarOpen,
        setActiveMenu,
        onLogout,
    }: SidebarProps
) {
    return (
        <aside className="w-25 bg-gray-200 text-white transition-all duration-300 flex flex-col rounded-lg">
            <nav className="flex-1 px-2 space-y-2 text-black">
                <button
                    onClick={() => setActiveMenu("Overview")}
                    className={`flex items-center gap-2 p-1 rounded w-full mt-3 text-left ${activeMenu === "Overview" ? "bg-blue-400" : "hover:bg-blue-700"
                        }`}
                >
                    {sidebarOpen && <span>Overview</span>}
                </button>
                <button
                    onClick={() => setActiveMenu("category management")}
                    className={`flex items-center gap-2 p-1 rounded w-full mt-3 text-left ${activeMenu === "category management" ? "bg-blue-400" : "hover:bg-blue-700"
                        }`}
                >
                    {sidebarOpen && <span>Categories</span>}
                </button>
                <button
                    onClick={() => setActiveMenu("products")}
                    className={`flex items-center gap-2 p-1 rounded w-full mt-3 text-left ${activeMenu === "products" ? "bg-blue-400" : "hover:bg-blue-700"
                        }`}
                >
                    {sidebarOpen && <span>Products</span>}
                </button>
                 <button
                    onClick={() => setActiveMenu("user management")}
                    className={`flex items-center gap-2 p-1 rounded w-full mt-3 text-left ${activeMenu === "user management" ? "bg-blue-400" : "hover:bg-blue-700"
                        }`}
                >
                    {sidebarOpen && <span>Users</span>}
                </button>
            </nav>

        </aside>
    )
}