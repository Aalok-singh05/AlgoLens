import type { MultiLangTemplate } from "./types"

export const GRAPH_TEMPLATES: MultiLangTemplate[] = [
  {
    id: "graph-bfs",
    title: "Breadth-First Search (BFS & Grid Traversal)",
    category: "Graph",
    tags: ["Graph", "BFS", "Grid", "Shortest Path", "Queue"],
    description: "Level-order traversal and shortest path in unweighted graphs or 2D grids in O(V + E) / O(R * C).",
    complexity: { time: "O(V + E) / O(R * C)", space: "O(V) / O(R * C)" },
    isBuiltIn: true,
    code: {
      python: `from collections import deque

def bfs_grid(grid: list[list[int]], start_r: int, start_c: int) -> int:
    rows, cols = len(grid), len(grid[0])
    queue = deque([(start_r, start_c, 0)])  # (row, col, distance)
    visited = {(start_r, start_c)}
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while queue:
        r, c, dist = queue.popleft()

        # Target check (e.g. bottom-right corner)
        if r == rows - 1 and c == cols - 1:
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in visited and grid[nr][nc] == 0:
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))

    return -1`,
      java: `public int bfsGrid(int[][] grid, int startR, int startC) {
    int rows = grid.length, cols = grid[0].length;
    Queue<int[]> queue = new ArrayDeque<>(); // {r, c, dist}
    boolean[][] visited = new boolean[rows][cols];

    queue.offer(new int[]{startR, startC, 0});
    visited[startR][startC] = true;
    int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    while (!queue.isEmpty()) {
        int[] curr = queue.poll();
        int r = curr[0], c = curr[1], dist = curr[2];

        if (r == rows - 1 && c == cols - 1) return dist;

        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] == 0) {
                visited[nr][nc] = true;
                queue.offer(new int[]{nr, nc, dist + 1});
            }
        }
    }
    return -1;
}`,
      cpp: `int bfsGrid(const vector<vector<int>>& grid, int startR, int startC) {
    int rows = grid.size(), cols = grid[0].size();
    queue<tuple<int, int, int>> q; // {r, c, dist}
    vector<vector<bool>> visited(rows, vector<bool>(cols, false));

    q.push({startR, startC, 0});
    visited[startR][startC] = true;
    const int dr[4] = {-1, 1, 0, 0};
    const int dc[4] = {0, 0, -1, 1};

    while (!q.empty()) {
        auto [r, c, dist] = q.front();
        q.pop();

        if (r == rows - 1 && c == cols - 1) return dist;

        for (int i = 0; i < 4; i++) {
            int nr = r + dr[i], nc = c + dc[i];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] == 0) {
                visited[nr][nc] = true;
                q.push({nr, nc, dist + 1});
            }
        }
    }
    return -1;
}`,
      typescript: `function bfsGrid(grid: number[][], startR: number, startC: number): number {
  const rows = grid.length, cols = grid[0].length;
  const queue: [number, number, number][] = [[startR, startC, 0]];
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));

  visited[startR][startC] = true;
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (queue.length > 0) {
    const [r, c, dist] = queue.shift()!;
    if (r === rows - 1 && c === cols - 1) return dist;

    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] === 0) {
        visited[nr][nc] = true;
        queue.push([nr, nc, dist + 1]);
      }
    }
  }
  return -1;
}`,
      go: `func bfsGrid(grid [][]int, startR, startC int) int {
    rows, cols := len(grid), len(grid[0])
    type Node struct{ r, c, dist int }
    queue := []Node{{startR, startC, 0}}

    visited := make([][]bool, rows)
    for i := range visited { visited[i] = make([]bool, cols) }
    visited[startR][startC] = true

    dirs := [][]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}

    for len(queue) > 0 {
        curr := queue[0]
        queue = queue[1:]

        if curr.r == rows-1 && curr.c == cols-1 {
            return curr.dist
        }

        for _, d := range dirs {
            nr, nc := curr.r+d[0], curr.c+d[1]
            if nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] == 0 {
                visited[nr][nc] = true
                queue = append(queue, Node{nr, nc, curr.dist + 1})
            }
        }
    }
    return -1
}`
    }
  },
  {
    id: "graph-dfs",
    title: "Depth-First Search (DFS & Cycle Detection)",
    category: "Graph",
    tags: ["Graph", "DFS", "Recursion", "Cycle Detection", "Connected Components"],
    description: "Recursive DFS for graph exploration, connected component counts, and 3-color cycle detection (0: unvisited, 1: visiting, 2: visited).",
    complexity: { time: "O(V + E)", space: "O(V)" },
    isBuiltIn: true,
    code: {
      python: `def has_cycle_dfs(n: int, edges: list[list[int]]) -> bool:
    """Detects directed cycle using 3-color DFS (0=unvisited, 1=visiting, 2=visited)."""
    adj = {i: [] for i in range(n)}
    for u, v in edges:
        adj[u].append(v)

    state = [0] * n  # 0: unvisited, 1: visiting, 2: visited

    def dfs(u: int) -> bool:
        state[u] = 1  # visiting
        for v in adj[u]:
            if state[v] == 1:
                return True  # Back-edge found -> cycle detected!
            if state[v] == 0 and dfs(v):
                return True
        state[u] = 2  # fully visited
        return False

    for i in range(n):
        if state[i] == 0 and dfs(i):
            return True
    return False`,
      java: `public boolean hasCycleDFS(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) adj.get(e[0]).add(e[1]);

    int[] state = new int[n]; // 0: unvisited, 1: visiting, 2: visited

    for (int i = 0; i < n; i++) {
        if (state[i] == 0 && dfs(i, adj, state)) return true;
    }
    return false;
}

private boolean dfs(int u, List<List<Integer>> adj, int[] state) {
    state[u] = 1;
    for (int v : adj.get(u)) {
        if (state[v] == 1) return true;
        if (state[v] == 0 && dfs(v, adj, state)) return true;
    }
    state[u] = 2;
    return false;
}`,
      cpp: `bool dfs(int u, const vector<vector<int>>& adj, vector<int>& state) {
    state[u] = 1; // visiting
    for (int v : adj[u]) {
        if (state[v] == 1) return true;
        if (state[v] == 0 && dfs(v, adj, state)) return true;
    }
    state[u] = 2; // visited
    return false;
}

bool hasCycleDFS(int n, const vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (const auto& e : edges) adj[e[0]].push_back(e[1]);

    vector<int> state(n, 0); // 0=unvisited, 1=visiting, 2=visited
    for (int i = 0; i < n; i++) {
        if (state[i] == 0 && dfs(i, adj, state)) return true;
    }
    return false;
}`,
      typescript: `function hasCycleDFS(n: number, edges: number[][]): boolean {
  const adj = Array.from({ length: n }, () => [] as number[]);
  for (const [u, v] of edges) adj[u].push(v);

  const state = new Array(n).fill(0); // 0=unvisited, 1=visiting, 2=visited

  function dfs(u: number): boolean {
    state[u] = 1;
    for (const v of adj[u]) {
      if (state[v] === 1) return true;
      if (state[v] === 0 && dfs(v)) return true;
    }
    state[u] = 2;
    return false;
  }

  for (let i = 0; i < n; i++) {
    if (state[i] === 0 && dfs(i)) return true;
  }
  return false;
}`,
      go: `func hasCycleDFS(n int, edges [][]int) bool {
    adj := make([][]int, n)
    for _, e := range edges { adj[e[0]] = append(adj[e[0]], e[1]) }

    state := make([]int, n) // 0=unvisited, 1=visiting, 2=visited

    var dfs func(u int) bool
    dfs = func(u int) bool {
        state[u] = 1
        for _, v := range adj[u] {
            if state[v] == 1 { return true }
            if state[v] == 0 && dfs(v) { return true }
        }
        state[u] = 2
        return false
    }

    for i := 0; i < n; i++ {
        if state[i] == 0 && dfs(i) { return true }
    }
    return false
}`
    }
  },
  {
    id: "graph-dijkstra",
    title: "Dijkstra's Algorithm (Shortest Path with Priority Queue)",
    category: "Graph",
    tags: ["Graph", "Dijkstra", "Shortest Path", "Priority Queue", "Min-Heap"],
    description: "Single-source shortest path for non-negative weighted graphs in O((V + E) log V) using a min-heap.",
    complexity: { time: "O((V + E) log V)", space: "O(V + E)" },
    isBuiltIn: true,
    code: {
      python: `import heapq

def dijkstra(n: int, edges: list[list[int]], start: int) -> list[int]:
    """edges: list of [u, v, weight] (undirected)."""
    adj = {i: [] for i in range(n)}
    for u, v, w in edges:
        adj[u].append((v, w))
        adj[v].append((u, w))

    dist = [float('inf')] * n
    dist[start] = 0
    pq = [(0, start)]  # (distance, node)

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue

        for v, weight in adj[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))

    return dist`,
      java: `public int[] dijkstra(int n, int[][] edges, int start) {
    List<List<int[]>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(new int[]{e[1], e[2]});
        adj.get(e[1]).add(new int[]{e[0], e[2]});
    }

    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[start] = 0;

    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, start});

    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int d = curr[0], u = curr[1];
        if (d > dist[u]) continue;

        for (int[] edge : adj.get(u)) {
            int v = edge[0], weight = edge[1];
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}`,
      cpp: `vector<int> dijkstra(int n, const vector<vector<int>>& edges, int start) {
    vector<vector<pair<int, int>>> adj(n);
    for (const auto& e : edges) {
        adj[e[0]].push_back({e[1], e[2]});
        adj[e[1]].push_back({e[0], e[2]});
    }

    vector<int> dist(n, 1e9);
    dist[start] = 0;

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;

        for (const auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
      typescript: `function dijkstra(n: number, edges: number[][], start: number): number[] {
  const adj = Array.from({ length: n }, () => [] as [number, number][]);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  }

  const dist = new Array(n).fill(Infinity);
  dist[start] = 0;
  const queue: [number, number][] = [[0, start]];

  while (queue.length > 0) {
    queue.sort((a, b) => a[0] - b[0]);
    const [d, u] = queue.shift()!;
    if (d > dist[u]) continue;

    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        queue.push([dist[v], v]);
      }
    }
  }
  return dist;
}`,
      go: `import (
    "container/heap"
    "math"
)

