# DFA-minimization-visualizer


An interactive web-based tool to visualize and minimize Deterministic Finite Automata (DFA) using the **Myhill-Nerode Theorem**.

## 🚀 Live Demo
**[Click here to open the Visualizer](https://samson1106.github.io/DFA-minimization-visualizer/)**

---

## 🧐 Project Overview
This project is designed to help students and researchers understand the process of reducing the number of states in a DFA while keeping the language it recognizes exactly the same. 

### What is DFA Minimization?
**DFA Minimization** is the task of transforming a given DFA into an equivalent one that has the minimum possible number of states. 
* **Efficiency:** Minimizing a DFA reduces the memory and computational resources required for string processing.
* **Redundancy:** It merges states that behave identically under all possible inputs.
* **Standardization:** It provides a "canonical" or simplest form for any regular language.

---

## 🧪 The Minimization Logic
[cite_start]This tool implements the **Table-Filling Algorithm** (Myhill-Nerode Theorem)[cite: 5, 11]:
1. [cite_start]**Identify Distinguishable Pairs:** A pair of states $(p, q)$ is initially marked if one is a **Final State** and the other is a **Regular State**[cite: 5, 6].
2. **Iterative Marking:** The algorithm checks transitions for all unmarked pairs. If an input leads them to a pair already known to be distinguishable, the current pair is marked.
3. [cite_start]**State Grouping:** Once no more marks can be made, unmarked pairs are considered equivalent and merged into a single "Grouped State"[cite: 11].



---

## ✨ Visual Conventions
To ensure clarity and follow standard textbook notation, the diagrams use:
* [cite_start]**Regular States:** Rendered as a **single circle** with a thin border[cite: 3, 4].
* [cite_start]**Final States:** Rendered as a **double circle** with a thick green border[cite: 5, 6].
* [cite_start]**Grouped States:** Labeled with curly braces (e.g., `{q0q1}`) to show which original states were merged[cite: 11].



---

## 🛠️ Technical Implementation
* [cite_start]**Cytoscape.js:** Used for high-performance graph rendering and automated circle layouts[cite: 1, 10].
* [cite_start]**JavaScript (ES6):** Handles the core state-merging logic and transition table generation[cite: 1, 11].
* [cite_start]**CSS3:** Provides a clean, responsive grid layout for side-by-side comparison[cite: 11].

---
