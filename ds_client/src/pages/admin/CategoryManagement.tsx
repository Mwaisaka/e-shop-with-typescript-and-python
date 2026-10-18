import { useEffect, useState } from "react";
import { fetchCategory, fetchCategories, createCategory, deleteCategory, updateCategory } from "../../api/categories";

interface Category {
    id: number;
    name: string;
    slug?: string;
}

interface User {
    username: string;
    is_staff?: boolean;
    is_superuser?: boolean;
}
export default function CategoryManagement() {
    const [category, setCategory] = useState<Category[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryName, setCategoryName] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [user, setUser] = useState<User | null>(null);

    //Get Current User
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Unable to parse stored user:", error)
            }
        }
    }, []);

    //Check if user is admin
    const isAdmin = user?.is_staff === true || user?.is_superuser === true;

    //Fetch Categories
    const categoriesFetch = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetchCategories();
            setCategories(response.data);
            console.log("Categories = >", response.data)
        } catch (error: any) {
            console.error("Error fetching categories:", error);
            setError(error.response?.data?.detail || "Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        categoriesFetch();
    }, []);

    //Add a category
    const handleAddCategory = async () => {
        if (!categoryName.trim()) {
            setError("Please enter a category name");
            return;
        }
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await createCategory(categoryName.trim());

            setCategoryName("");
            setSuccess("Category added successfully.")

            await categoriesFetch();
        } catch (error: any) {
            console.error("Error adding category:", error);
            setError(error.response?.data?.detail || error.response?.data?.name?.[0] || "Failed to add category.");
        } finally {
            setSaving(false);
        }
    }

    //Start Editing 
    const handleEdit = (category: Category) => {
        setEditingCategoryId(category.id);
        setCategoryName(category.name);

        setError("");
        setSuccess("");
    };

    //Cancel Editing
    const handleCancelEdit = () => {
        setEditingCategoryId(null);
        setCategoryName("");

        setError("");
        setSuccess("");
    }

    //Update category
    const handleUpdateCategory = async () => {
        if (!editingCategoryId) {
            return;
        }
        if (!categoryName.trim()) {
            setError("Please enter a category name");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await updateCategory(editingCategoryId, categoryName.trim());

            setEditingCategoryId(null);
            setCategoryName("");
            setSuccess("Category updated successfully.");

            await categoriesFetch();
        } catch (error: any) {
            console.error("Error in updating category:", error);
            setError(error.response?.data?.detail || error.response?.data?.name?.[0] || "Failed to update category.")
        } finally {
            setSaving(false);
        }
    };

    //Delete Category
    const handleDelete = async (category: Category) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${category.name}"?`);

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await deleteCategory(category.id);

            setSuccess("Category deleted successfully.");

            await categoriesFetch();
        } catch (error: any) {
            console.error("Error in deleting catagory:", error);

            setError(error.response?.data?.detail || error.response?.data?.error || "Failed to delete catagory.")
        } finally {

        }
    };

    //NON-ADMIM VIEW 
    if (!isAdmin) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
                    <div className="mb-4 text-5xl">
                        🔒
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">
                        Access Denied
                    </h2>
                    <p className="text-gray-600">
                        You do not have permission to manage categories. Only administrators can add, edit, or delete categories.
                    </p>
                </div>
            </div>
        )
    }

    //ADMIN VIEW
    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Category Management
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Add, edit and remove product categories.
                    </p>
                </div>
                {/* Success Message */}
                {success && (
                    <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                        {success}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        {error}
                    </div>
                )}

                {/* ADD/EDIT FORM */}
                <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
                    <h2 className="mb-5 text-xl font-semibold text-gray-800">
                        {editingCategoryId ? "Edit Category" : "Add New Category"}
                    </h2>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="Enter category name"
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                        {editingCategoryId ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleUpdateCategory}
                                    disabled={saving}
                                    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving ? "Updating..." : "Update Category"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white transition hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                disabled={saving}
                                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? "Adding..." : "Add Category"}
                            </button>
                        )}
                    </div>
                </div>
                {/* CATEGORY LIST */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                    <div className="border-b border-gray-200 px-6 py-5">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Categories
                        </h2>
                    </div>
                    {loading ? (
                        <div className="px-6 py-10 text-center text-gray-500">
                            Loading categories...
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="px-6 py-10 text-center text-gray-500">
                            No categories found
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {categories.map((category, index) => (
                                <div
                                    key={category.id}
                                    className="flex flex-col gap-4 px-6 py-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                                            {index + 1}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {category.name}
                                            </h3>

                                            {category.slug && (
                                                <p className="text-sm text-gray-500">
                                                    /{category.slug}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(category)}
                                            className="rounded-lg bg-blue-100 px-4 py-2 font-medium text-blue-700 transition hover:bg-blue-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(category)}
                                            className="rounded-lg bg-red-100 px-4 py-2 font-medium text-red-700 transition hover:bg-red-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

}