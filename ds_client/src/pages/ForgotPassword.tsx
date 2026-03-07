import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            setLoading(true);

            const res = await api.post("/accounts/reset-password/", { email });
            setMessage(res.data.message);

        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Reset Password
                </h2>
                {message && (
                    <div className="mb-4 p-3 text-sm bg-green-100 text-green-700 rounded">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 text-sm bg-red-100 text-red-600 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        required
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded border bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm">
                    <Link to="/login/" className="text-indigo-600 hover:underline">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    )
}