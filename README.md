# 🛒 AI Shopping Path Optimizer (Supermarket)

## 📌 Project Overview

The **AI Shopping Path Optimizer** is an intelligent autonomous agent designed to help users find the most efficient path inside a supermarket to collect items from their shopping list.

The system uses AI search algorithms to compute optimal routes, minimizing time, distance, or cost. It includes a web-based GUI interface where users can input their shopping list and visualize the optimized path.

## 🎯 Objective

- Design and implement an intelligent agent system
- Demonstrate AI-based decision making
- Apply search algorithms to solve real-world problems
- Provide user interaction through GUI

## 🤖 Autonomous Agent Design

```
User Input (Shopping List)
        ↓
Agent Goal (Find Optimal Path)
        ↓
Decision / Planner (Select Algorithm)
        ↓
Algorithm Execution (Pathfinding)
        ↓
Result (Optimized Route Displayed)
```

### Agent Responsibilities:
- Accept user input (shopping items)
- Convert supermarket into a graph
- Decide which algorithm to use
- Compute optimal path automatically
- Display results visually

## 🧠 AI Algorithms Used

| Algorithm | Type | Optimal? | Data Structure |
|-----------|------|----------|---------------|
| **A\* Search** | Informed | ✅ Yes | Priority Queue |
| **BFS** | Uninformed | ✅ (unweighted) | Queue (FIFO) |
| **DFS** | Uninformed | ❌ No | Stack (LIFO) |
| **UCS** | Uninformed | ✅ Yes | Priority Queue |

### ✔ Recommended: A* Search
- Finds the shortest path efficiently
- Uses heuristics (Euclidean distance)
- Suitable for graph-based supermarket layout

## 🏪 Problem Description

In supermarkets, customers often:
- Waste time finding items
- Walk inefficient paths
- Miss optimal routes

### Solution:
This system maps the supermarket layout as a graph, marks item locations, and calculates the best path covering all items.

## 📂 Project Structure

```
AI-Shopping-Path-Optimizer/
│── main.py                  # Entry point — starts the web server
│── agent.py                 # Autonomous agent logic
│── algorithms/
│     ├── __init__.py
│     ├── astar.py           # A* Search implementation
│     ├── bfs.py             # BFS implementation
│     ├── dfs.py             # DFS implementation
│── gui/
│     ├── __init__.py
│     ├── interface.py       # Flask web server & API routes
│     ├── templates/
│           ├── index.html   # Web-based GUI
│── utils/
│     ├── __init__.py
│     ├── grid.py            # Supermarket graph definition
│── requirements.txt
│── README.md
```

## 🚀 How to Run

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Application
```bash
python main.py
```

### 3. Open in Browser
Navigate to: **http://localhost:5000**

## 🖥️ GUI Features

- ✅ Select search algorithm (A*, BFS, DFS, UCS)
- ✅ Input shopping list (click items or type)
- ✅ Visualize supermarket graph with nodes and edges
- ✅ Animated optimal path display
- ✅ Agent (shopping cart) moves along the path
- ✅ Performance metrics (time, nodes explored, path cost)

## ⚙️ System Features

- 🗺 Supermarket layout simulation (graph-based)
- 📍 Item location mapping (4 sections, 18 items)
- 🧮 Pathfinding using AI algorithms
- 🔄 Multiple algorithm comparison
- 📊 Performance metrics display

## 🧪 Expected Outcomes

- ✅ Correct implementation of AI algorithms
- ✅ Understanding of agent-based systems
- ✅ Integration of logic + algorithms
- ✅ Web-based GUI visualization

## 🔮 Future Enhancements

- Real supermarket integration
- Dynamic obstacle handling (crowds)
- Multi-user optimization
- Mobile app version
- Voice-based input

## 👨‍💻 Team Members

- Member 1
- Member 2
- Member 3
- Member 4

## 🏁 Conclusion

This project demonstrates how AI-powered autonomous agents can solve real-world optimization problems efficiently. It combines search algorithms, decision-making, and GUI interaction into a complete intelligent system.
