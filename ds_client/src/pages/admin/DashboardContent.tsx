
import DashboardHome from "./DashboardHome";
import CategoryManagement from "./CategoryManagement";
import UserManagement from "./UserManagement";

interface DashboardContentProps {
  activeMenu: string;
}

export default function DashboardContent({
  activeMenu,
}: DashboardContentProps) {
  // Render based on activeMenu
  if (activeMenu === "category management")
    return <CategoryManagement  />;
   if (activeMenu === "user management")
    return <UserManagement  />;

  return null;
}