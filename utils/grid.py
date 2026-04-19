"""
Supermarket Grid / Graph Module
================================
Defines the supermarket layout as a graph.

The supermarket is modeled as:
- NODES: locations in the store (corridors, sections, entrance, checkout)
- EDGES: walkable paths connecting nodes
- ITEMS: products available at each section

Node positions map to SVG coordinates (viewBox 0 0 1000 600)
for visualization on the frontend.
"""

import math

# ============================================================
# NODE POSITIONS — (x, y) coordinates for SVG visualization
# ============================================================
NODES = {
    # --- Entrance / Bottom Row (y=700) ---
    'start':    (100, 700),
    'b1':       (300, 700),
    'b2':       (500, 700),
    'b3':       (700, 700),
    'checkout': (900, 700),

    # --- Middle Corridor (y=400) ---
    'm1':       (100, 400),
    'm2':       (300, 400),
    'm3':       (500, 400),
    'm4':       (700, 400),
    'm5':       (900, 400),

    # --- Top Corridor (y=100) ---
    't1':       (100, 100),
    't2':       (300, 100),
    't3':       (500, 100),
    't4':       (700, 100),
    't5':       (900, 100),

    # --- Section nodes (where items are located) ---
    'produce':  (300, 250),     # Between t2 and m2
    'bakery':   (600, 250),     # Between t3/t4 and m3/m4
    'frozen':   (900, 250),     # Between t5 and m5
    'dairy':    (300, 550),     # Between m2 and b1
}

# ============================================================
# EDGES — Walkable connections between nodes
# ============================================================
EDGE_LIST = [
    # Bottom corridor (horizontal)
    ('start', 'b1'), ('b1', 'b2'), ('b2', 'b3'), ('b3', 'checkout'),

    # Left column (vertical)
    ('start', 'm1'), ('m1', 't1'),

    # Produce & Dairy column (vertical)
    ('b1', 'dairy'), ('dairy', 'm2'), ('m2', 'produce'), ('produce', 't2'),

    # Third & Fourth columns (vertical corridors)
    ('b2', 'm3'), ('m3', 't3'),
    ('b3', 'm4'), ('m4', 't4'),

    # Frozen & Checkout column (vertical)
    ('checkout', 'm5'), ('m5', 'frozen'), ('frozen', 't5'),

    # Middle corridor (horizontal)
    ('m1', 'm2'), ('m2', 'm3'), ('m3', 'm4'), ('m4', 'm5'),

    # Top corridor (horizontal)
    ('t1', 't2'), ('t2', 't3'), ('t3', 't4'), ('t4', 't5'),

    # Bakery connects to all 4 surrounding corners
    ('t3', 'bakery'), ('t4', 'bakery'), ('m3', 'bakery'), ('m4', 'bakery'),
]

# ============================================================
# ITEMS — Products available at each section
# ============================================================
SECTION_ITEMS = {
    'produce': ['Apples', 'Bananas', 'Tomatoes', 'Lettuce', 'Onions'],
    'bakery':  ['Bread', 'Cake', 'Cookies', 'Muffins'],
    'dairy':   ['Milk', 'Cheese', 'Yogurt', 'Eggs', 'Butter'],
    'frozen':  ['Ice Cream', 'Pizza', 'Frozen Vegs', 'Fish Sticks'],
}


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def _distance(pos1, pos2):
    """Calculate Euclidean distance between two (x,y) positions."""
    return math.sqrt((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2)


def get_graph():
    """
    Build adjacency list from the edge list.
    Returns: {node_id: [(neighbor_id, distance), ...]}
    Each edge is bidirectional.
    """
    graph = {node: [] for node in NODES}

    for n1, n2 in EDGE_LIST:
        dist = round(_distance(NODES[n1], NODES[n2]), 1)
        graph[n1].append((n2, dist))
        graph[n2].append((n1, dist))   # bidirectional

    return graph


def get_node_positions():
    """Return dict of node positions {node_id: (x, y)}."""
    return dict(NODES)


def get_item_section(item):
    """
    Find which section contains a given item.
    Returns section name or None.
    """
    item_lower = item.strip().lower()
    for section, items in SECTION_ITEMS.items():
        for section_item in items:
            if section_item.lower() == item_lower:
                return section
    return None


def get_all_items():
    """Return all available items grouped by section."""
    return dict(SECTION_ITEMS)
