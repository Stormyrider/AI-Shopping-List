"""
A* Search Algorithm
===================
Finds the SHORTEST path between two nodes using a heuristic.

How it works:
- Uses f(n) = g(n) + h(n)
  - g(n) = actual cost from start to current node
  - h(n) = estimated cost from current to goal (heuristic)
- Always expands the node with the lowest f(n) first
- Guarantees optimal path when heuristic is admissible

Why A* is best for this problem:
- Finds shortest path efficiently
- Uses Euclidean distance as heuristic
- Perfect for grid/graph-based supermarket layouts
"""

import heapq
import math


def heuristic(pos1, pos2):
    """
    Euclidean distance heuristic.
    Estimates straight-line distance between two points.
    This is admissible (never overestimates) so A* finds optimal path.
    """
    return math.sqrt((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2)


def astar_search(graph, positions, start, goal, use_heuristic=True):
    """
    A* Search Algorithm.

    Args:
        graph:         adjacency list {node: [(neighbor, weight), ...]}
        positions:     node positions {node: (x, y)} for heuristic
        start:         start node ID
        goal:          goal node ID
        use_heuristic: if False, becomes UCS (Uniform Cost Search)

    Returns:
        tuple (path, nodes_explored, total_cost) or None if no path
    """
    # Priority queue: (f_score, node)
    open_set = [(0, start)]

    # Track where we came from to reconstruct path
    came_from = {}

    # g_score[n] = cheapest cost from start to n
    g_score = {start: 0}

    # Count nodes we explore
    nodes_explored = 0

    while open_set:
        # Pick node with lowest f_score
        _, current = heapq.heappop(open_set)
        nodes_explored += 1

        # Goal reached — reconstruct and return path
        if current == goal:
            path = []
            node = current
            while node in came_from:
                path.append(node)
                node = came_from[node]
            path.append(start)
            path.reverse()
            return (path, nodes_explored, g_score[goal])

        # Explore each neighbor
        for neighbor, weight in graph.get(current, []):
            new_g = g_score[current] + weight

            # Only proceed if we found a cheaper path to neighbor
            if new_g < g_score.get(neighbor, float('inf')):
                came_from[neighbor] = current
                g_score[neighbor] = new_g

                # f = g + h  (if heuristic disabled, h=0 → becomes UCS)
                if use_heuristic:
                    h = heuristic(positions[neighbor], positions[goal])
                else:
                    h = 0
                f = new_g + h

                heapq.heappush(open_set, (f, neighbor))

    return None  # No path found
