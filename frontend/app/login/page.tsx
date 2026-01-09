"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3F8F1] px-4">

            {/* Card */}
            <div className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-8">

                {/* Title */}
                <h1 className="text-3xl font-bold text-center text-[#4A5D45] mb-6">
                    Welcome Back
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Login to continue your journey
                </p>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#A8C3A0]"
                        placeholder="you@example.com"
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#A8C3A0]"
                        placeholder="••••••••"
                    />
                </div>

                {/* Login Button */}
                <Link href="/dashboard">
                <button
                    type="button"
                    className="w-full bg-[#A8C3A0] hover:bg-[#9BB896] text-white py-3 rounded-lg font-semibold transition"
                >
                    Login
                </button>
                </Link>


                {/* Register Link */}
                <p className="mt-6 text-center text-gray-700">
                    Don’t have an account?{" "}
                    <Link href="/register" className="text-[#7AA883] font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
