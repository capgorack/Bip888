import React from 'react';
import { useNetworkBenchmark } from '../hooks/useNetworkBenchmark';

// Helper for formatting bytes
const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const NetworkImpactPanel = () => {
    const { status, metrics, runBenchmark, resetBenchmark } = useNetworkBenchmark();

    // Use internal state to show "Running" text since worker is fast
    const isRunning = status === 'running';
    const hasResult = status === 'completed' && metrics;

    const handleButtonClick = () => {
        if (hasResult) {
            resetBenchmark();
        } else {
            runBenchmark(100000);
        }
    };

    return (
        <div style={{ width: '100%', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    BENCHMARK
                </h3>
                <button
                    onClick={handleButtonClick}
                    disabled={isRunning}
                    style={{
                        width: 'auto',
                        margin: 0,
                        padding: '2px 8px',
                        fontSize: '0.7rem',
                        opacity: isRunning ? 0.5 : 1,
                        borderColor: hasResult ? '#666' : 'var(--primary-color)',
                        color: hasResult ? '#aaa' : 'var(--primary-color)'
                    }}
                >
                    {isRunning ? '...' : (hasResult ? 'CLOSE SCOPE' : 'RUN VERIFICATION')}
                </button>
            </div>

            {/* Default View or Running View */}
            {!hasResult && (
                <div style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '0.5rem' }}>
                    {isRunning ? 'GENERATING 100K FRACTALS...' : 'Verify CPU/Bandwidth Impact'}
                </div>
            )}

            {/* Results View - Matching MetricsPanel .stat-row style */}
            {hasResult && (
                <>
                    <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem', borderBottom: '1px solid #222' }}></div>

                    <div className="stat-row">
                        <span>Naive Size (Legacy):</span>
                        <span className="stat-value" style={{ color: 'var(--danger-color)' }}>
                            {formatBytes(metrics.bandwidthNaiveBytes)}
                        </span>
                    </div>

                    <div className="stat-row">
                        <span>Compact Size (BIP888):</span>
                        <span className="stat-value" style={{ color: 'var(--primary-color)' }}>
                            {formatBytes(metrics.bandwidthCompactBytes)}
                        </span>
                    </div>

                    <div className="stat-row">
                        <span>Generation Time:</span>
                        <span className="stat-value" style={{ color: '#00ccff' }}>
                            {metrics.durationMs.toFixed(1)}ms
                        </span>
                    </div>

                    <div className="stat-row" title="Estimated global propagation time (Compact vs Naive)">
                        <span>Propag. Latency (Est.):</span>
                        <span className="stat-value" style={{ color: '#00ccff' }}>
                            ~50ms
                        </span>
                    </div>

                    <div className="stat-row">
                        <span>Throughput:</span>
                        <span className="stat-value" style={{ color: '#00ccff' }}>
                            {(metrics.opsPerSec / 1000000).toFixed(1)} M/s
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

export default NetworkImpactPanel;
