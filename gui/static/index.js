// =============================================
// GRAPH DATA (mirrors backend utils/grid.py)
// =============================================
const GRAPH_NODES = {
    'start':    {x: 100, y: 700},
    'b1':       {x: 300, y: 700},
    'b2':       {x: 500, y: 700},
    'b3':       {x: 700, y: 700},
    'checkout': {x: 900, y: 700},

    'm1':       {x: 100, y: 400},
    'm2':       {x: 300, y: 400},
    'm3':       {x: 500, y: 400},
    'm4':       {x: 700, y: 400},
    'm5':       {x: 900, y: 400},

    't1':       {x: 100, y: 100},
    't2':       {x: 300, y: 100},
    't3':       {x: 500, y: 100},
    't4':       {x: 700, y: 100},
    't5':       {x: 900, y: 100},

    'produce':  {x: 300, y: 250},
    'bakery':   {x: 600, y: 250},
    'frozen':   {x: 900, y: 250},
    'dairy':    {x: 300, y: 550},
};

const GRAPH_EDGES = [
    ['start','b1'], ['b1','b2'], ['b2','b3'], ['b3','checkout'],
    ['start','m1'], ['m1','t1'],
    ['b1','dairy'], ['dairy','m2'], ['m2','produce'], ['produce','t2'],
    ['b2','m3'], ['m3','t3'],
    ['b3','m4'], ['m4','t4'],
    ['checkout','m5'], ['m5','frozen'], ['frozen','t5'],
    ['m1','m2'], ['m2','m3'], ['m3','m4'], ['m4','m5'],
    ['t1','t2'], ['t2','t3'], ['t3','t4'], ['t4','t5'],
    ['t3','bakery'], ['t4','bakery'], ['m3','bakery'], ['m4','bakery'],
];

const SECTION_ITEMS = {
    'produce': ['Apples', 'Bananas', 'Tomatoes', 'Lettuce', 'Onions'],
    'bakery':  ['Bread', 'Cake', 'Cookies', 'Muffins'],
    'dairy':   ['Milk', 'Cheese', 'Yogurt', 'Eggs', 'Butter'],
    'frozen':  ['Ice Cream', 'Pizza', 'Frozen Vegs', 'Fish Sticks'],
};

const SECTION_COLORS = {
    'produce': '#10b981',
    'bakery':  '#d97706',
    'dairy':   '#3b82f6',
    'frozen':  '#38bdf8',
};

const SECTION_ICONS = {
    'produce': 'eco',
    'bakery':  'bakery_dining',
    'dairy':   'water_drop',
    'frozen':  'ac_unit',
};

// =============================================
// APPLICATION STATE
// =============================================
let selectedAlgorithm = 'astar';
let shoppingList = [];
let isRunning = false;
let animationTimeout = null;

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    renderGraph();
    renderItemSuggestions();
    renderSelectedItems();
});

