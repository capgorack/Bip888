import React from 'react';
import { useNetworkBenchmark } from '../hooks/useNetworkBenchmark';

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const NetworkImpactPanel = () => {
    const { status, metrics, runBenchmark } = useNetworkBenchmark();

    // Safe thresholds
    const CPU_LIMIT_MS = 50;
    const BANDWIDTH_LIMIT = 1000; // 1KB

    /* const isEffective = metrics && metrics.durationMs < CPU_LIMIT_MS; */
    const isNetworkSafe = metrics && metrics.bandwidthCompactBytes < BANDWIDTH_LIMIT;

    return (
        <div className="glass-panel p-6 mt-6 border-l-4 border-l-blue-500 relative overflow-hidden transition-all duration-500">
            <div className="absolute top-0 right-0 p-2 opacity-20 text-6xl font-black select-none pointer-events-none text-blue-500">
                BENCHMARK
            </div>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-blue-400">NETWORK IMPACT ANALYSIS</h2>
                    <p className="text-xs text-gray-400">REAL-TIME CLIENT-SIDE VERIFICATION</p>
                </div>

                <button
                    onClick={() => runBenchmark(100000)}
                    disabled={status === 'running'}
                    className={`px-4 py-2 rounded font-mono text-sm border transiton-all duration-200 ${status === 'running'
                            ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-900/30 border-blue-500/50 text-blue-300 hover:bg-blue-800/50 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                        }`}
                >
                    {status === 'running' ? 'CALCULATING...' : 'RUN PROOF-OF-COMPACT (100k)'}
                </button>
            </div>

            {status === 'idle' && (
                <div className="text-center py-8 text-gray-500 font-mono text-sm border border-dashed border-gray-700 rounded">
                    Waiting for analysis... <br />
                    Click run to verify Bandwidth & CPU overhead.
                </div>
            )}

            {status === 'running' && (
                <div className="text-center py-8 text-blue-400 font-mono text-sm animate-pulse border border-blue-900/50 rounded bg-blue-900/20">
                    GENERATING 100,000 FRACTAL DECOYS...
                </div>
            )}

            {status === 'completed' && metrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">

                    {/* BANDWIDTH COMPARISON */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-300 border-b border-gray-700 pb-2">BANDWIDTH (PER TX)</h3>

                        {/* Naive Swarm Bar */}
                        <div className="group">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-red-400">NAIVE SWARM (Legacy)</span>
                                <span className="text-red-400 font-mono">{formatBytes(metrics.bandwidthNaiveBytes)}</span>
                            </div>
                            <div className="h-4 bg-gray-800 rounded overflow-hidden">
                                <div className="h-full bg-red-600 w-full animate-grow-width shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">Huge network load. Would crash gossip protocol.</p>
                        </div>

                        {/* Compact Swarm Bar */}
                        <div className="group">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-emerald-400">BIP 888 (Compact)</span>
                                <span className="text-emerald-400 font-mono">{formatBytes(metrics.bandwidthCompactBytes)}</span>
                            </div>
                            <div className="h-4 bg-gray-800 rounded overflow-hidden relative">
                                <div
                                    className="h-full bg-emerald-500 animate-grow-width shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                    style={{ width: '1%' }} // Tiny width to show scale diff
                                ></div>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">Seed only. Negligible impact.</p>
                        </div>

                    </div>

                    {/* CPU & LATENCY METRICS */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-300 border-b border-gray-700 pb-2">CPU LATENCY (CLIENT-SIDE)</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
                                <div className="text-[10px] text-gray-500 uppercase">Generation Time</div>
                                <div className="text-2xl font-mono text-blue-400">
                                    {metrics.durationMs.toFixed(2)}<span className="text-sm">ms</span>
                                </div>
                            </div>
                            <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
                                <div className="text-[10px] text-gray-500 uppercase">Throughput</div>
                                <div className="text-xl font-mono text-purple-400">
                                    {(metrics.opsPerSec / 1000000).toFixed(1)}<span className="text-sm">M/s</span>
                                </div>
                            </div>
                        </div>

                        <div className={`mt-4 p-3 rounded border flex items-center justify-center gap-3 ${isNetworkSafe
                                ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400'
                                : 'bg-red-900/20 border-red-500/50 text-red-400'
                            }`}>
                            <div className={`w-3 h-3 rounded-full ${isNetworkSafe ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`}></div>
                            <span className="font-bold tracking-wider font-mono">
                                {isNetworkSafe ? 'NETWORK VIABLE' : 'HIGH OVERHEAD'}
                            </span>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default NetworkImpactPanel;
