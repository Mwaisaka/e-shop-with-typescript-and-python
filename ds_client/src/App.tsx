import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import FiltersSidebar from "./components/filters/FiltersSidebar";
import {Toaster} from "react-hot-toast";

export default function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100 transition-colors">
            <Navbar />

            {/* Toast container */}
            <Toaster position="top-right" reverseOrder={false} />
            
            <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4">
              <FiltersSidebar/>
              <main className="flex-1 px-4 py-6">
                <AppRoutes />
              </main>
            </div>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
