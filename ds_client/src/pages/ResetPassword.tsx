import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password != confirmPassword) {
            setError("Passwords do not match.")
            return;
        }

        try {
            setLoading(true);
            await api.post("/password-reset-confirm/", {
                uid,
                token,
                password,
            });
            navigate("/login/");
        } catch (err : any) {
            setError("Invalid or expired reset link");
        }finally{
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen flex justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Set New Password
                </h2>
                {error && (
                    <div className="mb-4 p-3 text-sm bg-red-100 text-red-600 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded border bg-gray-50 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded border bg-gray-50 dark:bg-gray-700 dark:text-white"
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
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    )
}