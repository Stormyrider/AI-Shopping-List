"""
Autonomous Agent Module
=======================
The ShoppingAgent is an intelligent autonomous agent that:
1. Accepts user input (shopping items)
2. Maps items to supermarket sections
3. Selects the appropriate search algorithm
4. Computes the optimal path through all required sections
5. Returns results for visualization

Agent Workflow:
    User Input → Goal Setting → Algorithm Selection → Path Computation → Result
"""

import time
from itertools import permutations
from utils.grid import get_graph, get_item_section, get_node_positions, get_all_items
from algorithms.astar import astar_search
from algorithms.bfs import bfs_search
from algorithms.dfs import dfs_search


class ShoppingAgent:
    """
    Autonomous Intelligent Agent for Shopping Path Optimization.
    
    The agent perceives the environment (supermarket graph),
    makes decisions (which algorithm + visit order),
    and acts (computes optimal path).
    """

    def __init__(self):
        # Build the environment model (supermarket graph)
        self.graph = get_graph()
        self.positions = get_node_positions()

        # Available algorithms the agent can choose from
        self.algorithms = {
            'astar': astar_search,
            'bfs':   bfs_search,
            'dfs':   dfs_search,
            # UCS is A* with zero heuristic (no estimation)
            'ucs':   lambda g, p, s, e: astar_search(g, p, s, e, use_heuristic=False),
        }

    def solve(self, shopping_list, algorithm='astar'):
        """
        Main agent method — solves the shopping path problem.

        Steps:
        1. Determine which sections contain the requested items
        2. Try all possible visit orders (permutations)
        3. For each order, compute path using selected algorithm
        4. Return the order with minimum total cost

        Args:
            shopping_list: list of item names (e.g., ["Milk", "Bread"])
            algorithm: which search algorithm to use

        Returns:
            dict with path, coordinates, metrics, etc.
        """
        start_time = time.time()

        # --- Step 1: Map items to sections ---
        sections_to_visit = set()
        found_items = {}

        for item in shopping_list:
            section = get_item_section(item)
            if section:
                sections_to_visit.add(section)
                found_items[item] = section

        if not sections_to_visit:
            return {'error': 'No valid items found in shopping list'}

        # --- Step 2: Select the search algorithm ---
        search_fn = self.algorithms.get(algorithm, astar_search)

        # --- Step 3: Find optimal visit order ---
        section_list = list(sections_to_visit)
        best_path = None
        best_cost = float('inf')
        best_explored = 0

        # Try every permutation of sections to find best order
        # (max 4 sections = 24 permutations, very fast)
        for perm in permutations(section_list):
            # Route: start → section1 → section2 → ... → checkout
            waypoints = ['start'] + list(perm) + ['checkout']

            full_path = [waypoints[0]]
            total_cost = 0
            total_explored = 0
            valid = True

            # Find path between each consecutive pair of waypoints
            for i in range(len(waypoints) - 1):
                result = search_fn(
                    self.graph, self.positions,
                    waypoints[i], waypoints[i + 1]
                )
                if result is None:
                    valid = False
                    break

                path, explored, cost = result
                total_explored += explored
                total_cost += cost
                full_path.extend(path[1:])  # skip first (avoid duplicates)

            # Keep the best (lowest cost) route
            if valid and total_cost < best_cost:
                best_path = full_path
                best_cost = total_cost
                best_explored = total_explored

        if best_path is None:
            return {'error': 'Could not find a valid path'}

        # --- Step 4: Build result ---
        elapsed_ms = round((time.time() - start_time) * 1000, 1)

        # Convert node IDs to (x, y) coordinates for visualization
        path_coords = [list(self.positions[node]) for node in best_path]

        return {
            'path':             best_path,
            'path_coords':      path_coords,
            'nodes_explored':   best_explored,
            'total_cost':       round(best_cost, 1),
            'time_ms':          elapsed_ms,
            'sections_visited': list(sections_to_visit),
            'items_found':      found_items,
            'algorithm':        algorithm,
        }