type Item struct { node, dist int }
type PQ []*Item
func (pq PQ) Len() int           { return len(pq) }
func (pq PQ) Less(i, j int) bool { return pq[i].dist < pq[j].dist }
func (pq PQ) Swap(i, j int)      { pq[i], pq[j] = pq[j], pq[i] }
func (pq *PQ) Push(x any)        { *pq = append(*pq, x.(*Item)) }
func (pq *PQ) Pop() any {
    old := *pq; n := len(old); item := old[n-1]; *pq = old[0 : n-1]; return item
}

func dijkstra(n int, edges [][]int, start int) []int {
    type Edge struct{ to, weight int }
    adj := make([][]Edge, n)
    for _, e := range edges {
        adj[e[0]] = append(adj[e[0]], Edge{e[1], e[2]})
        adj[e[1]] = append(adj[e[1]], Edge{e[0], e[2]})
    }

    dist := make([]int, n)
    for i := range dist { dist[i] = math.MaxInt32 }
    dist[start] = 0

    pq := &PQ{}
    heap.Init(pq)
    heap.Push(pq, &Item{node: start, dist: 0})

    for pq.Len() > 0 {
        curr := heap.Pop(pq).(*Item)
        if curr.dist > dist[curr.node] { continue }
        for _, edge := range adj[curr.node] {
            if dist[curr.node]+edge.weight < dist[edge.to] {
                dist[edge.to] = dist[curr.node] + edge.weight
                heap.Push(pq, &Item{node: edge.to, dist: dist[edge.to]})
            }
        }
    }
    return dist
}`
    }
  },
  {
    id: "graph-floyd-warshall",
    title: "Floyd-Warshall (All-Pairs Shortest Path & Negative Cycle Check)",
    category: "Graph",
    tags: ["Graph", "Floyd-Warshall", "All-Pairs", "Shortest Path", "Dynamic Programming"],
    description: "Calculates shortest paths between every pair of vertices in O(V^3) time, detecting negative cycles.",
    complexity: { time: "O(V^3)", space: "O(V^2)" },
    isBuiltIn: true,
    code: {
      python: `def floyd_warshall(n: int, edges: list[list[int]]) -> list[list[int]]:
    """edges: list of [u, v, weight]. Returns n x n dist matrix."""
    INF = float('inf')
    dist = [[INF] * n for _ in range(n)]

    for i in range(n):
        dist[i][i] = 0

    for u, v, w in edges:
        dist[u][v] = min(dist[u][v], w)

    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] != INF and dist[k][j] != INF:
                    if dist[i][k] + dist[k][j] < dist[i][j]:
                        dist[i][j] = dist[i][k] + dist[k][j]

    # Negative cycle check: if dist[i][i] < 0
    return dist`,
      java: `public int[][] floydWarshall(int n, int[][] edges) {
    int INF = (int) 1e9;
    int[][] dist = new int[n][n];
    for (int[] row : dist) Arrays.fill(row, INF);
    for (int i = 0; i < n; i++) dist[i][i] = 0;

    for (int[] e : edges) {
        dist[e[0]][e[1]] = Math.min(dist[e[0]][e[1]], e[2]);
    }

    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] != INF && dist[k][j] != INF) {
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }
    return dist;
}`,
      cpp: `vector<vector<int>> floydWarshall(int n, const vector<vector<int>>& edges) {
    const int INF = 1e9;
    vector<vector<int>> dist(n, vector<int>(n, INF));
    for (int i = 0; i < n; i++) dist[i][i] = 0;

    for (const auto& e : edges) {
        dist[e[0]][e[1]] = min(dist[e[0]][e[1]], e[2]);
    }

    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] != INF && dist[k][j] != INF) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }
    return dist;
}`,
      typescript: `function floydWarshall(n: number, edges: number[][]): number[][] {
  const INF = 1e9;
  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(INF));
  for (let i = 0; i < n; i++) dist[i][i] = 0;

  for (const [u, v, w] of edges) {
    dist[u][v] = Math.min(dist[u][v], w);
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== INF && dist[k][j] !== INF) {
          dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
        }
      }
    }
  }
  return dist;
}`,
      go: `func floydWarshall(n int, edges [][]int) [][]int {
    const INF = 1000000000
    dist := make([][]int, n)
    for i := range dist {
        dist[i] = make([]int, n)
        for j := range dist[i] { dist[i][j] = INF }
        dist[i][i] = 0
    }

    for _, e := range edges {
        u, v, w := e[0], e[1], e[2]
        if w < dist[u][v] { dist[u][v] = w }
    }

    for k := 0; k < n; k++ {
        for i := 0; i < n; i++ {
            for j := 0; j < n; j++ {
                if dist[i][k] != INF && dist[k][j] != INF {
                    if dist[i][k]+dist[k][j] < dist[i][j] {
                        dist[i][j] = dist[i][k] + dist[k][j]
                    }
                }
            }
        }
    }
    return dist
}`
    }
  },
  {
    id: "graph-kruskal-mst",
    title: "Kruskal's Algorithm (Minimum Spanning Tree with DSU)",
    category: "Graph",
    tags: ["Graph", "MST", "Kruskal", "DSU", "Greedy", "Disjoint Set"],
    description: "Finds the Minimum Spanning Tree of a connected weighted graph in O(E log E) using greedy edge sorting and Union-Find.",
    complexity: { time: "O(E log E)", space: "O(V)" },
    isBuiltIn: true,
    code: {
      python: `def kruskal_mst(n: int, edges: list[list[int]]) -> tuple[int, list[list[int]]]:
    """edges: list of [u, v, weight]. Returns (total_weight, mst_edges)."""
    # Sort edges by weight
    edges.sort(key=lambda x: x[2])

    parent = list(range(n))
    rank = [0] * n

    def find(i: int) -> int:
        if parent[i] != i:
            parent[i] = find(parent[i])
        return parent[i]

    def union(i: int, j: int) -> bool:
        ri, rj = find(i), find(j)
        if ri == rj:
            return False
        if rank[ri] < rank[rj]:
            ri, rj = rj, ri
        parent[rj] = ri
        if rank[ri] == rank[rj]:
            rank[ri] += 1
        return True

    mst_edges = []
    total_cost = 0

    for u, v, w in edges:
        if union(u, v):
            total_cost += w
            mst_edges.append([u, v, w])
            if len(mst_edges) == n - 1:
                break

    return total_cost, mst_edges`,
      java: `public int kruskalMST(int n, int[][] edges) {
    Arrays.sort(edges, (a, b) -> a[2] - b[2]);
    int[] parent = new int[n];
    int[] rank = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;

    int totalWeight = 0, count = 0;
    for (int[] e : edges) {
        int rootU = find(e[0], parent), rootV = find(e[1], parent);
        if (rootU != rootV) {
            if (rank[rootU] < rank[rootV]) { int t = rootU; rootU = rootV; rootV = t; }
            parent[rootV] = rootU;
            if (rank[rootU] == rank[rootV]) rank[rootU]++;
            totalWeight += e[2];
            if (++count == n - 1) break;
        }
    }
    return count == n - 1 ? totalWeight : -1;
}