// =============================================
// RENDER GRAPH (Nodes & Edges on SVG)
// =============================================
function renderGraph() {
    const edgesGroup = document.getElementById('edges-group');
    const nodesGroup = document.getElementById('nodes-group');
    const labelsGroup = document.getElementById('labels-group');

    edgesGroup.innerHTML = '';
    nodesGroup.innerHTML = '';
    labelsGroup.innerHTML = '';

    // Draw edges as faint lines
    GRAPH_EDGES.forEach(([n1, n2]) => {
        const p1 = GRAPH_NODES[n1];
        const p2 = GRAPH_NODES[n2];
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
        line.setAttribute('x2', p2.x); line.setAttribute('y2', p2.y);
        line.setAttribute('stroke', '#cbd5e1');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('opacity', '0.6');
        edgesGroup.appendChild(line);
    });

    // Draw nodes
    const sectionNames = ['produce', 'bakery', 'frozen', 'dairy'];
    const specialNames = ['start', 'checkout'];

    Object.entries(GRAPH_NODES).forEach(([id, pos], i) => {
        const isSection = sectionNames.includes(id);
        const isSpecial = specialNames.includes(id);
        const isCorridor = !isSection && !isSpecial;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', pos.x);
        circle.setAttribute('cy', pos.y);
        circle.setAttribute('class', 'map-node');
        circle.style.animationDelay = (i * 0.05) + 's';

        if (isSection) {
            circle.setAttribute('r', '10');
            circle.setAttribute('fill', SECTION_COLORS[id] || '#007AFF');
            circle.setAttribute('stroke', 'white');
            circle.setAttribute('stroke-width', '3');
            circle.setAttribute('filter', 'url(#node-glow)');
        } else if (id === 'start') {
            circle.setAttribute('r', '9');
            circle.setAttribute('fill', '#10b981');
            circle.setAttribute('stroke', 'white');
            circle.setAttribute('stroke-width', '3');
        } else if (id === 'checkout') {
            circle.setAttribute('r', '9');
            circle.setAttribute('fill', '#f59e0b');
            circle.setAttribute('stroke', 'white');
            circle.setAttribute('stroke-width', '3');
        } else {
            circle.setAttribute('r', '5');
            circle.setAttribute('fill', '#94a3b8');
            circle.setAttribute('stroke', 'white');
            circle.setAttribute('stroke-width', '2');
        }

        circle.id = 'node-' + id;
        nodesGroup.appendChild(circle);

        // Labels for important nodes
        if (isSection || isSpecial) {
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', pos.x);
            label.setAttribute('y', pos.y - 18);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-size', '11');
            label.setAttribute('font-weight', '800');
            label.setAttribute('font-family', 'Inter, sans-serif');
            label.setAttribute('fill', isSection ? SECTION_COLORS[id] : (id === 'start' ? '#10b981' : '#f59e0b'));
            label.setAttribute('letter-spacing', '0.05em');
            let displayName = id.charAt(0).toUpperCase() + id.slice(1);
            if (id === 'start') displayName = '🚪 Entrance';
            if (id === 'checkout') displayName = '🏁 Checkout';
            label.textContent = displayName;
            labelsGroup.appendChild(label);
        }
    });
}

// =============================================
// ITEM SUGGESTIONS
// =============================================
function renderItemSuggestions() {
    const container = document.getElementById('item-suggestions');
    container.innerHTML = '';

    Object.entries(SECTION_ITEMS).forEach(([section, items]) => {
        const sectionDiv = document.createElement('div');
        const color = SECTION_COLORS[section] || '#007AFF';

        sectionDiv.innerHTML = '<div class="flex items-center gap-1 mb-1"><span class="material-symbols-outlined text-sm" style="color:' + color + '">' +
            (SECTION_ICONS[section] || 'category') + '</span><span class="text-[10px] font-bold uppercase tracking-wider" style="color:' + color + '">' +
            section + '</span></div>';

        const chipsDiv = document.createElement('div');
        chipsDiv.className = 'flex flex-wrap gap-1.5';

        items.forEach(item => {
            const chip = document.createElement('button');
            chip.className = 'item-chip px-3 py-1 rounded-full text-xs font-semibold border';
            chip.style.borderColor = color + '40';
            chip.style.color = color;
            chip.style.background = color + '10';
            chip.textContent = item;
            chip.dataset.item = item;
            chip.onclick = () => toggleItem(item, chip, color);
            chipsDiv.appendChild(chip);
        });

        sectionDiv.appendChild(chipsDiv);
        container.appendChild(sectionDiv);
    });
}

// =============================================
// SHOPPING LIST MANAGEMENT
// =============================================
function toggleItem(item, chipEl, color) {
    const idx = shoppingList.indexOf(item);
    if (idx >= 0) {
        shoppingList.splice(idx, 1);
        chipEl.classList.remove('selected');
        chipEl.style.background = color + '10';
        chipEl.style.color = color;
    } else {
        shoppingList.push(item);
        chipEl.classList.add('selected');
        chipEl.style.background = '#007AFF';
        chipEl.style.color = 'white';
    }
    renderSelectedItems();
}

