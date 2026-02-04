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

interface AnalysisData {
    survival_probability: number;
    scale_cliff: string;
    top_risks: Risk[];
    timeline: {
        short_term: string;
        medium_term: string;
        long_term: string;
    };
}

const DashboardMock: React.FC<{ data: AnalysisData }> = ({ data }) => {
    return (
        <div className="p-8 bg-zinc-950 min-h-screen text-zinc-100 font-sans">

            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

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
        </div>
    );
};

export default DashboardMock;
