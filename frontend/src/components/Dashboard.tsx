import React from 'react';
import { AlertTriangle, TrendingDown, ShieldAlert, Activity, GitBranch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Types derived from our Pydantic schema
interface Risk {
    title: string;
    severity: number;
    location: string;
    failure_mechanism: string;
    fix_suggestion: string;
}

interface BeginnerExplanation {
    summary_analogy: string;
    risk_score: number;
    simple_risks: string[];
}

interface AnalysisData {
    survival_probability: number;
    scale_cliff: string;
    top_risks: Risk[];
    timeline: {
        short_term: string;
        medium_term: string;
        long_term: string;
    };
    beginner_explanation?: BeginnerExplanation;
}

const DashboardMock: React.FC<{ data: AnalysisData }> = ({ data }) => {
    const [mode, setMode] = React.useState<'expert' | 'beginner'>('expert');

    return (
        <div className="p-8 bg-zinc-950 min-h-screen text-zinc-100 font-sans">
            {/* Mode Toggle */}
            <div className="flex justify-end mb-8">
                <div className="bg-zinc-900 p-1 rounded-lg border border-zinc-800 flex gap-1">
                    <button
                        onClick={() => setMode('expert')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'expert'
                            ? 'bg-red-950 text-red-500 border border-red-900/50 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        Expert Mode
                    </button>
                    <button
                        onClick={() => setMode('beginner')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'beginner'
                            ? 'bg-emerald-950 text-emerald-500 border border-emerald-900/50 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        Beginner Mode
                    </button>
                </div>
            </div>

            {mode === 'beginner' && data.beginner_explanation ? (
                <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            Simplifying the Complexity
                        </h1>
                        <p className="text-zinc-400 text-lg">Here is what's happening in plain English.</p>
                    </div>

                    {/* Analogy Card */}
                    <Card className="bg-zinc-900/50 border-emerald-900 border-2 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                        <CardHeader>
                            <CardTitle className="text-emerald-400 flex items-center gap-2">
                                <Activity className="h-6 w-6" />
                                The Big Picture
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl text-zinc-200 leading-relaxed font-medium">
                                "{data.beginner_explanation.summary_analogy}"
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Health Score */}
                        <Card className="bg-zinc-900 border-zinc-800 flex flex-col justify-center items-center p-8">
                            <div className="relative h-40 w-40 flex items-center justify-center">
                                <svg className="transform -rotate-90 w-full h-full">
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="10"
                                        fill="transparent"
                                        className="text-zinc-800"
                                    />
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="10"
                                        fill="transparent"
                                        strokeDasharray={440}
                                        strokeDashoffset={440 - (440 * data.beginner_explanation.risk_score) / 100}
                                        className={`${data.beginner_explanation.risk_score > 80 ? 'text-emerald-500' :
                                            data.beginner_explanation.risk_score > 50 ? 'text-amber-500' :
                                                'text-red-500'
                                            } transition-all duration-1000 ease-out`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold text-zinc-100">{data.beginner_explanation.risk_score}</span>
                                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Health Score</span>
                                </div>
                            </div>
                        </Card>

                        {/* Simple Risks List */}
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-zinc-300">Key Things to Fix</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.beginner_explanation.simple_risks.map((risk, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="h-6 w-6 rounded-full bg-red-950/50 text-red-500 flex items-center justify-center shrink-0 border border-red-900/50 font-mono text-xs">
                                            {idx + 1}
                                        </div>
                                        <p className="text-zinc-400">{risk}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in fade-in duration-500">
                        <Card className="bg-zinc-900 border-red-900">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-400">Survival Probability</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-red-500">
                                    {(data.survival_probability * 100).toFixed(0)}%
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">Chance of surviving month 1</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-400">Primary Scale Cliff</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-amber-500">
                                    <TrendingDown className="h-5 w-5" />
                                    <span className="font-semibold">10x Load Limit</span>
                                </div>
                                <p className="text-sm text-zinc-300 mt-2 leading-snug">{data.scale_cliff}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-400">System Health</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-red-400">
                                    <Activity className="h-5 w-5" />
                                    <span className="font-semibold">Critical Condition</span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">{data.top_risks.length} fatal risks detected</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Analysis grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500 delay-100">

                        {/* Left Column: Risks */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-red-500" />
                                Top Failure Modes
                            </h2>
                            {data.top_risks.map((risk, idx) => (
                                <Card key={idx} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg text-red-400">{risk.title}</CardTitle>
                                            <span className="px-2 py-1 bg-red-950 text-red-500 text-xs rounded border border-red-900">
                                                Severity: {risk.severity}
                                            </span>
                                        </div>
                                        <CardDescription className="font-mono text-xs text-zinc-500 mt-1">
                                            {risk.location}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-semibold text-zinc-300 mb-1">Mechanism of Failure</h4>
                                            <p className="text-sm text-zinc-400 leading-relaxed">{risk.failure_mechanism}</p>
                                        </div>
                                        <Alert className="bg-zinc-950 border-zinc-800">
                                            <GitBranch className="h-4 w-4 text-emerald-500" />
                                            <AlertTitle className="text-emerald-500 text-xs uppercase tracking-wide">Fix Plan</AlertTitle>
                                            <AlertDescription className="text-zinc-300 text-sm mt-1">
                                                {risk.fix_suggestion}
                                            </AlertDescription>
                                        </Alert>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Right Column: Timeline & Context */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <TrendingDown className="h-5 w-5 text-amber-500" />
                                Projected Timeline
                            </h2>

                            <div className="relative border-l border-zinc-800 ml-3 space-y-8 pl-8 py-2">
                                <div className="relative">
                                    <span className="absolute -left-[39px] h-6 w-6 rounded-full bg-zinc-950 border border-red-500 flex items-center justify-center text-xs text-red-500">
                                        1d
                                    </span>
                                    <h3 className="text-sm font-semibold text-zinc-200">Short Term (Days)</h3>
                                    <p className="text-sm text-zinc-400 mt-1">{data.timeline.short_term}</p>
                                </div>

                                <div className="relative">
                                    <span className="absolute -left-[39px] h-6 w-6 rounded-full bg-zinc-950 border border-amber-500 flex items-center justify-center text-xs text-amber-500">
                                        1m
                                    </span>
                                    <h3 className="text-sm font-semibold text-zinc-200">Medium Term (Months)</h3>
                                    <p className="text-sm text-zinc-400 mt-1">{data.timeline.medium_term}</p>
                                </div>

                                <div className="relative">
                                    <span className="absolute -left-[39px] h-6 w-6 rounded-full bg-zinc-950 border border-zinc-600 flex items-center justify-center text-xs text-zinc-600">
                                        1y
                                    </span>
                                    <h3 className="text-sm font-semibold text-zinc-200">Long Term (Year+)</h3>
                                    <p className="text-sm text-zinc-400 mt-1">{data.timeline.long_term}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardMock;
