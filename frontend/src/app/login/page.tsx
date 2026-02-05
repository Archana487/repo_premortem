"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Github, ArrowRight, ArrowLeft, Mail, UserPlus, HelpCircle } from "lucide-react";

type ViewState = "login" | "signup" | "forgot_password";

export default function LoginPage() {
    const router = useRouter();
    const [view, setView] = useState<ViewState>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const simulateNetworkValues = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await simulateNetworkValues();

        // 1. Check Hardcoded Mock User
        const MOCK_USER = {
            email: "user@example.com",
            password: "password123"
        };

        // 2. Check "Signed Up" User (from localStorage)
        const storedUserEmail = localStorage.getItem("signup_email");
        const storedUserPass = localStorage.getItem("signup_password");

        const isValidHardcoded = email === MOCK_USER.email && password === MOCK_USER.password;
        const isValidStored = storedUserEmail && storedUserPass && email === storedUserEmail && password === storedUserPass;

        if (isValidHardcoded || isValidStored) {
            localStorage.setItem("isAuthenticated", "true");
            router.push("/");
        } else {
            setError("Invalid email or password. Did you sign up?");
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        await simulateNetworkValues();

        if (email && password) {
            // Store credentials locally so the user can log in later
            localStorage.setItem("signup_email", email);
            localStorage.setItem("signup_password", password);
            localStorage.setItem("isAuthenticated", "true");

            router.push("/");
        } else {
            setError("Please fill out all fields.");
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        await simulateNetworkValues();

        if (email) {
            setSuccessMessage("If an account exists, a reset link has been sent.");
            setLoading(false);
        } else {
            setError("Please enter your email address.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="mx-auto h-16 w-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 shadow-xl mb-6">
                        <span className="text-3xl">💀</span>
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
                        RepoPremortem AI
                    </h1>
                    <p className="text-zinc-500">
                        {view === "login" && "Sign in to predict your system's inevitable failure."}
                        {view === "signup" && "Join the proactive reliability revolution."}
                        {view === "forgot_password" && "Recover access to your account."}
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-xl shadow-2xl transition-all">

                    {error && (
                        <div className="mb-6 p-3 bg-red-950/30 border border-red-900/50 rounded-md text-red-400 text-sm flex items-center gap-2 animate-in fade-in">
                            <Lock className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-md text-emerald-400 text-sm flex items-center gap-2 animate-in fade-in">
                            <Mail className="h-4 w-4" />
                            {successMessage}
                        </div>
                    )}

                    {/* LOGIN VIEW */}
                    {view === "login" && (
                        <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-zinc-600"
                                    placeholder="sre@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-zinc-300">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => { setView("forgot_password"); setError(null); setSuccessMessage(null); }}
                                        className="text-xs text-red-500 hover:text-red-400 transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                            </button>
                        </form>
                    )}

                    {/* SIGNUP VIEW */}
                    {view === "signup" && (
                        <form onSubmit={handleSignup} className="space-y-6 animate-in fade-in">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-zinc-600"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-zinc-600"
                                    placeholder="sre@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    placeholder="Create a strong password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create Account <UserPlus className="h-4 w-4" /></>}
                            </button>
                        </form>
                    )}

                    {/* FORGOT PASSWORD VIEW */}
                    {view === "forgot_password" && (
                        <form onSubmit={handleForgotPassword} className="space-y-6 animate-in fade-in">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-zinc-600"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2.5 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send Reset Link <Mail className="h-4 w-4" /></>}
                            </button>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => { setView("login"); setError(null); setSuccessMessage(null); }}
                                className="w-full text-zinc-400 hover:text-zinc-200 text-sm flex items-center justify-center gap-1 transition-colors"
                            >
                                <ArrowLeft className="h-3 w-3" /> Back to Login
                            </button>
                        </form>
                    )}

                    {/* Footer / Switcher */}
                    <div className="mt-6 flex items-center gap-4">
                        <div className="h-px bg-zinc-800 flex-1" />
                        <span className="text-xs text-zinc-500 uppercase">Or continue with</span>
                        <div className="h-px bg-zinc-800 flex-1" />
                    </div>

                    {view !== "forgot_password" && (
                        <button
                            type="button"
                            onClick={() => { }} // Mock GitHub Auth
                            className="mt-6 w-full bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 font-medium py-2.5 rounded-md transition-all flex items-center justify-center gap-2"
                        >
                            <Github className="h-5 w-5" />
                            GitHub
                        </button>
                    )}
                </div>

                {/* Bottom Link Swapper */}
                <p className="text-center text-sm text-zinc-500">
                    {view === "login" && (
                        <>
                            Don't have an account?{" "}
                            <button onClick={() => { setView("signup"); setError(null); }} className="text-red-500 hover:text-red-400 font-medium transition-colors">
                                Sign up
                            </button>
                        </>
                    )}
                    {view === "signup" && (
                        <>
                            Already have an account?{" "}
                            <button onClick={() => { setView("login"); setError(null); }} className="text-red-500 hover:text-red-400 font-medium transition-colors">
                                Sign in
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
