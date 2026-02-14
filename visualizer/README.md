# 🖥️ BIP 888 Visualizer (Quantum Resistance Dashboard)

This is the official visualization interface for the **BIP 888 Entropic Swarm Shield (ESS)** protocol. It provides a real-time, interactive simulation of how distributed decoys neutralize quantum search algorithms (Grover's Algorithm).

## 🚀 Quick Start
### 🌐 Live Demo
Experience the simulation immediately in your browser:  
👉 **[Launch Quantum Resistance Dashboard](https://capgorack.github.io/bip888/)**

### 💻 Local Installation
If you prefer to run the code locally:

1. Navigate to the visualizer directory:
   ```bash
   cd visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Dashboard
Start the development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🎮 Features & Usage

### 1. Swarm Density ($N$)
- **Slider:** Adjusts the number of decoy transactions generated per real transaction.
- **Scale:** Logarithmic scale from 100 to 1,000,000.
- **Zones:**
  - 🟢 **Standard (1k-10k):** Basic obfuscation.
  - 🔵 **Resilience (10k-100k):** BIP 888 Recommended Zone. Beats Grover locally.
  - 🟣 **Theoretical (100k+):** Future-proofing against massive quantum grids.

### 2. Attacker Power (Qubits)
- **Slider:** Simulates the coherence capacity of the attacker.
- **Scale:** Logarithmic scale from 100 to 100,000,000.
- **Benchmark:** 20 Million Qubits is the theoretical ceiling for current ECDSA threats.

### 3. Real-Time Battle Status
- **Status Indicator:** Shows if the system is `SECURE`, `NEUTRALIZED`, or `CRACKED`.
- **Metrics:** Displays the calculated `Time to Crack` vs. `Target Block Time` (600s).

---

## 🛠️ Tech Stack
- **Framework:** React + Vite
- **Language:** JavaScript (ES6+)
- **Styling:** CSS Modules (Matrix/Cyberpunk Aesthetic)
- **Performance:** Canvas/WebGL optimized for high particle count.

---

## 📜 License
This visualizer is part of the BIP 888 project and is released under the **BSD 2-Clause License**.
Copyright © 2026 Éve Sk > CapGorack.

*"The authenticity of this proposal lies in its mathematical capacity to survive chaos."*