private int find(int i, int[] parent) {
    if (parent[i] != i) parent[i] = find(parent[i], parent);
    return parent[i];
}`,
      cpp: `int kruskalMST(int n, vector<vector<int>>& edges) {
    sort(edges.begin(), edges.end(), [](const auto& a, const auto& b) {
        return a[2] < b[2];
    });

    vector<int> parent(n), rank(n, 0);
    iota(parent.begin(), parent.end(), 0);

    auto find = [&](auto& self, int i) -> int {
        return parent[i] == i ? i : (parent[i] = self(self, parent[i]));
    };

    int totalCost = 0, count = 0;
    for (const auto& e : edges) {
        int ru = find(find, e[0]), rv = find(find, e[1]);
        if (ru != rv) {
            if (rank[ru] < rank[rv]) swap(ru, rv);
            parent[rv] = ru;
            if (rank[ru] == rank[rv]) rank[ru]++;
            totalCost += e[2];
            if (++count == n - 1) break;
        }
    }
    return count == n - 1 ? totalCost : -1;
}`,
      typescript: `function kruskalMST(n: number, edges: number[][]): number {
  edges.sort((a, b) => a[2] - b[2]);
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);

  function find(i: number): number {
    if (parent[i] !== i) parent[i] = find(parent[i]);
    return parent[i];
  }

  let totalCost = 0, count = 0;
  for (const [u, v, w] of edges) {
    const ru = find(u), rv = find(v);
    if (ru !== rv) {
      if (rank[ru] < rank[rv]) parent[ru] = rv;
      else if (rank[ru] > rank[rv]) parent[rv] = ru;
      else { parent[rv] = ru; rank[ru]++; }
      totalCost += w;
      if (++count === n - 1) break;
    }
  }
  return count === n - 1 ? totalCost : -1;
}`,
      go: `import "sort"

