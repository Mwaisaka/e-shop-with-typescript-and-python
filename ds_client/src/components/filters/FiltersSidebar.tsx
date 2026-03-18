import { useState, useEffect } from "react";
import { useSearchQuery } from "../../hooks/useSearchQuery";
import { fetchCategories } from "../../api/categories";

export default function FiltersSidebar() {
    const { q, category, max_price, rating, setQuery } = useSearchQuery();
    const [categories, setCategories] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchCategories()
            .then(res => setCategories(res.data))
            .catch(() => setCategories([]))
    }, [])

    return (
        <>
            {/* Moble Filter button*/}
            <div className="md:hidden sticky top-0 z-30  p-3 shadow mt-6 mb-6 bg-gray-200 dark:bg-gray-900 rounded-xl">
                <button
                    onClick={() => setIsOpen(true)}
                    className="md:hidden mb-4 px-4 py-2 rounded-xl text-top mt-4"
                > Filters</button>
            </div>

            <aside
                className={`
                            top-0 md:top-auto
                            fixed md:top-auto
                            inset-y-0 left-0 
                            z-40 w-64 
                            bg-gray-200 dark:bg-gray-900 
                            p-4 rounded-xl
                            transform transition-transform duration-300 mt-6 mb-6
                            ${isOpen ? "translate-x-0 mt-28 " : "-translate-x-full"}
                            
                            md:translate-x-0
                        `}
                        // md:relative md:translate-x-0 md:block md:w-64 
            >
                <div className=" flex justify-between items-center mb-4 md:hidden">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden text-gray-500 hover:text-black dark:hover:text-white"
                    >✕</button>
                </div>
                <h2 className="hidden md:block text-lg font-semibold mb-4">Filters</h2>
                {/* Search */}
                <div className="w-full mb-4 px-3 py-2 bg-gray-100 dark:bg-gray-300 rounded-xl">
                    <input
                        type="text"
                        value={q}
                        placeholder="Search products, categories ..."
                        onChange={(e) => setQuery("q", e.target.value)}
                        className=" bg-transparent outline-none w-full text-black"
                    />
                </div>

                {/* Categories */}
                <select
                    value={category}
                    className="w-full mb-4 px-3 py-2 bg-gray-100 dark:bg-gray-300 rounded-xl text-black"
                    onChange={(e) => setQuery("category", e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Price */}
                <div className="mb-4">
                    <label className="text-sm">Max Price : {max_price}</label>
                    <input
                        type="range"
                        min={0}
                        max={500000}
                        value={max_price}
                        className="w-full"
                        onChange={(e) => setQuery("max_price", Number(e.target.value))}
                    />
                </div>

                {/* Rating */}
                <select
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-300 rounded-xl text-black"
                    value={rating}
                    onChange={(e) => setQuery("rating", Number(e.target.value))}
                >
                    <option value={0}>All Ratings</option>
                    <option value={5}>5★ & above</option>
                    <option value={4}>4★ & above</option>
                    <option value={3}>3★ & above</option>
                    <option value={2}>2★ & above</option>
                    <option value={1}>1★ & above</option>
                </select>
            </aside>
        </>
    );

}