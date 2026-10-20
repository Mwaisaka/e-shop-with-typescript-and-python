import { useAuth } from "../../context/AuthContext";
import AdminSideBar from "./AdminSideBar";
import DashboardContent from "./DashboardContent";
import { useState } from "react";

export default function DashboardHome() {
    const { user, logout } = useAuth();
    const [activeMenu, setActiveMenu] = useState("Overview");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-auto bg-gray-100">
            <AdminSideBar
                sidebarOpen={sidebarOpen}
                activeMenu={activeMenu}
                setSidebarOpen={setSidebarOpen}
                setActiveMenu={setActiveMenu}
                onLogout={logout}
            />

            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow p-4 ml-2 flex justify-center items-center rounded-lg">
                    <h1 className="text-xl font-bold capitalize">{activeMenu}</h1>
                    {/* <p className="text-gray-600">
                        Welcome,{" "}
                        <span className="font-semibold">{user?.first_name || "User"}</span>
                    </p> */}
                </header>
                <DashboardContent
                    activeMenu={activeMenu}
                />
            </div>

        </div>

    )
}