func kruskalMST(n int, edges [][]int) int {
    sort.Slice(edges, func(i, j int) bool { return edges[i][2] < edges[j][2] })
    parent := make([]int, n)
    rank := make([]int, n)
    for i := range parent { parent[i] = i }

    var find func(int) int
    find = func(i int) int {
        if parent[i] != i { parent[i] = find(parent[i]) }
        return parent[i]
    }

    totalCost, count := 0, 0
    for _, e := range edges {
        ru, rv := find(e[0]), find(e[1])
        if ru != rv {
            if rank[ru] < rank[rv] { ru, rv = rv, ru }
            parent[rv] = ru
            if rank[ru] == rank[rv] { rank[ru]++ }
            totalCost += e[2]
            count++
            if count == n-1 { break }
        }
    }
    if count == n-1 { return totalCost }
    return -1
}`
    }
  },
  {
    id: "graph-bipartite-check",
    title: "Bipartite Graph Check (2-Coloring via BFS)",
    category: "Graph",
    tags: ["Graph", "Bipartite", "2-Coloring", "BFS", "Odd Cycle"],
    description: "Determines if an undirected graph is bipartite (contains no odd-length cycles) using 2-coloring in O(V + E).",
    complexity: { time: "O(V + E)", space: "O(V)" },
    isBuiltIn: true,
    code: {
      python: `from collections import deque

