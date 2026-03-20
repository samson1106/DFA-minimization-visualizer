let transitions = {};
let states = [];
let alpha = [];
let finals = [];
let stepQueue = [];
let currentStepIdx = 0;
let markedPairs = {}; 

function initTable() {
    states = document.getElementById('states').value.split(',').map(s => s.trim()).filter(s => s);
    alpha = document.getElementById('alphabet').value.split(',').map(a => a.trim()).filter(a => a);
    
    let html = `<table><tr><th>State</th>`;
    alpha.forEach(a => html += `<th>On Input ${a}</th>`);
    html += `</tr>`;
    
    states.forEach(s => {
        html += `<tr><td><strong>${s}</strong></td>`;
        alpha.forEach(a => {
            html += `<td><input type="text" class="cell" data-f="${s}" data-s="${a}" placeholder="to state..."></td>`;
        });
        html += `</tr>`;
    });
    
    document.getElementById('table-area').innerHTML = html + `</table>`;
    document.getElementById('trans-card').style.display = 'block';
}

function processMinimization() {
    stepQueue = [];
    currentStepIdx = 0;
    markedPairs = {};
    finals = document.getElementById('finals').value.split(',').map(f => f.trim());

    const origElems = [];
    states.forEach(s => {
        transitions[s] = {};
        origElems.push({ data: { id: s, label: s, isFinal: finals.includes(s) } });
    });
    
    document.querySelectorAll('.cell').forEach(i => {
        transitions[i.dataset.f][i.dataset.s] = i.value.trim();
        origElems.push({ data: { source: i.dataset.f, target: i.value.trim(), label: i.dataset.s } });
    });
    draw('cy-orig', origElems);

    // Initial Marking: Final vs Non-Final States
    for (let i = 0; i < states.length; i++) {
        for (let j = i + 1; j < states.length; j++) {
            let p = states[i], q = states[j];
            markedPairs[`${p}-${q}`] = (finals.includes(p) !== finals.includes(q));
        }
    }
    stepQueue.push({ 
        table: JSON.parse(JSON.stringify(markedPairs)), 
        desc: "Step 1: Marking pairs where one is a Final state and the other is not." 
    });

    // Iterative Marking Logic
    let changed = true;
    while (changed) {
        changed = false;
        let roundMarked = [];
        for (let i = 0; i < states.length; i++) {
            for (let j = i + 1; j < states.length; j++) {
                let p = states[i], q = states[j];
                if (!markedPairs[`${p}-${q}`]) {
                    for (let a of alpha) {
                        let tp = transitions[p][a], tq = transitions[q][a];
                        if (tp !== tq) {
                            let key = [tp, tq].sort().join('-');
                            if (markedPairs[key]) {
                                roundMarked.push(`${p}-${q}`);
                                changed = true; break;
                            }
                        }
                    }
                }
            }
        }
        if (changed) {
            roundMarked.forEach(pair => markedPairs[pair] = true);
            stepQueue.push({ 
                table: JSON.parse(JSON.stringify(markedPairs)), 
                desc: `Round ${stepQueue.length}: Marked ${roundMarked.length} new distinguishable pairs.` 
            });
        }
    }
    document.getElementById('step-controls').style.display = 'block';
    renderNextStep();
}

function renderNextStep() {
    if (currentStepIdx >= stepQueue.length) {
        document.getElementById('step-description').innerHTML = "<b style='color:var(--success)'>Minimization Complete!</b> Building the final reduced DFA.";
        document.getElementById('btn-next').disabled = true;
        finalize();
        return;
    }
    const current = stepQueue[currentStepIdx];
    document.getElementById('step-description').innerText = current.desc;

    let html = `<table><tr><th></th>${states.slice(0, -1).map(s => `<th>${s}</th>`).join('')}</tr>`;
    for (let i = 1; i < states.length; i++) {
        html += `<tr><th>${states[i]}</th>`;
        for (let j = 0; j < i; j++) {
            let key = [states[i], states[j]].sort().join('-');
            let isMarked = current.table[key];
            html += `<td class="${isMarked ? 'marked' : 'unmarked'}">${isMarked ? 'X' : ''}</td>`;
        }
        for (let k = i; k < states.length - 1; k++) html += `<td></td>`;
        html += `</tr>`;
    }
    document.getElementById('partition-box').innerHTML = html + `</table>`;
    currentStepIdx++;
}

function finalize() {
    let parent = {}; states.forEach(s => parent[s] = s);
    function find(i) { return parent[i] === i ? i : (parent[i] = find(parent[i])); }
    
    Object.keys(markedPairs).forEach(pair => {
        if (!markedPairs[pair]) {
            let [p, q] = pair.split('-');
            parent[find(p)] = find(q);
        }
    });

    let groups = {};
    states.forEach(s => {
        let root = find(s);
        if (!groups[root]) groups[root] = [];
        groups[root].push(s);
    });

    const minElems = [];
    let tableHtml = `<table class="min-table"><tr><th>Merged State</th>`;
    alpha.forEach(a => tableHtml += `<th>Input ${a}</th>`);
    tableHtml += `</tr>`;

    Object.keys(groups).forEach(id => {
        let groupLabel = `{${groups[id].sort().join(',')}}`;
        minElems.push({ data: { id: id, label: groupLabel, isFinal: groups[id].some(s => finals.includes(s)) } });
        
        tableHtml += `<tr><td><strong>${groupLabel}</strong></td>`;
        alpha.forEach(a => {
            let destRoot = find(transitions[groups[id][0]][a]);
            let destLabel = `{${groups[destRoot].sort().join(',')}}`;
            tableHtml += `<td>${destLabel}</td>`;
            minElems.push({ data: { source: id, target: destRoot, label: a } });
        });
        tableHtml += `</tr>`;
    });

    document.getElementById('min-table-area').innerHTML = tableHtml + `</table>`;
    draw('cy-min', minElems);
}

function draw(id, elems) {
    cytoscape({
        container: document.getElementById(id),
        elements: elems,
        style: [
            { selector: 'node', style: { 'label': 'data(label)', 'background-color': '#1e293b', 'border-width': 2, 'border-color': '#3b82f6', 'color': '#fff', 'text-valign': 'center', 'width': 45, 'height': 45, 'font-size': '10px' } },
            { selector: 'node[?isFinal]', style: { 'border-width': 4, 'border-style': 'double', 'border-color': '#10b981', 'background-color': '#064e3b' } },
            { selector: 'edge', style: { 'label': 'data(label)', 'width': 2, 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'line-color': '#64748b', 'color': '#94a3b8', 'font-size': '10px', 'text-outline-color': '#0f172a', 'text-outline-width': 2 } }
        ],
        layout: { name: 'circle', padding: 30 }
    });
}