# DFA Minimization Visualizer 

An interactive, web-based tool designed to visualize the minimization of DFA through the (**Myhill-Nerode (Table Filling) Algorithm**. This project helps students  understand how a Deterministic Finite Automaton (DFA) can be reduced to its most efficient form by merging equivalent states.

---

## 🚀 Live Demo
**[Click here to view the Working Webpage](https://samson1106.github.io/DFA-minimization-visualizer/)**

*(Note: If the link shows a 404, please wait 2 minutes for GitHub to finish the initial deployment.)*

---

## 🧩 What is DFA Minimization?
**DFA Minimization** is the process of transforming a given Deterministic Finite Automaton into an equivalent DFA that has the **minimum possible number of states**. Two DFAs are equivalent if they accept the exact same language.

### Why Minimize?
* **Efficiency:** Smaller automata require less memory and computational power for implementation.
* **Optimization:** It removes redundant states that perform identical logic within the machine.
* **Canonical Form:** It provides a standard, "simplest" version of a language's representation.

---

## 🛠️ The Myhill-Nerode (Table-Filling) Algorithm
This visualizer implements the **Myhill-Nerode Theorem** to identify **equivalent states**. Two states, $p$ and $q$, are equivalent if, for every possible input string $w$, transitioning from $p$ on $w$ leads to an accepting state if and only if transitioning from $q$ on $w$ also leads to an accepting state.



### The Step-by-Step Logic
1.  **Eliminate Unreachable States:** The system focuses on states accessible from the start.
2.  **Initial Partition (Step 0):** Divide states into two groups: **Final States** ($F$) and **Non-Final States** ($Q-F$). Any pair consisting of one final and one non-final state is marked as "distinguishable" (**X**).
3.  **Iterative Marking:** For every unmarked pair $(p, q)$, the algorithm checks where they transition for each input symbol $a$. If the resulting pair $(\delta(p, a), \delta(q, a))$ is already marked, then $(p, q)$ is also marked.
4.  **Grouping:** Once no more marks can be added, any pairs that remain **unmarked** are equivalent and are merged into a single state.

---

## ✨ Key Features
* **Live Transition Grid:** Generates a dynamic input table based on your custom states and alphabet.
* **Step-by-Step Walkthrough:** Watch the table fill in real-time as the algorithm logic processes.
* **Midnight Slate UI:** A professional dark aesthetic designed for high-contrast technical visualization.
* **Graph Visualization:** Uses **Cytoscape.js** to render side-by-side comparisons of the Original and Minimized DFA.

## 🛠️ Tech Stack
* **HTML5/CSS3:** Custom dark theme with CSS variables.
* **JavaScript (ES6):** Core logic for state reduction and DOM manipulation.
* **Cytoscape.js:** Powering the interactive directed graph visualizations.

