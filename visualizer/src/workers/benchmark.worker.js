/* eslint-disable no-restricted-globals */

// BIP 888: Network Impact Benchmark Worker
// Responsibility: Execute the Logistic Map Chaos loop to simulate decoy generation cost.

self.onmessage = (e) => {
    const { swarmSize, iterations } = e.data;

    // Performance Timer Start
    const start = performance.now();

    // Simulation Physics Consants
    const r = 3.9999; // Chaotic Growth Parameter
    let x = 0.5;      // Initial Seed State

    // The Chaos Loop (Simulating Decoy Generation)
    // We run the map N times to simulate generating N decoys
    for (let i = 0; i < swarmSize; i++) {
        x = r * x * (1 - x);

        // Simulating minimal memory write (creating the transaction structure)
        // In a real node, this would be constructing the Tx object.
        // Here we just prevent the JIT compiler from optimizing the loop away.
        if (x < 0) x = 0.5;
    }

    // Performance Timer End
    const end = performance.now();
    const durationMs = end - start;

    // Bandwidth Calculation
    // Naive: 250 bytes per tx * swarmSize
    // Compact: 32 bytes (Seed) + 4 bytes (Overhead)
    const bandwidthNaiveBytes = swarmSize * 250;
    const bandwidthCompactBytes = 36; // Constant size (Seed + OpCode)

    self.postMessage({
        type: 'BENCHMARK_RESULT',
        payload: {
            durationMs,
            opsPerSec: (swarmSize / (durationMs / 1000)),
            bandwidthNaiveBytes,
            bandwidthCompactBytes,
            swarmSize
        }
    });
};
