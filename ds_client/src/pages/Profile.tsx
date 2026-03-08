import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Eye, EyeOff } from "lucide-react";

export default function Profile() {
    const { user, changePassword } = useAuth();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword != confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await changePassword(oldPassword, newPassword);

            setMessage("Password updated successfully.");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setError(
                err.response?.data?.detail || "Failed to update password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">
                    My Profile
                </h2>
                {/* User info */}
                <div className="space-y-3 mb-8" >
                    <p><strong>Username : </strong>{user?.username}</p>
                    <p><strong>Email : </strong>{user?.email}</p>
                    <p><strong>Name: </strong>{user?.first_name} {user?.last_name}</p>
                </div>

                {/* Change password */}
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>

                {message && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Current Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-500"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        {loading ? "Updating..." : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}