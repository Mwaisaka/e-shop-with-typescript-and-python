import { useState, useEffect, memo } from "react";
import { useLocation, Link } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import { fetchGroupedProducts, searchProducts } from "../api/products";
import { useSearchQuery } from "../hooks/useSearchQuery";

function HomeProductsPage() {
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
    transition-colors duration-200 ease-in-out rounded-lg"
    >
    <div id="products-section" className="scroll-mt-24">
        {groupedProducts.map((category) => (
          <div
            key={category.slug}
            className="
                        p-4 mt-6 rounded-xl shadow-xl
                        bg-gray-100 dark:bg-gray-800
                        transition-colors duration-200 ease-in-out
                        "
          >
            <div
              className="flex items-center justify-between mb-4 p-2 px-4 bg-blue-100 rounded-xl shadow-xl dark:bg-gray-700
                             transition-colors duration-200 ease-in-out"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                Best Buy | {category.name}
              </h2>

              <Link
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="px-4 py-2 rounded-full
                                            bg-white dark:bg-gray-800
                                            text-gray-900 dark:text-white
                                            border border-gray-300 dark:border-gray-600
                                            text-sm font-semibold
                                            hover:bg-gray-200 dark:hover:bg-gray-600
                                            transition-colors duration-200"
              >
                View More →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {category.products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default memo(HomeProductsPage);