def is_bipartite(graph: list[list[int]]) -> bool:
    """graph[u] is the list of neighbors for node u. Returns True if bipartite."""
    n = len(graph)
    color = {}  # node -> 0 or 1

    for start in range(n):
        if start in color:
            continue
        color[start] = 0
        queue = deque([start])

        while queue:
            u = queue.popleft()
            for v in graph[u]:
                if v not in color:
                    color[v] = 1 - color[u]
                    queue.append(v)
                elif color[v] == color[u]:
                    return False  # Odd cycle found!

    return True`,
      java: `public boolean isBipartite(int[][] graph) {
    int n = graph.length;
    int[] color = new int[n]; // 0: uncolored, 1: blue, -1: red

    for (int start = 0; start < n; start++) {
        if (color[start] != 0) continue;
        color[start] = 1;
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(start);

        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v : graph[u]) {
                if (color[v] == 0) {
                    color[v] = -color[u];
                    queue.offer(v);
                } else if (color[v] == color[u]) {
                    return false;
                }
            }
        }
    }
    return true;
}`,
      cpp: `bool isBipartite(const vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> color(n, 0); // 0=uncolored, 1=color1, -1=color2

    for (int start = 0; start < n; start++) {
        if (color[start] != 0) continue;
        color[start] = 1;
        queue<int> q;
        q.push(start);

        while (!q.empty()) {
            int u = q.front();
            q.pop();

            for (int v : graph[u]) {
                if (color[v] == 0) {
                    color[v] = -color[u];
                    q.push(v);
                } else if (color[v] == color[u]) {
                    return false;
                }
            }
        }
    }
    return true;
}`,
      typescript: `function isBipartite(graph: number[][]): boolean {
  const n = graph.length;
  const color = new Array(n).fill(0); // 0=uncolored, 1=blue, -1=red

  for (let start = 0; start < n; start++) {
    if (color[start] !== 0) continue;
    color[start] = 1;
    const queue: number[] = [start];

    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of graph[u]) {
        if (color[v] === 0) {
          color[v] = -color[u];
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false;
        }
      }
    }
  }
  return true;
}`,
      go: `func isBipartite(graph [][]int) bool {
    n := len(graph)
    color := make([]int, n) // 0=uncolored, 1=blue, -1=red

    for start := 0; start < n; start++ {
        if color[start] != 0 { continue }
        color[start] = 1
        queue := []int{start}

        for len(queue) > 0 {
            u := queue[0]
            queue = queue[1:]

            for _, v := range graph[u] {
                if color[v] == 0 {
                    color[v] = -color[u]
                    queue = append(queue, v)
                } else if color[v] == color[u] {
                    return false
                }
            }
        }
    }
    return true
}`
    }
  },
  {
    id: "graph-01-bfs",
    title: "0-1 BFS (Shortest Path with Binary Weights)",
    category: "Graph",
    tags: ["Graph", "0-1 BFS", "Deque", "Shortest Path"],
    description: "Shortest path in graphs where edge weights are only 0 or 1 in O(V + E) using a double-ended queue.",
    complexity: { time: "O(V + E)", space: "O(V)" },
    isBuiltIn: true,
    code: {
      python: `from collections import deque

