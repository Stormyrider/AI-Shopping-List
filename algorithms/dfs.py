"""
Depth-First Search (DFS)
========================
Explores as deep as possible before backtracking.

How it works:
- Uses a STACK (LIFO — Last In, First Out)
- Goes deep into one branch before trying others
- Does NOT guarantee shortest path

Key property:
- DFS may find a path quickly but it might not be optimal
- Uses less memory than BFS in some cases
"""


def dfs_search(graph, positions, start, goal):
    """
    Depth-First Search.

    Args:
        graph:     adjacency list {node: [(neighbor, weight), ...]}
        positions: node positions (not used, kept for consistent interface)
        start:     start node ID
        goal:      goal node ID

    Returns:
        tuple (path, nodes_explored, total_cost) or None if no path
    """
    # Stack stores: (current_node, path_so_far)
    stack = [(start, [start])]

    # Track visited nodes to avoid cycles
    visited = set()

    nodes_explored = 0

    while stack:
        # Pop from top of stack (LIFO)
        current, path = stack.pop()

        if current in visited:
            continue
        visited.add(current)
        nodes_explored += 1

        # Goal reached — calculate cost and return
        if current == goal:
            total_cost = 0
            for i in range(len(path) - 1):
                for neighbor, weight in graph.get(path[i], []):
                    if neighbor == path[i + 1]:
                        total_cost += weight
                        break
            return (path, nodes_explored, round(total_cost, 1))

        # Push all unvisited neighbors onto stack
        for neighbor, weight in graph.get(current, []):
            if neighbor not in visited:
                stack.append((neighbor, path + [neighbor]))

    return None  # No path found
