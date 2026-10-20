# Make Graph Degrees Even

My solution to a problem from a coding assessment, written in JavaScript.

## Problem

Given an undirected graph represented by its adjacency matrix `graph`, return whether or not it is possible to add **no more than two edges** to this graph in order to make the degrees of all nodes even.

In the resulting graph there must be at most one edge between any pair of nodes (no multi-edges and no self-loops).

**Input:** `graph`: a 2D boolean array representing the adjacency matrix (`1 <= graph.length <= 50`).

**Output:** `boolean`: `true` if it's possible, otherwise `false`.

## Approach

1. **Calculate degrees:** count the neighbors of every node.
2. **Find odd-degree nodes:** collect every node with an odd degree. Let `k` be the number of such nodes.
3. **Decide based on `k`:**
   - **`k = 0`:** every degree is already even, so no edges are needed. Return `true`.
   - **`k = 2`:** call the odd nodes `u` and `v`.
     - If there is no edge `(u, v)`, add it. Return `true`.
     - Otherwise, look for a node `w` that is connected to neither `u` nor `v`, and add `(u, w)` and `(v, w)`. Return `true` if such a `w` exists, otherwise `false`.
   - **`k = 4`:** there are 3 ways to pair up the four odd nodes `u1..u4` with 2 edges:
     - `(u1, u2)` and `(u3, u4)`
     - `(u1, u3)` and `(u2, u4)`
     - `(u1, u4)` and `(u2, u3)`

     Return `true` if both edges in any of these pairings are missing from the graph, otherwise `false`.
   - **`k > 4`:** adding at most 2 edges changes the parity of at most 4 nodes. Return `false`.

**Complexity:** O(n²) time to compute the degrees, O(n) extra space.

## Running

Requires [Node.js](https://nodejs.org/).

```bash
node evenDegrees.js
```

The script runs two kinds of tests:

- **Hand-written cases:** small graphs with known answers that cover every value of `k`.
- **Random tests:** 2,000 random graphs (1 to 7 nodes each), each compared with a brute-force checker that tries every way of adding 0, 1 or 2 missing edges.
