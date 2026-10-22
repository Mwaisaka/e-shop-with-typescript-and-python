import { useEffect, useState, useCallback } from "react";
import {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
} from "../../api/users";
import { User, UserPayload } from "../../api/users";

interface UserForm {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_staff: boolean;
}

const emptyForm: UserForm = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    is_staff: false,
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [form, setForm] = useState<UserForm>(emptyForm);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);

    const [isAdmin, setIsAdmin] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    //Check logged in user's admin status
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const currentUser = JSON.parse(storedUser);
                setIsAdmin(currentUser.is_staff === true || currentUser.is_superuser === true);
            }

        } catch (err) {
            console.error("Unable to read stored user:", err)
        } finally {
            setAuthChecked(true);
        }
    }, []);


    //Fetch all Users
    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetchUsers();
            setUsers(response.data);
        } catch (err: any) {
            console.error("Error fetching users:", error);
            setError(err.response?.data?.detail || "Failed to load users. Check your login and admin permissions.");
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        if (authChecked && isAdmin) {
            void loadUsers();
        }
    }, [authChecked, isAdmin, loadUsers]);

    //Update an individual form field
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) : void=> {
        const { name, value, type, checked } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    //Clear form and editing state
    const resetFrom = () => {
        setForm(emptyForm);
        setEditingUserId(null);
        setError("");
        setSuccess("");
    };

    //Add a new user or update an existing user
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) : Promise<void>=> {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!form.username.trim() || !form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) {
            setError("Please fill in all required fields.");
            return;
        }

        if (!editingUserId && !form.password) {
            setError("Please enter a password for the new user.");
            return;
        }

        if (form.password && form.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        const payload: UserPayload = {
            username: form.username.trim(),
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            email: form.email.trim(),
            is_staff: form.is_staff,
        };

        // Only send a password when creating a user or changing it.
        if (form.password) {
            payload.password = form.password;
        }

        try {
            setSaving(true);
            if (editingUserId !== null) {
                await updateUser(editingUserId, payload);
                setSuccess("User updated successfully.");
            } else {
                await createUser(payload);
                setSuccess("User created successfully.");
            }

            setForm(emptyForm);
            setEditingUserId(null);

            await loadUsers();
        } catch (err: any) {
            console.error("Error saving user:", err);

            const data = err.response?.data;

            if (data && typeof data === "object") {
                const messages = Object.entries(data)
                    .map(([field, value]) => {
                        const message = Array.isArray(value)
                            ? value.join(" ")
                            : String(value);

                        return `${field}: ${message}`;
                    })
                    .join(" ");

                setError(messages || "Failed to save user.");
            } else {
                setError("Failed to save user. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    //Populate the form for editing
    const handleEdit = (user: User) => {
        setEditingUserId(user.id);

        setForm({
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: "",
            is_staff: user.is_staff,
        });
        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    //Delete a user
    const handleDelete = async (user: User) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${user.username}"? This action cannot be undone.`);

        if (!confirmed) return;

        setError("");
        setSuccess("");
        setDeletingUserId(user.id);

        try {
            await deleteUser(user.id);

            setUsers((previous) => previous.filter((item) => item.id !== user.id));

            if (editingUserId === user.id) {
                setForm(emptyForm);
                setEditingUserId(null);
            }
            setSuccess(`User "${user.username}" deleted successfully.`);
        } catch (err: any) {
            console.error("Error deleting user:", err);

            setError(
                err.response?.data?.detail ||
                err.response?.data?.error ||
                "Failed to delete user."
            );
        } finally {
            setDeletingUserId(null);
        }
    };

    if (!authChecked) {
        return (
            <div className="py-16 text-center text-gray-600">
                Checking permissions...
            </div>
        );
    }

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
                        Only administrators can view and manage users.
                    </p>
                </div>
            </div>
        )
    }

    //ADMIN VIEW
    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Page Header */}
                <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
                    {/* <h1 className="text-3xl font-bold text-gray-800 text-center">
                        Category Management
                    </h1> */}
                    <p className="mt-2 text-gray-600 text-md">
                        View, add, edit and remove registered users.
                    </p>

                    <p className="mt-3 text-sm font-medium text-gray-500">
                        Total users : {users.length}
                    </p>
                </div>
                {/* Success Message */}
                {success && (
                    <div
                        role="status"
                        className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700"
                    >
                        {success}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700"
                    >
                        {error}
                    </div>
                )}

                {/* ADD/EDIT USER FORM */}
                <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
                    <h2 className="mb-6 text-xl font-semibold text-gray-800">
                        {editingUserId != null ? "Edit User" : "Add New User"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Username *
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    autoComplete="username"
                                    placeholder="Enter username"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Email address *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    placeholder="Enter email address"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="first_name"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    First name *
                                </label>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="given-name"
                                    placeholder="Enter first name"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Last name *
                                </label>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="family-name"
                                    placeholder="Enter last name"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Password{" "}
                                    {editingUserId === null ? "*" : "(optional)"}
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required={editingUserId === null}
                                    minLength={8}
                                    autoComplete="new-password"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder={editingUserId === null ? "Create a password (minimum 8 characters)" : "Leave blank to keep the current password"}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4">
                                    <input
                                        type="checkbox"
                                        name="is_staff"
                                        checked={form.is_staff}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>
                                        <span className="block font-medium text-gray-800">
                                            Administrator access
                                        </span>

                                        <span className="block text-sm text-gray-500">
                                            Allows this user to access admin-protected endpoints.
                                        </span>
                                    </span>
                                </label>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : editingUserId !== null ? "Update User" : "Add User"}
                                </button>
                                {editingUserId !== null && (
                                    <button
                                        type="button"
                                        onClick={resetFrom}
                                        disabled={saving}
                                        className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>

                        </div>
                    </form>
                </div>

                {/* USER LIST */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-5">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Registered Users
                        </h2>
                        <button
                            type="button"
                            onClick={() => void loadUsers()}
                            disabled={loading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            {loading ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>
                    {loading ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            Loading users...
                        </div>
                    ) : users.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            No users found.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {users.map((user, index) => (
                                <div key={user.id}
                                    className="flex flex-col gap-4 px-6 py-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex min-w-0 items-start gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="break-words font-semibold text-gray-800">
                                                {user.first_name} {user.last_name}
                                            </h3>
                                            <p className="break-all text-sm text-gray-600">
                                                @{user.username}
                                            </p>
                                            <p className="break-all text-sm text-gray-500">
                                                {user.email || "No email provided"}
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${user.is_staff
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-gray-100 text-gray-600"
                                                    }`}>
                                                    {user.is_staff
                                                        ? "Administrator"
                                                        : "Regular User"}
                                                </span>
                                                {user.is_superuser && (
                                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                                                        Superuser
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(user)}
                                            className="rounded-lg bg-blue-100 px-4 py-2 font-medium text-blue-700 transition hover:bg-blue-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => void handleDelete(user)}
                                            disabled={
                                                deletingUserId === user.id ||
                                                user.is_superuser
                                            }
                                            title={
                                                user.is_superuser
                                                    ? "Superuser accounts cannot be deleted here"
                                                    : "Delete user"
                                            }
                                            className="rounded-lg bg-red-100 px-4 py-2 font-medium text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {deletingUserId === user.id
                                                ? "Deleting..."
                                                : "Delete"}
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