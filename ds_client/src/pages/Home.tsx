import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import { fetchGroupedProducts, searchProducts } from "../api/products";
import { useSearchQuery } from "../hooks/useSearchQuery";
import CategorySlider from "../components/home/CategorySlider";
import HeroBanner from "../components/home/HeroBanner";
import HomeProductsPage from "./HomeProductsPage";

export default function Home() {
  const { q, category, max_price, rating, page, setQuery } = useSearchQuery();
  // const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();

  const [groupedProducts, setGroupedProducts] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchGroupedProducts();
      setGroupedProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, [location, loading]);
  if (loading) return <p>Loading...</p>;

  return (
    <div
      className="scroll-mt-24 min-h-screen
    bg-white dark:bg-gray-950
    text-gray-900 dark:text-white
    transition-colors duration-200 ease-in-out rounded-xl"
    >
      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Slider */}
      <CategorySlider />

      {/* Products page */}
      <HomeProductsPage />
    </div>
  );
}
