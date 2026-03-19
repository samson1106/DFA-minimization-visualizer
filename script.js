let transitions = {};

// Generates the interactive input table based on states and alphabet
function initTable() {
    const states = document.getElementById('states').value.split(',').map(s => s.trim());
    const alphabet = document.getElementById('alphabet').value.split(',').map(a => a.trim());
    let html = `<table><tr><th>From State</th>`;
    alphabet.forEach(a => html += `<th>On Input ${a}</th>`);
    html += `</tr>`;
    states.forEach(s => {
        html += `<tr><td><strong>${s}</strong></td>`;
        alphabet.forEach(a => html += `<td><input type="text" class="cell" data-f="${s}" data-s="${a}" placeholder="to..."></td>`);
        html += `</tr>`;
    });
    document.getElementById('table-area').innerHTML = html + `</table>`;
    document.getElementById('trans-card').style.display = 'block';
}

function processMinimization() {
    const states = document.getElementById('states').value.split(',').map(s => s.trim());
    const alpha = document.getElementById('alphabet').value.split(',').map(a => a.trim());
    const finals = document.getElementById('finals').value.split(',').map(f => f.trim());

    // 1. Build Original Elements
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

    // 2. Myhill-Nerode Minimization Logic
    let marked = {};
    states.forEach((p, i) => {
        states.slice(i+1).forEach(q => {
            marked[`${p}-${q}`] = (finals.includes(p) !== finals.includes(q));
        });
    });

    let changed = true;
    while(changed) {
        changed = false;
        states.forEach((p, i) => {
            states.slice(i+1).forEach(q => {
                if(!marked[`${p}-${q}`]) {
                    alpha.forEach(a => {
                        let tp = transitions[p][a], tq = transitions[q][a];
                        if(tp !== tq) {
                            let pair = [tp, tq].sort().join('-');
                            if(marked[pair]) { marked[`${p}-${q}`] = true; changed = true; }
                        }
                    });
                }
            });
        });
    }

    // 3. Grouping States
    let parent = {}; states.forEach(s => parent[s] = s);
    function find(i) { return parent[i] === i ? i : (parent[i] = find(parent[i])); }
    states.forEach((p, i) => {
        states.slice(i+1).forEach(q => {
            if(!marked[`${p}-${q}`]) parent[find(p)] = find(q);
        });
    });

    let groups = {};
    states.forEach(s => {
        let root = find(s);
        if(!groups[root]) groups[root] = [];
        groups[root].push(s);
    });

    // 4. Generate NEW Transition Table and Elements
    let logHtml = `<table><tr><th>Grouped State</th>`;
    alpha.forEach(a => logHtml += `<th>Input ${a}</th>`);
    logHtml += "</tr>";

    const minElems = [];
    Object.keys(groups).forEach(id => {
        let combinedLabel = groups[id].sort().join('');
        let isFinalGroup = groups[id].some(s => finals.includes(s));
        minElems.push({ data: { id: id, label: `{${combinedLabel}}`, isFinal: isFinalGroup } });

        let row = `<tr><td><strong>{${combinedLabel}}</strong></td>`;
        alpha.forEach(a => {
            let dest = transitions[groups[id][0]][a];
            let destRoot = find(dest);
            let destLabel = groups[destRoot].sort().join('');
            row += `<td>{${destLabel}}</td>`;
            minElems.push({ data: { source: id, target: destRoot, label: a } });
        });
        logHtml += row + "</tr>";
    });

    // FIX: Update the Transition Table Container
    document.getElementById('log').innerHTML = logHtml + "</table>";

    draw('cy-min', minElems);
}

// STYLED DRAW FUNCTION
function draw(id, elems) {
    cytoscape({
        container: document.getElementById(id),
        elements: elems,
        style: [
            {
                // REGULAR STATE (Single Circle)
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'background-color': '#ffffff',
                    'color': '#1e293b',
                    'text-valign': 'center',
                    'width': '50px',
                    'height': '50px',
                    'font-size': '12px',
                    'border-width': '2px',
                    'border-style': 'solid',
                    'border-color': '#334155'
                }
            },
            {
                // FINAL STATE (Double Circle)
                selector: 'node[?isFinal]',
                style: {
                    'background-color': '#dcfce7',
                    'border-width': '6px',
                    'border-style': 'double',
                    'border-color': '#10b981',
                    'font-weight': 'bold'
                }
            },
            {
                selector: 'edge',
                style: {
                    'label': 'data(label)',
                    'width': 2,
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'line-color': '#94a3b8',
                    'target-arrow-color': '#94a3b8',
                    'text-margin-y': -10
                }
            }
        ],
        layout: { name: 'circle', padding: 40 }
    });
}