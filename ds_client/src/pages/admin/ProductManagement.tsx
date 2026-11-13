import React, { useCallback, useEffect, useState } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    Package,
    RefreshCw,
    Image as ImageIcon,
    Star,
} from "lucide-react";
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../../api/products";
import { fetchCategories } from "../../api/categories";

interface Product {
    id: number;
    category: string;
    category_id?: number;
    name: string;
    description: string;
    price: string | number;
    formatted_price?: string;
    stock: number;
    image: string | null;
    avg_rating?: number;
    review_count?: number;
}

interface Category {
    id: number;
    name: string;
    slug?: string;
}

interface ProductForm {
    name: string;
    category_id: string;
    description: string;
    price: string;
    stock: string;
    image: File | null;
}

const initialForm: ProductForm = {
    name: "",
    category_id: "",
    description: "",
    price: "",
    stock: "",
    image: null,
};

export default function ProductManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [form, setForm] = useState<ProductForm>(initialForm);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const pageSize = 8;

    //Load products
    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const params: Record<string, string | number> = {
                page: currentPage,
            }

            if (search.trim()) {
                params.q = search.trim();
            }

            if (categoryFilter) {
                params.category = categoryFilter;
            }

            const response = await fetchProducts(params);

            // Supports DRF paginated response.
            setProducts(response.data.results ?? response.data);
            setTotalProducts(
                response.data.count ?? response.data.length ?? 0
            );

        } catch (err: any) {
            console.error("Error in loading products:", err);
            setError(
                err.response?.data?.detail ||
                "Unable to load products. Please try again."
            )
        } finally {
            setLoading(false);
        }
    }, [currentPage, search, categoryFilter]);

    //Load categories
    const loadCategories = async () => {
        try {
            const response = await fetchCategories();

            setCategories(response.data.results ?? response.data);
        } catch (err) {
            console.error("Error loading categories:", err);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    useEffect(() => {
        loadCategories();
    }, []);

    //Handle Input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //Handle Image Selection
    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setForm((prev) => ({
            ...prev,
            image: file,
        }));
        setImagePreview(URL.createObjectURL(file));
    };

    //Open Create Form
    const openCreateForm = () => {
        setEditingProduct(null);
        setForm(initialForm);
        setImagePreview(null);
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    //Open Edit Form
    const openEditForm = (product: Product) => {
        setEditingProduct(product);

        setForm({
            name: product.name,
            category_id: String(product.category_id ?? ""),
            description: product.description,
            price: String(product.price),
            stock: String(product.stock),
            image: null,
        });

        setImagePreview(product.image);
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    //Close Form
    const closeForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setForm(initialForm);
        setImagePreview(null);
        setError("");
    };

    //Submit Product
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!form.name.trim()) {
            setError("Please enter the product name.");
            return;
        }

        if (!form.category_id) {
            setError("Please select a product category.");
            return;
        }

        if (!form.description.trim()) {
            setError("Please enter the product description.");
            return;
        }

        if (Number(form.price) <= 0 || !Number.isFinite(Number(form.price))) {
            setError("Please enter a valid product price.");
            return;
        }

        if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
            setError("Stock must be a whole number of zero or more.");
            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();

            formData.append("name", form.name.trim());
            formData.append("category_id", form.category_id);
            formData.append("description", form.description.trim());
            formData.append("price", form.price);
            formData.append("stock", form.stock);

            if (form.image) {
                formData.append("image", form.image);
            }

            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
                setSuccess("Product updated successfully.");
            } else {
                await createProduct(formData);
                setSuccess("")
            }

            closeForm();

            //Return to the first page after creating a product
            if (!editingProduct && currentPage !== 1) {
                setCurrentPage(1);
            } else {
                await loadProducts();
            }
        } catch (err: any) {
            console.error("Error in saving product", err);

            const data = err.response?.data;

            if (data && typeof data === "object") {
                const messages = Object.entries(data)
                    .map(([field, value]) => {
                        const message = Array.isArray(value)
                            ? value.join(", ")
                            : String(value);

                        return `${field}: ${message}`;
                    })
                    .join(" | ");

                setError(messages || "Unable to save product.");
            } else {
                setError("Unable to save product. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    //Delete product
    const handleDelete = async (product: Product) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${product.name}"?`);

        if (!confirmDelete) return;

        try {
            setError("");
            setSuccess("");

            await deleteProduct(product.id);

            setSuccess("Product deleted successfully.");

            if (products.length === 1 && currentPage > 1) {
                setCurrentPage((prev) => prev - 1);
            } else {
                await loadProducts();
            }
        } catch (err: any) {
            console.error("Error deleting product:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to delete product. Please try again."
            );
        }
    };

    const totalPages = Math.ceil(totalProducts / pageSize);

    return (
        <div className="min-h-screen bg-gray-100 p-4 m-3 md:p-6 rounded-lg">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="mt-1 text-gray-600 dark:text-white text-md bg-white dark:bg-gray-800 px-8 py-3 rounded-lg shadow-sm">
                            Add, view, update and manage your store products.
                        </p>
                    </div>
                    <button
                        onClick={openCreateForm}
                        className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 dark:bg-gray-800 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 dark:hover:bg-gray-500"
                    >
                        <Plus size={20} />
                        Add Product
                    </button>
                </div>

                {/* Notifications */}
                {error && !showForm && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                {/* Summary */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 p-5 shadow-sm text-gray-600 dark:text-white text-md bg-white dark:bg-gray-800">
                        <div className="flex items-center justify-between ">
                            <div>
                                <p className="text-md">Total Products</p>
                                <h2 className="mt-2 text-2xl font-bold">{totalProducts}</h2>
                            </div>
                            <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                                <Package size={25} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 p-5 shadow-sm text-gray-600 dark:text-white text-md bg-white dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-md">Products on This Page</p>
                                <h2 className="mt-2 text-2xl font-bold">{products.length}</h2>
                            </div>
                            <div className="rounded-lg bg-green-50 p-3 text-green-600">
                                <Package size={25} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-200 p-4 shadow-sm md:flex-row text-gray-600 dark:text-white text-md bg-white dark:bg-gray-800">
                    <div className="relative flex-1">
                        <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:bg-gray-700"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500  bg-white dark:bg-gray-800"
                    >
                        <option value="">All Categories</option>

                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={loadProducts}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 hover:bg-gray-50"
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>
                </div>

                {/* Products Table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:text-white bg-white dark:bg-gray-800">
                    <div className="border-b border-gray-200 px-5 py-4">
                        <h2 className="font-semibold">
                            Store Products
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
                            <RefreshCw className="animate-spin" size={22} />
                            Loading products...
                        </div>
                    ) : products.length === 0 ? (
                        <div className="py-16 text-center">
                            <Package
                                size={45}
                                className="mx-auto mb-3 text-gray-300"
                            />

                            <h3 className="font-semibold text-gray-700">
                                No products found
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Add a new product or change your search filters.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto text-left text-xs sm:text-sm">
                                    <thead className="bg-gray-50  dark:bg-gray-800 text-xs uppercase text-gray-500  dark:text-white underline">
                                        <tr>
                                            <th className="px-2 py-3 sm:px-3 sm:py-4 lg:px-5">Product</th>
                                            <th className="px-2 py-3 sm:px-3 sm:py-4 lg:px-5">Category</th>
                                            <th className="px-2 py-3 sm:px-3 sm:py-4 lg:px-5">Price</th>
                                            <th className="px-2 py-3 sm:px-3 sm:py-4 lg:px-5">Stock</th>
                                            <th className="px-2 py-3 sm:px-3 sm:py-4 lg:px-5">Rating</th>
                                            <th className="px-2 py-3 sm:px-3 sm:py-4 lg:px-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.map((product) => (
                                            <tr
                                                key={product.id}
                                                className="transition hover:bg-gray-50 dark:hover:bg-gray-500"
                                            >
                                                {/* Product image and name */}
                                                <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-5">
                                                    <div className="flex items-center gap-3">
                                                        {product.image ? (
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-lg border border-gray-200 object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100  dark:bg-gray-800 text-gray-400  dark:text-white">
                                                                <ImageIcon size={22} />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-semibold text-gray-900  dark:text-white">
                                                                {product.name}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500  dark:text-white">
                                                                Product #{product.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-5 text-gray-600  dark:text-white">
                                                    {product.category}
                                                </td>
                                                <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-5 font-medium text-gray-900  dark:text-white">
                                                    Kes {Number(product.price).toLocaleString("en-KE", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </td>
                                                <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-5">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-medium ${product.stock === 0
                                                            ? "bg-red-100 text-red-700"
                                                            : product.stock <= 5
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-green-100 text-green-700"
                                                            }`}
                                                    >
                                                        {product.stock === 0
                                                            ? "Out of stock"
                                                            : `${product.stock} available`}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-5">
                                                    <div className="flex items-center gap-1 text-gray-700  dark:text-white">
                                                        <Star
                                                            size={15}
                                                            className="fill-yellow-400 text-yellow-400"
                                                        />
                                                        <span>
                                                            {Number(product.avg_rating ?? 0).toFixed(1)}
                                                        </span>
                                                        <span className="text-xs text-gray-400  dark:text-white">
                                                            ({product.review_count ?? 0})
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-2 py-3 sm:px-3 sm:py-4 lg:px-5">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditForm(product)}
                                                            title="Edit product"
                                                            className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition hover:bg-indigo-100"
                                                        >
                                                            <Pencil size={17} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product)}
                                                            title="Delete product"
                                                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                                                        >
                                                            <Trash2 size={17} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-gray-500  dark:text-white">
                                    Showing {totalProducts === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                                    {" "}to{" "}
                                    {Math.min(currentPage * pageSize, totalProducts)}
                                    {" "}of {totalProducts} products
                                </p>
                                <div className="flex items-center gap-2 ">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((prev) => prev - 1)}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-2 text-sm text-gray-600  dark:text-white">
                                        Page {currentPage} of {Math.max(totalPages, 1)}
                                    </span>
                                    <button
                                        disabled={currentPage >= totalPages}
                                        onClick={() => setCurrentPage((prev) => prev + 1)}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* Add/Edit Product Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
                    <div className="my-4 w-full max-w-2xl rounded-2xl bg-white  dark:bg-gray-800 shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900  dark:text-white">
                                    {editingProduct ? "Edit Product" : "Add New Product"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500  dark:text-white">
                                    Enter the product details below.
                                </p>
                            </div>
                            <button
                                onClick={closeForm}
                                className="rounded-lg p-2 text-gray-500  dark:text-white hover:bg-gray-400"
                            >
                                <X size={22} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5 p-6">
                                {error && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                {/* Product Name */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700  dark:text-white">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100  dark:text-white dark:bg-gray-700"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700  dark:text-white">
                                        Category *
                                    </label>
                                    <select
                                        name="category_id"
                                        value={form.category_id}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100  bg-white dark:bg-gray-700"
                                    >
                                        <option value="">Select Category</option>

                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Enter product description"
                                        required
                                        className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:bg-gray-700"
                                    />
                                </div>

                                {/* Price and stock */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                                            Price (Kes) *
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={form.price}
                                            onChange={handleChange}
                                            min="0.01"
                                            step="0.01"
                                            placeholder="0.00"
                                            required
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:bg-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                                            Stock Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={form.stock}
                                            onChange={handleChange}
                                            min="0"
                                            step="1"
                                            placeholder="0"
                                            required
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:bg-gray-700"
                                        />
                                    </div>
                                </div>

                                {/* Image upload */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                                        Product Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full rounded-lg border border-gray-300 p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <p className="mb-2 text-xs text-gray-500 dark:text-white">
                                                Image preview
                                            </p>
                                            <img
                                                src={imagePreview}
                                                alt="Product preview"
                                                className="h-36 w-36 rounded-lg border border-gray-200 object-cover"
                                            />
                                        </div>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500 dark:text-white">
                                        Leave the image unchanged when editing if you do not want to replace it.
                                    </p>
                                </div>
                            </div>

                            {/* Modal actions */}
                            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-600 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-indigo-600 dark:bg-gray-800 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving && (
                                        <RefreshCw size={17} className="animate-spin" />
                                    )}
                                    {saving
                                        ? "Saving..."
                                        : editingProduct
                                            ? "Update Product"
                                            : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};