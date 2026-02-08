"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardMock from "@/components/Dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, Loader2, Search, LogOut } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [repoUrl, setRepoUrl] = useState("https://github.com/fastapi/fastapi");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticated = localStorage.getItem("isAuthenticated");
    if (!authenticated) {
      router.push("/login");
    } else {
      setIsAuth(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Note: We use the full URL for localhost. In production, this would be an env var.
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/analyze?repo_url=${encodeURIComponent(repoUrl)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to analyze repository. The backed might be down or busy.");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuth) {
    return null; // Or a loading spinner
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Search Bar / Input Section */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto p-4 flex gap-4 items-center">
          <form onSubmit={handleAnalyze} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="url"
                required
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-zinc-600"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Analyzing..." : "Run Pre-Mortem"}
            </button>
          </form>

          <button
            onClick={handleLogout}
            className="text-zinc-400 hover:text-zinc-200 transition-colors p-2 rounded-md hover:bg-zinc-800/50"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {!loading && !data && !error && (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
              <span className="text-3xl">💀</span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-100">RepoPremortem AI</h1>
            <p className="text-zinc-400 max-w-md">
              Paste a GitHub repository URL above to let Gemini 3 predict its inevitable failure in production.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center p-20 space-y-6">
            <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-zinc-200">Analyzing Architecture...</h3>
              <p className="text-zinc-500 text-sm">Parsing file tree • Identification of load-bearing files • Simulating 10x scale</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-8 max-w-3xl mx-auto">
            <div className="bg-red-950/30 border border-red-900 rounded-lg p-6 flex items-start gap-4 text-red-400">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Analysis Failed</h3>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {data && <DashboardMock data={data} />}
      </div>
    </main>
  );
}
