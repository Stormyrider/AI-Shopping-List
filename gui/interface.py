"""
GUI Interface Module (Flask Web Server)
=======================================
Serves the web-based GUI and provides API endpoints
for the shopping path optimization agent.

Routes:
    GET  /           → Serves the main HTML page
    POST /api/solve  → Runs the agent and returns optimal path
    GET  /api/items  → Returns all available items
    GET  /api/graph  → Returns the supermarket graph data
"""

import os
from flask import Flask, render_template, request, jsonify
from agent import ShoppingAgent
from utils.grid import get_all_items, get_node_positions, EDGE_LIST


def create_app():
    """Create and configure the Flask application."""

    # Set template folder relative to this file
    template_dir = os.path.join(os.path.dirname(__file__), 'templates')
    app = Flask(__name__, template_folder=template_dir)

    # Create the autonomous agent
    agent = ShoppingAgent()

    # ---------------------------
    # Route: Serve main page
    # ---------------------------
    @app.route('/')
    def index():
        return render_template('index.html')

    # ---------------------------
    # API: Solve shopping path
    # ---------------------------
    @app.route('/api/solve', methods=['POST'])
    def solve():
        data = request.get_json()

        items = data.get('items', [])
        algorithm = data.get('algorithm', 'astar')

        if not items:
            return jsonify({'error': 'Shopping list is empty'}), 400

        # Run the agent
        result = agent.solve(items, algorithm)

        if 'error' in result:
            return jsonify(result), 400

        return jsonify(result)

    # ---------------------------
    # API: Get available items
    # ---------------------------
    @app.route('/api/items')
    def items():
        return jsonify(get_all_items())

    # ---------------------------
    # API: Get graph data
    # ---------------------------
    @app.route('/api/graph')
    def graph():
        positions = get_node_positions()
        nodes = {k: {'x': v[0], 'y': v[1]} for k, v in positions.items()}
        edges = [{'from': e[0], 'to': e[1]} for e in EDGE_LIST]
        return jsonify({'nodes': nodes, 'edges': edges})

    return app