def zero_one_bfs(n: int, edges: list[list[int]], start: int) -> list[int]:
    """edges: list of [u, v, weight] where weight is 0 or 1."""
    adj = {i: [] for i in range(n)}
    for u, v, w in edges:
        adj[u].append((v, w))
        adj[v].append((u, w))

    dist = [float('inf')] * n
    dist[start] = 0
    dq = deque([start])

    while dq:
        u = dq.popleft()
        for v, weight in adj[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                if weight == 0:
                    dq.appendleft(v)
                else:
                    dq.append(v)

    return dist`,
      java: `public int[] zeroOneBFS(int n, int[][] edges, int start) {
    List<List<int[]>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(new int[]{e[1], e[2]});
        adj.get(e[1]).add(new int[]{e[0], e[2]});
    }

    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[start] = 0;

    Deque<Integer> dq = new ArrayDeque<>();
    dq.offerFirst(start);

    while (!dq.isEmpty()) {
        int u = dq.pollFirst();
        for (int[] edge : adj.get(u)) {
            int v = edge[0], weight = edge[1];
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                if (weight == 0) dq.offerFirst(v);
                else dq.offerLast(v);
            }
        }
    }
    return dist;
}`,
      cpp: `vector<int> zeroOneBFS(int n, const vector<vector<int>>& edges, int start) {
    vector<vector<pair<int, int>>> adj(n);
    for (const auto& e : edges) {
        adj[e[0]].push_back({e[1], e[2]});
        adj[e[1]].push_back({e[0], e[2]});
    }

    vector<int> dist(n, 1e9);
    dist[start] = 0;
    deque<int> dq;
    dq.push_back(start);

    while (!dq.empty()) {
        int u = dq.front();
        dq.pop_front();

        for (const auto& [v, weight] : adj[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                if (weight == 0) dq.push_front(v);
                else dq.push_back(v);
            }
        }
    }
    return dist;
}`,
      typescript: `function zeroOneBFS(n: number, edges: number[][], start: number): number[] {
  const adj = Array.from({ length: n }, () => [] as [number, number][]);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  }

  const dist = new Array(n).fill(Infinity);
  dist[start] = 0;
  const dq: number[] = [start];

  while (dq.length > 0) {
    const u = dq.shift()!;
    for (const [v, weight] of adj[u]) {
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        if (weight === 0) dq.unshift(v);
        else dq.push(v);
      }
    }
  }
  return dist;
}`,
      go: `func zeroOneBFS(n int, edges [][]int, start int) []int {
    type Edge struct{ to, weight int }
    adj := make([][]Edge, n)
    for _, e := range edges {
        adj[e[0]] = append(adj[e[0]], Edge{e[1], e[2]})
        adj[e[1]] = append(adj[e[1]], Edge{e[0], e[2]})
    }

    dist := make([]int, n)
    for i := range dist { dist[i] = 1000000000 }
    dist[start] = 0
    dq := []int{start}

    for len(dq) > 0 {
        u := dq[0]
        dq = dq[1:]

        for _, edge := range adj[u] {
            if dist[u]+edge.weight < dist[edge.to] {
                dist[edge.to] = dist[u] + edge.weight
                if edge.weight == 0 {
                    dq = append([]int{edge.to}, dq...)
                } else {
                    dq = append(dq, edge.to)
                }
            }
        }
    }
    return dist
}`
    }
  },
  {
    id: "graph-dsu",
    title: "Disjoint Set Union (DSU / Union-Find with Path Compression)",
    category: "Graph",
    tags: ["Graph", "DSU", "Union Find", "Connected Components"],
    description: "Fast near-O(1) amortized connected components using path compression and union by rank/size.",
    complexity: { time: "O(alpha(N)) ≈ O(1) amortized", space: "O(N)" },
    isBuiltIn: true,
    code: {
      python: `class DSU:
    """Disjoint Set Union with Path Compression and Union by Rank."""
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n

    def find(self, i: int) -> int:
        if self.parent[i] != i:
            self.parent[i] = self.find(self.parent[i])  # Path compression
        return self.parent[i]

    def union(self, i: int, j: int) -> bool:
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i == root_j:
            return False  # Already in same set
        # Union by rank
        if self.rank[root_i] < self.rank[root_j]:
            root_i, root_j = root_j, root_i
        self.parent[root_j] = root_i
        if self.rank[root_i] == self.rank[root_j]:
            self.rank[root_i] += 1
        self.count -= 1
        return True`,
      java: `public class DSU {
    private final int[] parent;
    private final int[] rank;
    public int count;

    public DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    public int find(int i) {
        if (parent[i] != i) {
            parent[i] = find(parent[i]); // Path compression
        }
        return parent[i];
    }

    public boolean union(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI == rootJ) return false;
        if (rank[rootI] < rank[rootJ]) { int t = rootI; rootI = rootJ; rootJ = t; }
        parent[rootJ] = rootI;
        if (rank[rootI] == rank[rootJ]) rank[rootI]++;
        count--;
        return true;
    }
}`,
      cpp: `class DSU {
    vector<int> parent, rank;
public:
    int count;
    DSU(int n) : parent(n), rank(n, 0), count(n) {
        iota(parent.begin(), parent.end(), 0);
    }

    int find(int i) {
        return parent[i] == i ? i : (parent[i] = find(parent[i]));
    }

    bool unionSets(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI == rootJ) return false;
        if (rank[rootI] < rank[rootJ]) swap(rootI, rootJ);
        parent[rootJ] = rootI;
        if (rank[rootI] == rank[rootJ]) rank[rootI]++;
        count--;
        return true;
    }
};`,
      typescript: `class DSU {
  private parent: number[];
  private rank: number[];
  public count: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.count = n;
  }

  find(i: number): number {
    if (this.parent[i] !== i) {
      this.parent[i] = this.find(this.parent[i]);
    }
    return this.parent[i];
  }

  union(i: number, j: number): boolean {
    let rootI = this.find(i), rootJ = this.find(j);
    if (rootI === rootJ) return false;
    if (this.rank[rootI] < this.rank[rootJ]) {
      const temp = rootI; rootI = rootJ; rootJ = temp;
    }
    this.parent[rootJ] = rootI;
    if (this.rank[rootI] === this.rank[rootJ]) this.rank[rootI]++;
    this.count--;
    return true;
  }
}`,
      go: `type DSU struct {
    parent []int
    rank   []int
    Count  int
}

