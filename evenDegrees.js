
/**
 * Problem Description
 * -------------------
 * Given an undirected graph represented by its adjacency matrix `graph`, return
 * whether or not it is possible to add no more than two edges to this graph in
 * order to make the degrees of all nodes even. Keep in mind that in the resulting
 * graph, there should be at most one edge between any pair of nodes
 * (no multi-edges and no self-loops).
 *
 * Input / Output Constraints
 * --------------------------
 *  - Input:  graph — a 2D boolean array representing the adjacency matrix
 *            (1 <= graph.length <= 50).
 *  - Output: boolean — return true if it's possible, otherwise false.
 *
 * Approach & Logic
 * ----------------
 *  1. Calculate degrees: count the degree (number of connected neighbors) of every node.
 *  2. Find odd-degree nodes: collect all nodes with an odd degree. Let k be their count.
 *  3. Analyze cases based on k:
 *     - k = 0: all degrees are already even, 0 edges needed -> true.
 *     - k = 2: let the odd nodes be u and v.
 *         * If there is no edge (u, v), add it -> true.
 *         * Otherwise, look for an intermediate node w not connected to either
 *           u or v, and add edges (u, w) and (v, w) -> true (otherwise false).
 *     - k = 4: let the odd nodes be u1, u2, u3, u4. Check the 3 ways to pair them:
 *         * (u1, u2) and (u3, u4)
 *         * (u1, u3) and (u2, u4)
 *         * (u1, u4) and (u2, u3)
 *       If any pairing uses only edges that don't already exist -> true, otherwise false.
 *     - k > 4: adding <= 2 edges changes the parity of at most 4 nodes -> false.
 *
 * Run: node evenDegrees.js
 */

function solution(graph) {
    const n = graph.length;
    const degrees = new Array(n).fill(0);

    // Step 1: Calculate the degree of each node
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (graph[i][j]) {
                degrees[i]++;
            }
        }
    }

    // Step 2: Find all nodes with odd degrees
    const oddNodes = [];
    for (let i = 0; i < n; i++) {
        if (degrees[i] % 2 !== 0) {
            oddNodes.push(i);
        }
    }

    const k = oddNodes.length;

    // Case 0: All nodes already have even degrees
    if (k === 0) {
        return true;
    }

    // Case 2: Exactly two nodes have odd degrees
    if (k === 2) {
        const [u, v] = oddNodes;
        // If edge (u, v) does not exist, add 1 edge
        if (!graph[u][v]) {
            return true;
        }
        // Otherwise, check for a common node w with even degree
        for (let w = 0; w < n; w++) {
            if (w !== u && w !== v && degrees[w] % 2 === 0 && !graph[u][w] && !graph[v][w]) {
                return true;
            }
        }
        return false;
    }

    // Case 4: Exactly four nodes have odd degrees
    if (k === 4) {
        const [u1, u2, u3, u4] = oddNodes;
        const p1 = !graph[u1][u2] && !graph[u3][u4];
        const p2 = !graph[u1][u3] && !graph[u2][u4];
        const p3 = !graph[u1][u4] && !graph[u2][u3];

        return p1 || p2 || p3;
    }

    // More than 4 odd-degree nodes cannot be fixed with at most 2 edges
    return false;
}

// ---------------------------------------------------------------------------
// Testing helpers
// ---------------------------------------------------------------------------

// Build an n x n boolean adjacency matrix from an edge list.
function buildGraph(n, edges) {
    const g = Array.from({ length: n }, () => new Array(n).fill(false));
    for (const [a, b] of edges) {
        g[a][b] = true;
        g[b][a] = true;
    }
    return g;
}

// Brute force: try adding every possible set of 0, 1 or 2 missing edges.
function bruteForce(graph) {
    const n = graph.length;
    const allEven = (g) => g.every((row) => row.filter(Boolean).length % 2 === 0);
    const missing = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (!graph[i][j]) missing.push([i, j]);
        }
    }
    const withEdges = (edges) => {
        const g = graph.map((row) => row.slice());
        for (const [a, b] of edges) g[a][b] = g[b][a] = true;
        return g;
    };
    if (allEven(graph)) return true;
    for (let x = 0; x < missing.length; x++) {
        if (allEven(withEdges([missing[x]]))) return true;
        for (let y = x + 1; y < missing.length; y++) {
            if (allEven(withEdges([missing[x], missing[y]]))) return true;
        }
    }
    return false;
}

// ---------------------------------------------------------------------------
// Hand-written test cases
// ---------------------------------------------------------------------------

const tests = [
    { name: "Single node, no edges", graph: buildGraph(1, []), expected: true },
    { name: "Two nodes, no edges", graph: buildGraph(2, []), expected: true },
    { name: "Two nodes, one edge (k=2, u-v connected, no helper)", graph: buildGraph(2, [[0, 1]]), expected: false },
    { name: "Path 0-1-2 (k=2, endpoints not connected)", graph: buildGraph(3, [[0, 1], [1, 2]]), expected: true },
    { name: "Edge 0-1 plus isolated node 2 (k=2, use helper w=2)", graph: buildGraph(3, [[0, 1]]), expected: true },
    { name: "Triangle (already even)", graph: buildGraph(3, [[0, 1], [1, 2], [0, 2]]), expected: true },
    { name: "Two disjoint edges 0-1, 2-3 (k=4)", graph: buildGraph(4, [[0, 1], [2, 3]]), expected: true },
    { name: "Star with center 0 and 3 leaves (k=4)", graph: buildGraph(4, [[0, 1], [0, 2], [0, 3]]), expected: false },
    { name: "Complete graph K4 (k=4, no missing edges)", graph: buildGraph(4, [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]), expected: false },
    { name: "Three disjoint edges (k=6)", graph: buildGraph(6, [[0, 1], [2, 3], [4, 5]]), expected: false },
];

console.log("=== Hand-written test cases ===");
let passed = 0;
for (const t of tests) {
    const result = solution(t.graph);
    const ok = result === t.expected;
    if (ok) passed++;
    console.log(`${ok ? "PASS" : "FAIL"} | ${t.name} -> got ${result}, expected ${t.expected}`);
}
console.log(`${passed}/${tests.length} passed\n`);


console.log("=== Random tests vs. brute force ===");
const RANDOM_RUNS = 2000;
let mismatches = 0;
for (let run = 0; run < RANDOM_RUNS; run++) {
    const n = 1 + Math.floor(Math.random() * 7);
    const density = Math.random();
    const edges = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (Math.random() < density) edges.push([i, j]);
        }
    }
    const g = buildGraph(n, edges);
    const fast = solution(g);
    const slow = bruteForce(g);
    if (fast !== slow) {
        mismatches++;
        if (mismatches <= 5) {
            console.log(`MISMATCH n=${n} edges=${JSON.stringify(edges)} solution=${fast} brute=${slow}`);
        }
    }
}
console.log(`${RANDOM_RUNS - mismatches}/${RANDOM_RUNS} random graphs matched brute force`);
