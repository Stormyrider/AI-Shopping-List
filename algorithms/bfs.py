"""
Breadth-First Search (BFS)
==========================
Explores nodes level by level (closest first).

How it works:
- Uses a QUEUE (FIFO — First In, First Out)
- Visits all neighbors at depth d before depth d+1
- Guarantees shortest path in UNWEIGHTED graphs

Key property:
- BFS finds the path with fewest edges (hops)
- Does NOT consider edge weights
"""

from collections import deque


def bfs_search(graph, positions, start, goal):
    """
    Breadth-First Search.

    Args:
        graph:     adjacency list {node: [(neighbor, weight), ...]}
        positions: node positions (not used, kept for consistent interface)
        start:     start node ID
        goal:      goal node ID

    Returns:
        tuple (path, nodes_explored, total_cost) or None if no path
    """
    # Queue stores: (current_node, path_so_far)
    queue = deque([(start, [start])])

    # Track visited nodes to avoid revisiting
    visited = {start}

    nodes_explored = 0

    while queue:
        # Dequeue the front node (FIFO)
        current, path = queue.popleft()
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

        # Add all unvisited neighbors to queue
        for neighbor, weight in graph.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))

    return None  # No path found
