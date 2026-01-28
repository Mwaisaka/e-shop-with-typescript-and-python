import { useState } from "react";

interface FiltersProps {
    categories: string[],
    onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
    search: string;
    category: string;
    minPrice: number;
    maxPrice: number;
    rating: number;
}

export default function FiltersSidebar({ categories, onFilterChange }: FiltersProps) {
    const [filters, setFilters] = useState<FilterState>(
        {
            search: "",
            category: "",
            minPrice: 0,
            maxPrice: 100000,
            rating: 0,
        }
    );

    const updateFilters = (updated: Partial<FilterState>) => {
        const newFilters = { ...filters, ...updated };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <aside className="w-full md:w-64 bg-white dark:bg-gray-900 p-4 border rounded-xl dark:border-gray-700 mt-4">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            {/* Search */}
            <input
                type="text"
                placeholder="Search products..."
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-800"
            />

            {/* Categories */}
            <select
                className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-800"
                onChange={(e) => updateFilters({ category: e.target.value })}
            >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))};
            </select>

            {/* Price */}
            <div className="mb-4">
                <label className="text-sm">Max Price</label>
                <input
                    type="range"
                    min={0}
                    max={100000}
                    className="w-full"
                    onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) })}
                />
            </div>

            {/* Rating */}
            <select
                className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                onChange={(e) => updateFilters({ rating: Number(e.target.value) })}
            >
                <option value={0}>All Ratings</option>
                <option value={5}>5★ & above</option>
                <option value={4}>4★ & above</option>
                <option value={3}>3★ & above</option>
                <option value={2}>2★ & above</option>
                <option value={1}>1★ & above</option>
            </select>
        </aside>
    );

}