func NewDSU(n int) *DSU {
    p := make([]int, n)
    for i := range p { p[i] = i }
    return &DSU{parent: p, rank: make([]int, n), Count: n}
}

func (d *DSU) Find(i int) int {
    if d.parent[i] != i { d.parent[i] = d.Find(d.parent[i]) }
    return d.parent[i]
}

func (d *DSU) Union(i, j int) bool {
    ri, rj := d.Find(i), d.Find(j)
    if ri == rj { return false }
    if d.rank[ri] < d.rank[rj] { ri, rj = rj, ri }
    d.parent[rj] = ri
    if d.rank[ri] == d.rank[rj] { d.rank[ri]++ }
    d.Count--
    return true
}`
    }
  },
  {
    id: "graph-topological-sort",
    title: "Topological Sort (Kahn's In-Degree Algorithm)",
    category: "Graph",
    tags: ["Graph", "Topological Sort", "DAG", "Kahn's", "In-Degree"],
    description: "Linear ordering of vertices in a Directed Acyclic Graph (DAG) in O(V + E) using BFS in-degree tracking.",
    complexity: { time: "O(V + E)", space: "O(V + E)" },
    isBuiltIn: true,
    code: {
      python: `from collections import deque

def topological_sort(n: int, edges: list[list[int]]) -> list[int]:
    """Returns valid topological order or empty list if cycle exists."""
    adj = {i: [] for i in range(n)}
    in_degree = [0] * n

    for u, v in edges:
        adj[u].append(v)
        in_degree[v] += 1

    queue = deque([i for i in range(n) if in_degree[i] == 0])
    order = []

    while queue:
        u = queue.popleft()
        order.append(u)

        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    return order if len(order) == n else []  # Empty if cycle exists`,
      java: `public int[] topologicalSort(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    int[] inDegree = new int[n];

    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        inDegree[e[1]]++;
    }

    Queue<Integer> queue = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (inDegree[i] == 0) queue.offer(i);

    int[] order = new int[n];
    int idx = 0;

    while (!queue.isEmpty()) {
        int u = queue.poll();
        order[idx++] = u;

        for (int v : adj.get(u)) {
            if (--inDegree[v] == 0) queue.offer(v);
        }
    }
    return idx == n ? order : new int[0];
}`,
      cpp: `vector<int> topologicalSort(int n, const vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    vector<int> inDegree(n, 0);

    for (const auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        inDegree[e[1]]++;
    }

    queue<int> q;
    for (int i = 0; i < n; i++) if (inDegree[i] == 0) q.push(i);

    vector<int> order;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);

        for (int v : adj[u]) {
            if (--inDegree[v] == 0) q.push(v);
        }
    }
    return (int)order.size() == n ? order : vector<int>();
}`,
      typescript: `function topologicalSort(n: number, edges: number[][]): number[] {
  const adj = Array.from({ length: n }, () => [] as number[]);
  const inDegree = new Array(n).fill(0);

  for (const [u, v] of edges) {
    adj[u].push(v);
    inDegree[v]++;
  }

  const queue: number[] = [];
  for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);

  const order: number[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);

    for (const v of adj[u]) {
      if (--inDegree[v] === 0) queue.push(v);
    }
  }
  return order.length === n ? order : [];
}`,
      go: `func topologicalSort(n int, edges [][]int) []int {
    adj := make([][]int, n)
    inDegree := make([]int, n)

    for _, e := range edges {
        adj[e[0]] = append(adj[e[0]], e[1])
        inDegree[e[1]]++
    }

    queue := []int{}
    for i := 0; i < n; i++ {
        if inDegree[i] == 0 { queue = append(queue, i) }
    }

    order := make([]int, 0, n)
    for len(queue) > 0 {
        u := queue[0]
        queue = queue[1:]
        order = append(order, u)

        for _, v := range adj[u] {
            inDegree[v]--
            if inDegree[v] == 0 { queue = append(queue, v) }
        }
    }
    if len(order) == n { return order }
    return []int{}
}`
    }
  },
  {
    id: "graph-tarjan",
    title: "Tarjan's Algorithm (Bridges & Critical Connections in Graph)",
    category: "Graph",
    tags: ["Graph", "Tarjan", "Bridges", "Critical Connections", "DFS", "Low-link"],
    description: "Finds all bridge edges (whose removal disconnects the graph) in O(V + E) using DFS discovery times and low-link values.",
    complexity: { time: "O(V + E)", space: "O(V + E)" },
    isBuiltIn: true,
    code: {
      python: `def find_bridges_tarjan(n: int, connections: list[list[int]]) -> list[list[int]]:
    """Returns all critical connections / bridges in O(V + E)."""
    adj = {i: [] for i in range(n)}
    for u, v in connections:
        adj[u].append(v)
        adj[v].append(u)

    disc = [-1] * n
    low = [-1] * n
    timer = 0
    bridges = []

    def dfs(u: int, parent: int):
        nonlocal timer
        disc[u] = low[u] = timer
        timer += 1

        for v in adj[u]:
            if v == parent:
                continue
            if disc[v] != -1:
                # Back-edge
                low[u] = min(low[u], disc[v])
            else:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                # Bridge condition
                if low[v] > disc[u]:
                    bridges.append([u, v])

    for i in range(n):
        if disc[i] == -1:
            dfs(i, -1)

    return bridges`,
      java: `public List<List<Integer>> criticalConnections(int n, List<List<Integer>> connections) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (List<Integer> edge : connections) {
        adj.get(edge.get(0)).add(edge.get(1));
        adj.get(edge.get(1)).add(edge.get(0));
    }

    int[] disc = new int[n], low = new int[n];
    Arrays.fill(disc, -1);
    List<List<Integer>> bridges = new ArrayList<>();
    dfs(0, -1, 0, disc, low, adj, bridges);
    return bridges;
}

private void dfs(int u, int parent, int timer, int[] disc, int[] low, List<List<Integer>> adj, List<List<Integer>> bridges) {
    disc[u] = low[u] = timer++;
    for (int v : adj.get(u)) {
        if (v == parent) continue;
        if (disc[v] != -1) {
            low[u] = Math.min(low[u], disc[v]);
        } else {
            dfs(v, u, timer, disc, low, adj, bridges);
            low[u] = Math.min(low[u], low[v]);
            if (low[v] > disc[u]) bridges.add(Arrays.asList(u, v));
        }
    }
}`,
      cpp: `vector<vector<int>> criticalConnections(int n, const vector<vector<int>>& connections) {
    vector<vector<int>> adj(n);
    for (const auto& edge : connections) {
        adj[edge[0]].push_back(edge[1]);
        adj[edge[1]].push_back(edge[0]);
    }

    vector<int> disc(n, -1), low(n, -1);
    vector<vector<int>> bridges;
    int timer = 0;

    auto dfs = [&](auto& self, int u, int parent) -> void {
        disc[u] = low[u] = timer++;
        for (int v : adj[u]) {
            if (v == parent) continue;
            if (disc[v] != -1) {
                low[u] = min(low[u], disc[v]);
            } else {
                self(self, v, u);
                low[u] = min(low[u], low[v]);
                if (low[v] > disc[u]) bridges.push_back({u, v});
            }
        }
    };

    for (int i = 0; i < n; i++) if (disc[i] == -1) dfs(dfs, i, -1);
    return bridges;
}`,
      typescript: `function criticalConnections(n: number, connections: number[][]): number[][] {
  const adj = Array.from({ length: n }, () => [] as number[]);
  for (const [u, v] of connections) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const disc = new Array(n).fill(-1);
  const low = new Array(n).fill(-1);
  const bridges: number[][] = [];
  let timer = 0;

  function dfs(u: number, parent: number): void {
    disc[u] = low[u] = timer++;
    for (const v of adj[u]) {
      if (v === parent) continue;
      if (disc[v] !== -1) {
        low[u] = Math.min(low[u], disc[v]);
      } else {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) bridges.push([u, v]);
      }
    }
  }

  for (let i = 0; i < n; i++) if (disc[i] === -1) dfs(i, -1);
  return bridges;
}`,
      go: `func criticalConnections(n int, connections [][]int) [][]int {
    adj := make([][]int, n)
    for _, e := range connections {
        adj[e[0]] = append(adj[e[0]], e[1])
        adj[e[1]] = append(adj[e[1]], e[0])
    }

    disc := make([]int, n)
    low := make([]int, n)
    for i := range disc { disc[i] = -1 }
    bridges := [][]int{}
    timer := 0

    var dfs func(u, p int)
    dfs = func(u, p int) {
        disc[u] = timer
        low[u] = timer
        timer++

        for _, v := range adj[u] {
            if v == p { continue }
            if disc[v] != -1 {
                if disc[v] < low[u] { low[u] = disc[v] }
            } else {
                dfs(v, u)
                if low[v] < low[u] { low[u] = low[v] }
                if low[v] > disc[u] { bridges = append(bridges, []int{u, v}) }
            }
        }
    }

    for i := 0; i < n; i++ {
        if disc[i] == -1 { dfs(i, -1) }
    }
    return bridges
}`
    }
  }
]