function addItemFromInput() {
    const input = document.getElementById('shopping-input');
    const val = input.value.trim();
    if (!val) return;

    // Try to match against known items
    const allItems = Object.values(SECTION_ITEMS).flat();
    const matched = allItems.find(i => i.toLowerCase() === val.toLowerCase());

    if (matched && !shoppingList.includes(matched)) {
        shoppingList.push(matched);
        // Also highlight the chip
        const chips = document.querySelectorAll('.item-chip');
        chips.forEach(c => {
            if (c.dataset.item === matched) {
                c.classList.add('selected');
                c.style.background = '#007AFF';
                c.style.color = 'white';
            }
        });
        renderSelectedItems();
    } else if (!matched) {
        // Flash input to show invalid
        input.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.3)';
        setTimeout(() => input.style.boxShadow = '', 800);
    }
    input.value = '';
}

function removeItem(item) {
    shoppingList = shoppingList.filter(i => i !== item);
    // Deselect the chip
    const chips = document.querySelectorAll('.item-chip');
    chips.forEach(c => {
        if (c.dataset.item === item) {
            c.classList.remove('selected');
            const section = Object.entries(SECTION_ITEMS).find(([_, items]) => items.includes(item));
            if (section) {
                const color = SECTION_COLORS[section[0]];
                c.style.background = color + '10';
                c.style.color = color;
            }
        }
    });
    renderSelectedItems();
}

function renderSelectedItems() {
    const container = document.getElementById('selected-items');
    if (shoppingList.length === 0) {
        container.innerHTML = '<span class="text-xs text-slate-400 italic">No items selected</span>';
        return;
    }
    container.innerHTML = shoppingList.map(item =>
        '<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">' +
        item +
        '<button onclick="removeItem(\'' + item + '\')" class="ml-1 hover:text-red-500 transition-colors">&times;</button>' +
        '</span>'
    ).join('');
}

// =============================================
// ALGORITHM SELECTION
// =============================================
function selectAlgorithm(algo) {
    selectedAlgorithm = algo;
    const btns = document.querySelectorAll('#algo-buttons button');
    btns.forEach(btn => {
        if (btn.id === 'algo-' + algo) {
            btn.className = 'bg-primary text-white px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-md';
        } else {
            btn.className = 'bg-surface-container-high text-on-surface px-4 py-3 rounded-xl font-bold text-sm hover:bg-white transition-all';
        }
    });
}

// =============================================
// RUN AGENT (Call Backend API)
// =============================================
async function runAgent() {
    if (isRunning) return;
    if (shoppingList.length === 0) {
        // Flash the shopping list area
        const inputEl = document.getElementById('shopping-input');
        inputEl.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.3)';
        inputEl.placeholder = 'Please add items first!';
        setTimeout(() => {
            inputEl.style.boxShadow = '';
            inputEl.placeholder = 'Type item name...';
        }, 1500);
        return;
    }

    isRunning = true;
    setStatus('calculating', 'Path Calculating...');

    // Update button state
    const runBtn = document.getElementById('run-btn');
    runBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span> Computing...';
    runBtn.style.opacity = '0.7';

    try {
        const response = await fetch('/api/solve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: shoppingList,
                algorithm: selectedAlgorithm,
            }),
        });

        const data = await response.json();

        if (data.error) {
            setStatus('error', 'Error: ' + data.error);
            return;
        }

        // Update metrics
        document.getElementById('metric-time').textContent = data.time_ms + 'ms';
        document.getElementById('metric-nodes').textContent = data.nodes_explored;
        document.getElementById('metric-cost').textContent = data.total_cost + 'px';

        // Draw path on SVG
        drawPath(data.path_coords);

        // Highlight visited section nodes
        highlightSections(data.sections_visited);

        // Animate the agent along the path
        animateAgent(data.path_coords);

        setStatus('done', 'Path Found!');

    } catch (err) {
        console.error(err);
        setStatus('error', 'Connection error');
    } finally {
        isRunning = false;
        runBtn.innerHTML = '<span class="material-symbols-outlined">play_arrow</span> Run Agent';
        runBtn.style.opacity = '1';
    }
}

