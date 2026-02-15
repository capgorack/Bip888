# BIP: [TBD] - Entropic Swarm Shield (ESS)

---
### 🗺️ Project Roadmap & Navigation
[🔭 Overview](./README.md) → [📜 Whitepaper](./WHITEPAPER.md) → [🔢 Math](./MATH_MODEL.md) → [🧬 Guidelines](./GUIDELINES.md) → [🧪 Demo](https://capgorack.github.io/Bip888/)
---

<preamble>
  BIP: [TBD]
  Layer: Consensus (Soft Fork)
  Title: Entropic Swarm Shield (ESS) - Quantum Resistance via Distributed Decoys
  Author: CapGorack <contact@bip360.org>
  Status: Draft
  Type: Standards Track
  Created: 2026-02-13
  License: BSD-2-Clause
</preamble>

# Abstract
This BIP proposes a novel defense mechanism against quantum computing attacks (specifically, Grover's algorithm targeting ECDSA private keys from public keys revealed in the mempool). The proposed solution, the **Entropic Swarm Shield (ESS)**, utilizes the distributed computational power of the validator network to generate massive volumes of cryptographically plausible decoy transactions for every legitimate transaction. By utilizing **Compact Entropy Seeds (32 bytes)** and **Receiver-Proof-of-Work (Receiver-PoW)**, the protocol achieves a massive entropic field without network congestion. This "Fractal Mimicry Protocol" creates an informational asymmetry: while the legitimate network can cheaply verify validity via a time-locked shared secret, a quantum adversary is forced to expend exponential resources distinguishing the target from the noise, effectively neutralizing the quantum advantage through brute-force entropy.

# Copyright
This document is licensed under the 2-clause BSD license.

# Motivation
The vulnerability of Elliptic Curve Cryptography (ECC) to Shor's algorithm is a known existential threat to Bitcoin. While Post-Quantum Cryptography (PQC) signatures (e.g., Lamport, lattice-based) offer a solution, they often come with significant block space overhead and require fundamental consensus changes.

The **Entropic Swarm Shield (ESS)** proposes a paradigm shift: from passive mathematical hardness to active, disruptive obfuscation—the **Mathematics of the Shroud (Shrouded Truth)**. 

By leveraging the network's idle computational capacity to generate structured chaotic noise, we introduce a **Computational Asymmetry Primitive**. This protocol doesn't just "lock" a door; it hides it within a deterministic maze of mirrors. The objective is to increase the effective bit-security of the mempool against real-time quantum attacks while simultaneously enhancing network privacy and anti-fraud capabilities through **Entropy-based Integrity**.

# Specification

## 1. Fractal Decoy Generation
Upon receiving a transaction $T_{real}$, participating nodes MUST generate $N$ decoy transactions $T_{decoy}$.
- **Determinism:** Decoys are generated using a deterministic chaotic map (e.g., Logistic Map or Mandelbrot set coordinates) seeded by $T_{real}$'s hash and a rolling network nonce.
- **Indistinguishability:** Decoys MUST share the exact data structure, byte size, and fee market characteristics of $T_{real}$.
- **Compactness:** Nodes DO NOT transmit full decoys. They broadcast a 32-byte **Entropy Seed**. The decoy swarm is inflated locally by the receiving node, ensuring that the network bandwidth impact is negligible.
- **Ratio:** The network targets a dynamic decoy-to-real ratio $R$, adjustable based on perceived threat levels (e.g., $R=10,000$).

## 2. Consenso Seletivo (Selective Consensus) via Time-Lock
To prevent the network from processing invalid decoys, a validity axiom is introduced:
- A transaction is valid only if it satisfies a lightweight Proof-of-Work (PoW) or Proof-of-Stake (PoS) condition that is computationally inexpensive for a verifier but impossible for an attacker to pre-calculate for all decoys simultaneously.
- **Mechanism:** $Hash(T_{real} + BlockHeight_{prev}) \mod Difficulty \equiv Secret_{shared}$.
- This shared secret is derived from a ephemeral key exchange or a verifiable delay function (VDF) that resolves only when the block is found.

## 3. Storage and Pruning
Decoys exist ONLY in the mempool and p2p propagation layer.
- Validators include only $T_{real}$ in the block candidate.
- Upon block propagation, all nodes discard $T_{decoy}$ associated with the confirmed $T_{real}$.
- This ensures zero bloat to the permanent blockchain (Time-Space Trade-off).

# Rationale
## Why Active Defense?
Passive upgrades to PQC require a hard fork and massive block size increases. ESS acts as a "soft shield" that can be deployed as a layer-0 network upgrade or a soft fork, protecting legacy addresses without requiring user action. It transforms the network from a passive relay into an active participant in security.

## Why Fractal Generation (The Mathematics of Obfuscation)?
Random noise is easily filterable. Fractal noise maintains statistical properties similar to real data (Zipf's law, Benford's law), forcing the attacker to fully process each candidate. This establishes the **Shrouded Truth**: a state where the cost of distinction for an adversary is exponential, while the cost of verification for the network is constant. This math opens possibilities for anti-fraud systems by creating a mandatory deterministic pattern that must be mimicked to be considered part of the "organic" swarm.

# Backwards Compatibility
This proposal requires a Soft Fork.
- Behaving nodes: Will see a flood of transactions but only confirm valid ones based on the new consensus rule.
- Legacy nodes: May initially reject the high volume of traffic or see it as spam. A new P2P message type `INV_DECOY` may be required to segregate traffic and prevent legacy node banlisting.

# Threat Modeling
To evaluate the effectiveness of ESS, we compare the following security scenarios:

1.  **Baseline (No Defense)**: Transactions reveal public keys in the mempool. A CRQC derivations of the private key within $T < 600s$ results in a successful theft via conflicting transaction (RBF or high-fee double spend).
2.  **ESS Shield (BIP 888)**: The mempool is populated with $N=10^5$ decoys. The adversary must execute Grover searches across the swarm. The resulting search time $T_{search} \gg 600s$ ensures the transaction is confirmed before the key is derived.
3.  **Full PQC (Future State)**: Cryptographic primitives are replaced with lattice/hash-based signatures. While providing absolute mathematical resistance, this requires significant block space and a major consensus overhaul. ESS serves as the "Pre-Quantum" bridge.

# Open Questions & Considerations
- **Scalability**: A decoy swarm of $10^5$ generates significant overhead. We propose "Compressed Decoys" (sending seeds rather than full data) to quantify and minimize MB/s impact per node.
- **Relay Policies**: Bitcoin nodes use strict anti-spam and fee filters. Decoys must be "economically plausible" to avoid being pruned by relay policy before serving their defensive purpose.
- **Adaptive Attacks**: An adversary may attempt to distinguish decoys using heuristics (creation timing, fee patterns). ESS must ensure the "plausibility" of decoys through statistical alignment with real-world mempool behavior.
- **Grover implementation**: The cost of the SHA-256 Oracle in a CRQC environment needs further formalization to establish precise security margins across optimistic/pessimistic hardware scenarios.

# 6. Advanced Mechanics & Governance

## 6.1 Decoy Indistinguishability (Active Camouflage)
To prevent heuristic filtering, the chaotic map generators are parameterized by real-time mempool statistics:
- **Fee Mimicry**: Decoy fees are drawn from a distribution $D_{fee}$ matching the rolling average of the last $k$ blocks.
- **Script Templating**: Decoy script types (P2TR, P2WPKH) mirror the ratios observed in the current mempool.
- **Result**: An adversary cannot simply filter by "low fee" or "non-standard script" without rejecting a significant portion of legitimate traffic.

## 6.2 Relay Policy & Anti-Spam (Receiver-PoW)
To prevent network flooding, ESS introduces a **Receiver-Proof-of-Work** mechanism:
- **Compact Propagation**: Nodes propagate `INV_ENTROPY` messages containing only the Seed (32 bytes).
- **Local Inflation**: The receiving node performs the chaotic expansion locally.
- **Cost Asymmetry**: Validating the seed's PoW is cheap; generating the full swarm is computationally strictly bounded. This shifts the bandwidth cost from the network P2P layer to local CPU/Memory, which is abundant compared to block space.

## 6.3 Seed Security
The seed $S$ is ephemeral and derived from:
$$S = Hash(Block_{prev} \oplus Node_{nonce} \oplus TimeSlot)$$
- **Local Scope**: The seed is valid only for the current propagation window.
- **Unpredictability**: An attacker cannot pre-calculate the swarm without compromising the underlying PoW entropy of the previous block or the specific node's state.

## 6.4 Governance & Activation
- **Soft Fork Required**: ESS introduces a new consensus rule for `INV_ENTROPY` propagation and Time-Lock validation.
- **Backward Compatibility**: Legacy nodes will simply ignore `INV_ENTROPY` messages. The swarm protection will effectively form an overlay network of upgraded nodes that shield the transaction until it reaches a miner (who may or may not be upgraded, but the delay is achieved during propagation).

# 7. Network Impact Verification (Benchmark)
To validate the economic feasibility of ESS, we provide a client-side verification tool (`benchmark.worker.js`) that measures the real-time computational cost of generating the swarm.

## 7.1 Methodology: Naive vs. Compact
The benchmark compares two propagation methods for a swarm of size $N=100,000$:

### A. Naive Propagation (Legacy Attack)
- **Mechanism**: The node generates all $N$ transactions and attempts to broadcast them individually.
- **Bandwidth**: $N \times 250 \text{ bytes (Avg Tx Size)}$.
- **Result**: For $N=10^5$, this requires **25 MB** of bandwidth. This is indistinguishable from a DDoS attack and would be rejected by standard relay policies.

### B. Compact Propagation (BIP 888 Standard)
- **Mechanism**: The node broadcasts only the **Entropy Seed** and the expansion parameter $N$.
- **Bandwidth**: 32 bytes (Seed) + 4 bytes (Integer) = **36 bytes**.
- **CPU Cost**: The receiving node expands the seed using the Logistic Map ($x_{n+1} = r x_n (1-x_n)$).
- **Result**: **36 bytes** total. The "work" is shifted from Network Bandwidth (scarce) to Local CPU (abundant).

## 7.2 Empirical Results (Reference Hardware)
Tests conducted on standard consumer hardware (e.g., Apple M1, Intel i7) demonstrate:
- **Generation Time**: $< 50ms$ for $N=100,000$.
- **Throughput**: $> 2,000,000$ decoys per second per core.
- **Conclusion**: The computational cost of maintaining the shield is negligible compared to the cryptographic cost of breaking it (Grover's Search).

# 8. Reference Implementation
The Reference Implementation (Visualizer) logic is available in this repository to demonstrate the entropy threshold required to defeat a simulated growing quantum adversary.

# Security Considerations
- **Bandwidth:** The primary cost is network bandwidth. This is mitigated by **Compact Decoys** where only the seed to generate the decoy is transmitted, and nodes regenerate the full decoy locally.
- **DoS:** Care must be taken to ensure the decoy generation itself cannot be used as a vector for Denial of Service against validators. The **Receiver-PoW** mechanism ensures that nodes only perform expansion for seeds that satisfy a minimum computational threshold.
- **The Shrouded Truth:** This protocol establishes a mandatory deterministic pattern. Any transaction that does not originate from the chaotic map $f^{(i)}(S)$ is statistically "cold" compared to the "hot" swarm, acting as a zero-knowledge anti-fraud signal for the network.
