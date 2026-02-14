import { useState, useCallback, useEffect, useRef } from 'react';

export const useNetworkBenchmark = () => {
    const [status, setStatus] = useState('idle'); // idle, running, completed
    const [metrics, setMetrics] = useState(null);
    const workerRef = useRef(null);

    useEffect(() => {
        // Initialize Worker
        workerRef.current = new Worker(new URL('../workers/benchmark.worker.js', import.meta.url), {
            type: 'module'
        });

        workerRef.current.onmessage = (e) => {
            const { type, payload } = e.data;
            if (type === 'BENCHMARK_RESULT') {
                setMetrics(payload);
                setStatus('completed');
            }
        };

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const runBenchmark = useCallback((swarmSize = 100000) => {
        if (status === 'running') return;

        setStatus('running');
        setMetrics(null);

        // Small delay to allow UI to update to 'running' state before heavy lifting potentially starts
        setTimeout(() => {
            workerRef.current.postMessage({ swarmSize });
        }, 100);
    }, [status]);

    const resetBenchmark = useCallback(() => {
        setStatus('idle');
        setMetrics(null);
    }, []);

    return { status, metrics, runBenchmark, resetBenchmark };
};