// =============================================
// DRAW PATH ON SVG
// =============================================
function drawPath(coords) {
    const pathGroup = document.getElementById('path-group');
    pathGroup.innerHTML = '';

    if (!coords || coords.length < 2) return;

    // Build SVG path string
    let d = 'M ' + coords[0][0] + ' ' + coords[0][1];
    for (let i = 1; i < coords.length; i++) {
        d += ' L ' + coords[i][0] + ' ' + coords[i][1];
    }

    // Glow layer
    const glowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glowPath.setAttribute('d', d);
    glowPath.setAttribute('fill', 'none');
    glowPath.setAttribute('stroke', '#007AFF');
    glowPath.setAttribute('stroke-width', '8');
    glowPath.setAttribute('stroke-linecap', 'round');
    glowPath.setAttribute('stroke-linejoin', 'round');
    glowPath.setAttribute('opacity', '0.2');
    glowPath.setAttribute('filter', 'url(#glow)');
    pathGroup.appendChild(glowPath);

    // Main path line with animation
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', d);
    pathEl.setAttribute('fill', 'none');
    pathEl.setAttribute('stroke', '#007AFF');
    pathEl.setAttribute('stroke-width', '4');
    pathEl.setAttribute('stroke-linecap', 'round');
    pathEl.setAttribute('stroke-linejoin', 'round');
    pathEl.setAttribute('filter', 'url(#glow)');

    // Animated dash
    const totalLen = pathEl.getTotalLength ? pathEl.getTotalLength() : 2000;
    pathEl.style.strokeDasharray = totalLen;
    pathEl.style.strokeDashoffset = totalLen;
    pathEl.style.animation = 'drawPath 2.5s ease-in-out forwards';
    pathGroup.appendChild(pathEl);

    // Draw waypoint markers along path
    coords.forEach((coord, i) => {
        if (i === 0 || i === coords.length - 1) {
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            marker.setAttribute('cx', coord[0]);
            marker.setAttribute('cy', coord[1]);
            marker.setAttribute('r', '7');
            marker.setAttribute('fill', i === 0 ? '#10b981' : '#f59e0b');
            marker.setAttribute('stroke', 'white');
            marker.setAttribute('stroke-width', '3');
            pathGroup.appendChild(marker);
        }
    });
}

// =============================================
// HIGHLIGHT VISITED SECTIONS
// =============================================
function highlightSections(sections) {
    const sectionNodes = ['produce', 'bakery', 'frozen', 'dairy'];
    sectionNodes.forEach(s => {
        const nodeEl = document.getElementById('node-' + s);
        if (nodeEl) {
            if (sections.includes(s)) {
                nodeEl.setAttribute('r', '14');
                nodeEl.setAttribute('stroke-width', '4');
                nodeEl.style.animation = 'glowPulse 1.5s ease-in-out infinite';
            } else {
                nodeEl.setAttribute('r', '10');
                nodeEl.setAttribute('stroke-width', '3');
                nodeEl.style.animation = '';
            }
        }
    });
}

// =============================================
// ANIMATE AGENT ALONG PATH
// =============================================
function animateAgent(coords) {
    if (animationTimeout) clearTimeout(animationTimeout);

    const agent = document.getElementById('agent-avatar');
    agent.classList.remove('agent-float');
    agent.classList.add('agent-moving');

    let step = 0;
    const speed = 350; // ms per step

    function moveNext() {
        if (step >= coords.length) {
            agent.classList.remove('agent-moving');
            agent.classList.add('agent-float');
            return;
        }

        const x = coords[step][0];
        const y = coords[step][1];

        // Convert SVG coords (0-1000, 0-600) to percentage of container
        const leftPct = (x / 1000) * 100;
        const topPct = (y / 600) * 100;

        agent.style.left = leftPct + '%';
        agent.style.top = topPct + '%';

        step++;
        animationTimeout = setTimeout(moveNext, speed);
    }

    moveNext();
}

// =============================================
// STATUS BADGE
// =============================================
function setStatus(type, text) {
    const dot = document.getElementById('status-dot');
    const txt = document.getElementById('status-text');
    txt.textContent = text;

    switch(type) {
        case 'calculating':
            dot.className = 'w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping';
            break;
        case 'done':
            dot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-500';
            break;
        case 'error':
            dot.className = 'w-1.5 h-1.5 rounded-full bg-red-500';
            break;
        default:
            dot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-500';
    }
}