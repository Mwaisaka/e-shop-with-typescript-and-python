import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import FiltersSidebar, { FilterState } from "./components/filters/FiltersSidebar";
import { Product } from "./types/product";
import { fetchProducts } from "./api/products";
import { useEffect, useState } from "react";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    fetchProducts()
      .then((res) => {
        setProducts(res.data);
        setFiltered(res.data); // initial view
      })
      .catch(() => {
        setProducts([]);
        setFiltered([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Extract categories dynamically
  const categories = [...new Set(products.map((p) => p.category))];

  // Apply filters
  const handleFilters = (filters: FilterState) => {
    setFiltered(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          (!filters.category || p.category === filters.category) &&
          Number(p.price) >= Number(filters.minPrice) &&
          Number(p.price) <= filters.maxPrice &&
          p.rating >= filters.rating
      )
    );
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors">
            <Navbar />
            <div className="flex max-w-7xl mx-auto">
              <FiltersSidebar
                categories={categories}
                onFilterChange={handleFilters}
              />
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
