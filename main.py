"""
AI Shopping Path Optimizer - Main Entry Point
=============================================
Single entry point to start the application.
Launches the Flask web server that serves the GUI and handles pathfinding requests.
"""

from gui.interface import create_app

if __name__ == '__main__':
    app = create_app()
    print("\n  AI Shopping Path Optimizer")
    print("=" * 40)
    print("  Open http://localhost:5000 in your browser")
    print("  Press Ctrl+C to stop\n")
    app.run(debug=True, port=5000)