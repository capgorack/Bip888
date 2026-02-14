# BIP: 888 (Proposed) - Mathematical Model

[🌐 **Português (Brasil)**](./docs/pt-br/MATH_MODEL.md) | 🇺🇸 **English**

This document defines the fundamental equations governing decoy generation and entropy analysis for the BIP 888 protocol.

---

## 1. Decoy Generation via Chaotic Maps

The security of the ESS relies on generating $N$ decoy transactions ($T_{decoy}$) that are indistinguishable from the real transaction ($T_{real}$) to an observer without the time-key.

We use the **Logistic Map** as a deterministic pseudo-random number generator (PRNG) due to its sensitivity to initial conditions (butterfly effect).

### Logistic Map Equation:
$$x_{n+1} = r \cdot x_n \cdot (1 - x_n)$$

Where:
- $x_n$: The current state (normalized between 0 and 1).
- $r$: The growth parameter (for chaotic behavior, $r \approx 4.0$, specifically $r = 3.999...$).

### Application in Decoy Generation:
For each transaction $T_{real}$:

1.  **Seed ($Seed$):**
    $$S = Hash(T_{real} \parallel NetworkNonce \parallel TimeSlot)$$
    This seed is converted into an initial value $x_0 \in (0, 1)$.

2.  **Chaotic Iteration:**
    The system iterates the logistic map $K$ times to eliminate transients.
    $$x_k = f^{(K)}(x_0)$$

3.  **Decoy Attribute Generation:**
    For each $T_{decoy_i}$ ($i$ from 1 to $N$):
    - The value $x_{k+i}$ is used to derive the attributes of the decoy transaction (recipient, amount, locktime).
    - Example: $Amount_{decoy} = (x_{k+i} \cdot MaxBTC) \mod (Amount_{real} \pm \delta)$

This ensures that decoys have "organic" statistical properties and do not appear as uniform white noise.

## 2. Entropy Analysis (Grover vs. Swarm)

### Grover's Optimization:
A quantum computer using Grover's Algorithm can find a key in $\mathcal{O}(\sqrt{N})$ operations.
For a $b$-bit key, the search space is $2^b$. Grover reduces it to $\sqrt{2^b} = 2^{b/2}$.

### Swarm Impact:
If the attacker must distinguish between 1 real transaction and $M$ decoys before attempting to crack the key.

The effective search space becomes:
$$TotalSpace = (M + 1) \cdot 2^b$$

The quantum attack time ($T_{attack}$) becomes:
$$T_{attack} \propto \sqrt{(M + 1) \cdot 2^b} = \sqrt{M+1} \cdot 2^{b/2}$$

### Security Gain ($\Delta S$):
The security increase factor is $\sqrt{M}$.
- If $M = 10,000$ (10k decoys), the attack time increases by $\sqrt{10,000} = 100$ times.
- If $M = 1,000,000$ (1M decoys), the time increases by $1,000$ times.

This means that to maintain the same probability of success, the attacker would need $1,000$ times more coherent qubits or coherence time.

## 3. Selective Consensus (Time-Lock)

Validation is performed via a lightweight perturbation function:

$$V(T) = (Hash(T) \oplus Hash(PreviousBlock)) \mod D$$

If $V(T) < Target$, the transaction is a candidate for being $T_{real}$.
The decoy generator ensures that $V(T_{decoy}) \neq V(T_{real})$ by subtly adjusting "padding" bits of the decoys so they fail this test, in a way that is only verifiable if you know the $PreviousBlock$.

---

*"The authenticity of this proposal lies in its mathematical capacity to survive chaos."*

## 📜 Licensing
This document and the mathematical model are technical contributions by **Éve Sk > CapGorack**. 
Distributed under the **BSD 2-Clause License**.
Copyright © 2026 Éve Sk > CapGorack.
