import type { MultiLangTemplate } from "./types"

export const DP_TEMPLATES: MultiLangTemplate[] = [
  {
    id: "dp-top-down-memo",
    title: "Top-Down DP with Memoization (Recursion + Cache)",
    category: "Dynamic Programming",
    tags: ["DP", "Top-Down", "Memoization", "Recursion"],
    description: "Standard recursive dynamic programming framework using state memoization/hash cache to avoid redundant subproblem calculations.",
    complexity: { time: "O(States * Transitions)", space: "O(States)" },
    isBuiltIn: true,
    code: {
      python: `from functools import lru_cache

def solve_top_down_memo(arr: list[int], target: int) -> int:
    """Canonical Top-Down DP with recursion and memoization cache."""
    @lru_cache(maxsize=None)
    def dp(i: int, remain: int) -> int:
        # Base Cases
        if remain == 0:
            return 0
        if i >= len(arr) or remain < 0:
            return float('inf')

        # State Transitions: Skip current OR Take current
        skip = dp(i + 1, remain)
        take = 1 + dp(i + 1, remain - arr[i]) if remain >= arr[i] else float('inf')

        return min(skip, take)

    res = dp(0, target)
    return res if res != float('inf') else -1`,
      java: `import java.util.Arrays;

public class TopDownMemoDP {
    private int[][] memo;

    public int solve(int[] arr, int target) {
        int n = arr.length;
        memo = new int[n + 1][target + 1];
        for (int[] row : memo) Arrays.fill(row, -1);
        int res = dp(0, target, arr);
        return res >= 1e9 ? -1 : res;
    }

    private int dp(int i, int remain, int[] arr) {
        if (remain == 0) return 0;
        if (i >= arr.length || remain < 0) return (int) 1e9;
        if (memo[i][remain] != -1) return memo[i][remain];

        int skip = dp(i + 1, remain, arr);
        int take = (int) 1e9;
        if (remain >= arr[i]) {
            take = 1 + dp(i + 1, remain - arr[i], arr);
        }

        return memo[i][remain] = Math.min(skip, take);
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
#include <cstring>
using namespace std;

class TopDownMemoDP {
    int memo[1005][1005];
    const int INF = 1e9;

    int dp(int i, int remain, const vector<int>& arr) {
        if (remain == 0) return 0;
        if (i >= (int)arr.size() || remain < 0) return INF;
        if (memo[i][remain] != -1) return memo[i][remain];

        int skip = dp(i + 1, remain, arr);
        int take = INF;
        if (remain >= arr[i]) {
            take = 1 + dp(i + 1, remain - arr[i], arr);
        }

        return memo[i][remain] = min(skip, take);
    }

public:
    int solve(const vector<int>& arr, int target) {
        memset(memo, -1, sizeof(memo));
        int res = dp(0, target, arr);
        return res >= INF ? -1 : res;
    }
};`,
      typescript: `function solveTopDownMemo(arr: number[], target: number): number {
  const memo = new Map<string, number>();
  const INF = 1e9;

  function dp(i: number, remain: number): number {
    if (remain === 0) return 0;
    if (i >= arr.length || remain < 0) return INF;

    const key = \`\${i}:\${remain}\`;
    if (memo.has(key)) return memo.get(key)!;

    const skip = dp(i + 1, remain);
    const take = remain >= arr[i] ? 1 + dp(i + 1, remain - arr[i]) : INF;

    const result = Math.min(skip, take);
    memo.set(key, result);
    return result;
  }

  const res = dp(0, target);
  return res >= INF ? -1 : res;
}`,
      go: `func solveTopDownMemo(arr []int, target int) int {
    const INF = 1000000000
    memo := make(map[[2]int]int)

    var dp func(i, remain int) int
    dp = func(i, remain int) int {
        if remain == 0 { return 0 }
        if i >= len(arr) || remain < 0 { return INF }
        state := [2]int{i, remain}
        if val, exists := memo[state]; exists {
            return val
        }

        skip := dp(i+1, remain)
        take := INF
        if remain >= arr[i] {
            take = 1 + dp(i+1, remain-arr[i])
        }

        res := skip
        if take < res { res = take }
        memo[state] = res
        return res
    }

    res := dp(0, target)
    if res >= INF { return -1 }
    return res
}`
    }
  },
  {
    id: "dp-1d",
    title: "1D Linear State DP (House Robber / State Optimization)",
    category: "Dynamic Programming",
    tags: ["DP", "1D DP", "Space Optimization", "Fibonacci"],
    description: "Standard 1D dynamic programming with O(1) space optimization using two rolling variables.",
    complexity: { time: "O(N)", space: "O(1)" },
    isBuiltIn: true,
    code: {
      python: `def house_robber_1d(nums: list[int]) -> int:
    """1D DP with O(1) rolling space optimization."""
    if not nums:
        return 0

    prev2, prev1 = 0, 0
    for x in nums:
        curr = max(prev1, prev2 + x)
        prev2, prev1 = prev1, curr

    return prev1`,
      java: `public int houseRobber1D(int[] nums) {
    if (nums == null || nums.length == 0) return 0;

    int prev2 = 0, prev1 = 0;
    for (int x : nums) {
        int curr = Math.max(prev1, prev2 + x);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
      cpp: `int houseRobber1D(const vector<int>& nums) {
    int prev2 = 0, prev1 = 0;
    for (int x : nums) {
        int curr = max(prev1, prev2 + x);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
      typescript: `function houseRobber1D(nums: number[]): number {
  let prev2 = 0, prev1 = 0;
  for (const x of nums) {
    const curr = Math.max(prev1, prev2 + x);
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
      go: `func houseRobber1D(nums []int) int {
    prev2, prev1 := 0, 0
    for _, x := range nums {
        curr := prev1
        if prev2+x > curr {
            curr = prev2 + x
        }
        prev2, prev1 = prev1, curr
    }
    return prev1
}`
    }
  },
  {
    id: "dp-2d-grid",
    title: "2D Grid DP (Matrix Minimum Path Sum)",
    category: "Dynamic Programming",
    tags: ["DP", "2D DP", "Grid", "Matrix"],
    description: "Iterative 2D grid DP transition where state at (r, c) depends on top (r-1, c) and left (r, c-1) neighbors.",
    complexity: { time: "O(R * C)", space: "O(C)" },
    isBuiltIn: true,
    code: {
      python: `def min_path_sum_grid(grid: list[list[int]]) -> int:
    """2D Grid DP with 1D row space optimization."""
    if not grid or not grid[0]:
        return 0

    R, C = len(grid), len(grid[0])
    dp = [float('inf')] * C
    dp[0] = 0

    for r in range(R):
        for c in range(C):
            if c == 0:
                dp[c] = dp[c] + grid[r][c]
            else:
                dp[c] = min(dp[c], dp[c - 1]) + grid[r][c]

    return dp[-1]`,
      java: `public int minPathSumGrid(int[][] grid) {
    int R = grid.length, C = grid[0].length;
    int[] dp = new int[C];
    dp[0] = grid[0][0];

    for (int c = 1; c < C; c++) dp[c] = dp[c - 1] + grid[0][c];

    for (int r = 1; r < R; r++) {
        dp[0] += grid[r][0];
        for (int c = 1; c < C; c++) {
            dp[c] = Math.min(dp[c], dp[c - 1]) + grid[r][c];
        }
    }
    return dp[C - 1];
}`,
      cpp: `int minPathSumGrid(const vector<vector<int>>& grid) {
    int R = grid.size(), C = grid[0].size();
    vector<int> dp(C, 0);
    dp[0] = grid[0][0];

    for (int c = 1; c < C; c++) dp[c] = dp[c - 1] + grid[0][c];

    for (int r = 1; r < R; r++) {
        dp[0] += grid[r][0];
        for (int c = 1; c < C; c++) {
            dp[c] = min(dp[c], dp[c - 1]) + grid[r][c];
        }
    }
    return dp[C - 1];
}`,
      typescript: `function minPathSumGrid(grid: number[][]): number {
  const R = grid.length, C = grid[0].length;
  const dp: number[] = new Array(C).fill(0);
  dp[0] = grid[0][0];

  for (let c = 1; c < C; c++) dp[c] = dp[c - 1] + grid[0][c];

  for (let r = 1; r < R; r++) {
    dp[0] += grid[r][0];
    for (let c = 1; c < C; c++) {
      dp[c] = Math.min(dp[c], dp[c - 1]) + grid[r][c];
    }
  }
  return dp[C - 1];
}`,
      go: `func minPathSumGrid(grid [][]int) int {
    R, C := len(grid), len(grid[0])
    dp := make([]int, C)
    dp[0] = grid[0][0]

    for c := 1; c < C; c++ {
        dp[c] = dp[c-1] + grid[0][c]
    }

    for r := 1; r < R; r++ {
        dp[0] += grid[r][0]
        for c := 1; c < C; c++ {
            minPrev := dp[c]
            if dp[c-1] < minPrev { minPrev = dp[c-1] }
            dp[c] = minPrev + grid[r][c]
        }
    }
    return dp[C-1]
}`
    }
  },
  {
    id: "dp-lcs-edit-distance",
    title: "Longest Common Subsequence & Edit Distance",
    category: "Dynamic Programming",
    tags: ["DP", "LCS", "Strings", "Edit Distance", "2D DP"],
    description: "Canonical two-string dynamic programming matching characters with delete, insert, or replace state transitions.",
    complexity: { time: "O(M * N)", space: "O(min(M, N))" },
    isBuiltIn: true,
    code: {
      python: `def longest_common_subsequence(s1: str, s2: str) -> int:
    """LCS DP with space optimization to O(min(M, N))."""
    if len(s1) < len(s2):
        s1, s2 = s2, s1
    M, N = len(s1), len(s2)
    dp = [0] * (N + 1)

    for i in range(1, M + 1):
        prev = 0
        for j in range(1, N + 1):
            temp = dp[j]
            if s1[i - 1] == s2[j - 1]:
                dp[j] = prev + 1
            else:
                dp[j] = max(dp[j], dp[j - 1])
            prev = temp

    return dp[N]`,
      java: `public int longestCommonSubsequence(String s1, String s2) {
    int M = s1.length(), N = s2.length();
    int[] dp = new int[N + 1];

    for (int i = 1; i <= M; i++) {
        int prev = 0;
        for (int j = 1; j <= N; j++) {
            int temp = dp[j];
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                dp[j] = prev + 1;
            } else {
                dp[j] = Math.max(dp[j], dp[j - 1]);
            }
            prev = temp;
        }
    }
    return dp[N];
}`,
      cpp: `int longestCommonSubsequence(const string& s1, const string& s2) {
    int M = s1.size(), N = s2.size();
    vector<int> dp(N + 1, 0);

    for (int i = 1; i <= M; i++) {
        int prev = 0;
        for (int j = 1; j <= N; j++) {
            int temp = dp[j];
            if (s1[i - 1] == s2[j - 1]) {
                dp[j] = prev + 1;
            } else {
                dp[j] = max(dp[j], dp[j - 1]);
            }
            prev = temp;
        }
    }
    return dp[N];
}`,
      typescript: `function longestCommonSubsequence(s1: string, s2: string): number {
  const M = s1.length, N = s2.length;
  const dp = new Array(N + 1).fill(0);

  for (let i = 1; i <= M; i++) {
    let prev = 0;
    for (let j = 1; j <= N; j++) {
      const temp = dp[j];
      if (s1[i - 1] === s2[j - 1]) {
        dp[j] = prev + 1;
      } else {
        dp[j] = Math.max(dp[j], dp[j - 1]);
      }
      prev = temp;
    }
  }
  return dp[N];
}`,
      go: `func longestCommonSubsequence(s1 string, s2 string) int {
    M, N := len(s1), len(s2)
    dp := make([]int, N+1)

    for i := 1; i <= M; i++ {
        prev := 0
        for j := 1; j <= N; j++ {
            temp := dp[j]
            if s1[i-1] == s2[j-1] {
                dp[j] = prev + 1
            } else {
                if dp[j-1] > dp[j] { dp[j] = dp[j-1] }
            }
            prev = temp
        }
    }
    return dp[N]
}`
    }
  },
  {
    id: "dp-tree-diameter",
    title: "Tree DP (Subtree State & Maximum Path Sum)",
    category: "Dynamic Programming",
    tags: ["DP", "Tree DP", "DFS", "Tree Diameter", "Subtree"],
    description: "Postorder bottom-up Tree DP aggregating left and right subtree state contributions into a global maximum.",
    complexity: { time: "O(V)", space: "O(Height)" },
    isBuiltIn: true,
    code: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_path_sum_tree(root: TreeNode) -> int:
    """Tree DP calculating maximum path sum passing through any node."""
    max_sum = float('-inf')

    def postorder(node: TreeNode) -> int:
        nonlocal max_sum
        if not node:
            return 0

        # Subtree contributions (ignore negative paths)
        left = max(0, postorder(node.left))
        right = max(0, postorder(node.right))

        # Path through current node
        max_sum = max(max_sum, left + right + node.val)

        # Return single best branch upward
        return node.val + max(left, right)

    postorder(root)
    return max_sum if max_sum != float('-inf') else 0`,
      java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class TreeDP {
    private int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        maxSum = Integer.MIN_VALUE;
        postorder(root);
        return maxSum;
    }

    private int postorder(TreeNode node) {
        if (node == null) return 0;

        int left = Math.max(0, postorder(node.left));
        int right = Math.max(0, postorder(node.right));

        maxSum = Math.max(maxSum, left + right + node.val);
        return node.val + Math.max(left, right);
    }
}`,
      cpp: `struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class TreeDP {
    int maxSum = -1e9;

    int postorder(TreeNode* node) {
        if (!node) return 0;

        int left = max(0, postorder(node->left));
        int right = max(0, postorder(node->right));

        maxSum = max(maxSum, left + right + node->val);
        return node->val + max(left, right);
    }

public:
    int maxPathSum(TreeNode* root) {
        maxSum = -1e9;
        postorder(root);
        return maxSum;
    }
};`,
      typescript: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function maxPathSumTree(root: TreeNode | null): number {
  let maxSum = -Infinity;

  function postorder(node: TreeNode | null): number {
    if (!node) return 0;

    const left = Math.max(0, postorder(node.left));
    const right = Math.max(0, postorder(node.right));

    maxSum = Math.max(maxSum, left + right + node.val);
    return node.val + Math.max(left, right);
  }

  postorder(root);
  return maxSum === -Infinity ? 0 : maxSum;
}`,
      go: `type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func maxPathSumTree(root *TreeNode) int {
    maxSum := -1000000000

    var postorder func(node *TreeNode) int
    postorder = func(node *TreeNode) int {
        if node == nil { return 0 }

        left := postorder(node.Left)
        if left < 0 { left = 0 }

        right := postorder(node.Right)
        if right < 0 { right = 0 }

        pathSum := left + right + node.Val
        if pathSum > maxSum { maxSum = pathSum }

        bestBranch := left
        if right > bestBranch { bestBranch = right }
        return node.Val + bestBranch
    }

    postorder(root)
    return maxSum
}`
    }
  },
  {
    id: "dp-stock-state-machine",
    title: "Stock State Machine DP (K Transactions & Cooldown)",
    category: "Dynamic Programming",
    tags: ["DP", "State Machine", "Stocks", "Cooldown"],
    description: "State machine dynamic programming tracking explicit discrete states (buy, sell, hold, rest/cooldown).",
    complexity: { time: "O(N * K)", space: "O(K)" },
    isBuiltIn: true,
    code: {
      python: `def max_profit_k_transactions(prices: list[int], k: int) -> int:
    """State Machine DP with K transactions and discrete buy/sell states."""
    if not prices or k <= 0:
        return 0

    N = len(prices)
    if k >= N // 2:
        return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, N))

    buy = [-float('inf')] * (k + 1)
    sell = [0] * (k + 1)

    for p in prices:
        for t in range(1, k + 1):
            buy[t] = max(buy[t], sell[t - 1] - p)
            sell[t] = max(sell[t], buy[t] + p)

    return sell[k]`,
      java: `public int maxProfitKTransactions(int[] prices, int k) {
    if (prices == null || prices.length == 0 || k <= 0) return 0;
    int N = prices.length;
    if (k >= N / 2) {
        int profit = 0;
        for (int i = 1; i < N; i++) if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
        return profit;
    }

    int[] buy = new int[k + 1];
    int[] sell = new int[k + 1];
    Arrays.fill(buy, -1000000000);

    for (int p : prices) {
        for (int t = 1; t <= k; t++) {
            buy[t] = Math.max(buy[t], sell[t - 1] - p);
            sell[t] = Math.max(sell[t], buy[t] + p);
        }
    }
    return sell[k];
}`,
      cpp: `int maxProfitKTransactions(const vector<int>& prices, int k) {
    if (prices.empty() || k <= 0) return 0;
    int N = prices.size();
    if (k >= N / 2) {
        int profit = 0;
        for (int i = 1; i < N; i++) if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
        return profit;
    }

    vector<int> buy(k + 1, -1e9);
    vector<int> sell(k + 1, 0);

    for (int p : prices) {
        for (int t = 1; t <= k; t++) {
            buy[t] = max(buy[t], sell[t - 1] - p);
            sell[t] = max(sell[t], buy[t] + p);
        }
    }
    return sell[k];
}`,
      typescript: `function maxProfitKTransactions(prices: number[], k: number): number {
  if (!prices.length || k <= 0) return 0;
  const N = prices.length;
  if (k >= Math.floor(N / 2)) {
    let profit = 0;
    for (let i = 1; i < N; i++) {
      if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
    }
    return profit;
  }

  const buy = new Array(k + 1).fill(-Infinity);
  const sell = new Array(k + 1).fill(0);

  for (const p of prices) {
    for (let t = 1; t <= k; t++) {
      buy[t] = Math.max(buy[t], sell[t - 1] - p);
      sell[t] = Math.max(sell[t], buy[t] + p);
    }
  }
  return sell[k];
}`,
      go: `func maxProfitKTransactions(prices []int, k int) int {
    N := len(prices)
    if N == 0 || k <= 0 { return 0 }
    if k >= N/2 {
        profit := 0
        for i := 1; i < N; i++ {
            if prices[i] > prices[i-1] { profit += prices[i] - prices[i-1] }
        }
        return profit
    }

    buy := make([]int, k+1)
    sell := make([]int, k+1)
    for i := range buy { buy[i] = -1000000000 }

    for _, p := range prices {
        for t := 1; t <= k; t++ {
            if sell[t-1]-p > buy[t] { buy[t] = sell[t-1] - p }
            if buy[t]+p > sell[t] { sell[t] = buy[t] + p }
        }
    }
    return sell[k]
}`
    }
  },
  {
    id: "dp-knapsack-01-unbounded",
    title: "0/1 & Unbounded Knapsack (1D Space Optimization)",
    category: "Dynamic Programming",
    tags: ["DP", "Knapsack", "0/1 Knapsack", "Unbounded"],
    description: "0/1 Knapsack (reverse iteration) vs Unbounded Knapsack (forward iteration) in single 1D array.",
    complexity: { time: "O(N * W)", space: "O(W)" },
    isBuiltIn: true,
    code: {
      python: `def knapsack_01(weights: list[int], values: list[int], W: int) -> int:
    """0/1 Knapsack with 1D array (iterate BACKWARDS)."""
    dp = [0] * (W + 1)
    for w, v in zip(weights, values):
        for cap in range(W, w - 1, -1):
            dp[cap] = max(dp[cap], dp[cap - w] + v)
    return dp[W]

def knapsack_unbounded(weights: list[int], values: list[int], W: int) -> int:
    """Unbounded Knapsack with 1D array (iterate FORWARD)."""
    dp = [0] * (W + 1)
    for w, v in zip(weights, values):
        for cap in range(w, W + 1):
            dp[cap] = max(dp[cap], dp[cap - w] + v)
    return dp[W]`,
      java: `public int knapsack01(int[] weights, int[] values, int W) {
    int[] dp = new int[W + 1];
    for (int i = 0; i < weights.length; i++) {
        int w = weights[i], v = values[i];
        for (int cap = W; cap >= w; cap--) {
            dp[cap] = Math.max(dp[cap], dp[cap - w] + v);
        }
    }
    return dp[W];
}

public int knapsackUnbounded(int[] weights, int[] values, int W) {
    int[] dp = new int[W + 1];
    for (int i = 0; i < weights.length; i++) {
        int w = weights[i], v = values[i];
        for (int cap = w; cap <= W; cap++) {
            dp[cap] = Math.max(dp[cap], dp[cap - w] + v);
        }
    }
    return dp[W];
}`,
      cpp: `int knapsack01(const vector<int>& weights, const vector<int>& values, int W) {
    vector<int> dp(W + 1, 0);
    for (size_t i = 0; i < weights.size(); i++) {
        int w = weights[i], v = values[i];
        for (int cap = W; cap >= w; cap--) {
            dp[cap] = max(dp[cap], dp[cap - w] + v);
        }
    }
    return dp[W];
}

int knapsackUnbounded(const vector<int>& weights, const vector<int>& values, int W) {
    vector<int> dp(W + 1, 0);
    for (size_t i = 0; i < weights.size(); i++) {
        int w = weights[i], v = values[i];
        for (int cap = w; cap <= W; cap++) {
            dp[cap] = max(dp[cap], dp[cap - w] + v);
        }
    }
    return dp[W];
}`,
      typescript: `function knapsack01(weights: number[], values: number[], W: number): number {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i], v = values[i];
    for (let cap = W; cap >= w; cap--) {
      dp[cap] = Math.max(dp[cap], dp[cap - w] + v);
    }
  }
  return dp[W];
}

function knapsackUnbounded(weights: number[], values: number[], W: number): number {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i], v = values[i];
    for (let cap = w; cap <= W; cap++) {
      dp[cap] = Math.max(dp[cap], dp[cap - w] + v);
    }
  }
  return dp[W];
}`,
      go: `func knapsack01(weights, values []int, W int) int {
    dp := make([]int, W+1)
    for i := range weights {
        w, v := weights[i], values[i]
        for cap := W; cap >= w; cap-- {
            if dp[cap-w]+v > dp[cap] { dp[cap] = dp[cap-w] + v }
        }
    }
    return dp[W]
}

func knapsackUnbounded(weights, values []int, W int) int {
    dp := make([]int, W+1)
    for i := range weights {
        w, v := weights[i], values[i]
        for cap := w; cap <= W; cap++ {
            if dp[cap-w]+v > dp[cap] { dp[cap] = dp[cap-w] + v }
        }
    }
    return dp[W]
}`
    }
  },
  {
    id: "dp-lis",
    title: "Longest Increasing Subsequence (LIS O(N log N))",
    category: "Dynamic Programming",
    tags: ["DP", "LIS", "Patience Sort", "Binary Search"],
    description: "Optimal LIS using patience sorting / binary search tails array in O(N log N) time.",
    complexity: { time: "O(N log N)", space: "O(N)" },
    isBuiltIn: true,
    code: {
      python: `import bisect

def length_of_lis(nums: list[int]) -> int:
    """Patience sorting tails array binary search."""
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)`,
      java: `public int lengthOfLIS(int[] nums) {
    int[] tails = new int[nums.length];
    int len = 0;
    for (int x : nums) {
        int i = 0, j = len;
        while (i < j) {
            int m = (i + j) / 2;
            if (tails[m] < x) i = m + 1;
            else j = m;
        }
        tails[i] = x;
        if (i == len) len++;
    }
    return len;
}`,
      cpp: `int lengthOfLIS(const vector<int>& nums) {
    vector<int> tails;
    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) {
            tails.push_back(x);
        } else {
            *it = x;
        }
    }
    return tails.size();
}`,
      typescript: `function lengthOfLIS(nums: number[]): number {
  const tails: number[] = [];
  for (const x of nums) {
    let l = 0, r = tails.length;
    while (l < r) {
      const mid = (l + r) >> 1;
      if (tails[mid] < x) l = mid + 1;
      else r = mid;
    }
    if (l === tails.length) tails.push(x);
    else tails[l] = x;
  }
  return tails.length;
}`,
      go: `func lengthOfLIS(nums []int) int {
    tails := make([]int, 0, len(nums))
    for _, x := range nums {
        l, r := 0, len(tails)
        for l < r {
            mid := (l + r) / 2
            if tails[mid] < x { l = mid + 1 } else { r = mid }
        }
        if l == len(tails) {
            tails = append(tails, x)
        } else {
            tails[l] = x
        }
    }
    return len(tails)
}`
    }
  },
  {
    id: "dp-interval",
    title: "Interval DP (Matrix Chain / Burst Balloons / Merge Stones)",
    category: "Dynamic Programming",
    tags: ["DP", "Interval DP", "Divide & Conquer"],
    description: "Interval DP iterating by interval length from 2 to N, splitting at every partition k.",
    complexity: { time: "O(N^3)", space: "O(N^2)" },
    isBuiltIn: true,
    code: {
      python: `def merge_stones_interval_dp(stones: list[int]) -> int:
    """Interval DP iterating by segment length L from 2 to N."""
    N = len(stones)
    prefix = [0] * (N + 1)
    for i in range(N):
        prefix[i + 1] = prefix[i] + stones[i]

    dp = [[0] * N for _ in range(N)]

    for L in range(2, N + 1):
        for i in range(N - L + 1):
            j = i + L - 1
            dp[i][j] = float('inf')
            cost = prefix[j + 1] - prefix[i]
            for k in range(i, j):
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k + 1][j] + cost)

    return dp[0][N - 1]`,
      java: `public int mergeStonesIntervalDP(int[] stones) {
    int N = stones.length;
    int[] prefix = new int[N + 1];
    for (int i = 0; i < N; i++) prefix[i + 1] = prefix[i] + stones[i];

    int[][] dp = new int[N][N];

    for (int L = 2; L <= N; L++) {
        for (int i = 0; i <= N - L; i++) {
            int j = i + L - 1;
            dp[i][j] = Integer.MAX_VALUE;
            int cost = prefix[j + 1] - prefix[i];
            for (int k = i; k < j; k++) {
                dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j] + cost);
            }
        }
    }
    return dp[0][N - 1];
}`,
      cpp: `int mergeStonesIntervalDP(const vector<int>& stones) {
    int N = stones.size();
    vector<int> prefix(N + 1, 0);
    for (int i = 0; i < N; i++) prefix[i + 1] = prefix[i] + stones[i];

    vector<vector<int>> dp(N, vector<int>(N, 0));

    for (int L = 2; L <= N; L++) {
        for (int i = 0; i <= N - L; i++) {
            int j = i + L - 1;
            dp[i][j] = 1e9;
            int cost = prefix[j + 1] - prefix[i];
            for (int k = i; k < j; k++) {
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k + 1][j] + cost);
            }
        }
    }
    return dp[0][N - 1];
}`,
      typescript: `function mergeStonesIntervalDP(stones: number[]): number {
  const N = stones.length;
  const prefix = new Array(N + 1).fill(0);
  for (let i = 0; i < N; i++) prefix[i + 1] = prefix[i] + stones[i];

  const dp: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));

  for (let L = 2; L <= N; L++) {
    for (let i = 0; i <= N - L; i++) {
      const j = i + L - 1;
      dp[i][j] = Infinity;
      const cost = prefix[j + 1] - prefix[i];
      for (let k = i; k < j; k++) {
        dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j] + cost);
      }
    }
  }
  return dp[0][N - 1];
}`,
      go: `func mergeStonesIntervalDP(stones []int) int {
    N := len(stones)
    prefix := make([]int, N+1)
    for i := 0; i < N; i++ { prefix[i+1] = prefix[i] + stones[i] }

    dp := make([][]int, N)
    for i := range dp { dp[i] = make([]int, N) }

    for L := 2; L <= N; L++ {
        for i := 0; i <= N-L; i++ {
            j := i + L - 1
            dp[i][j] = 1000000000
            cost := prefix[j+1] - prefix[i]
            for k := i; k < j; k++ {
                sum := dp[i][k] + dp[k+1][j] + cost
                if sum < dp[i][j] { dp[i][j] = sum }
            }
        }
    }
    return dp[0][N-1]
}`
    }
  },
  {
    id: "dp-digit",
    title: "Digit DP (Counting Integers with Digit Invariant)",
    category: "Dynamic Programming",
    tags: ["DP", "Digit DP", "Combinatorics"],
    description: "Digit DP with tight flag and leading zero tracking to count valid integers in range [1, N].",
    complexity: { time: "O(Digits * 10 * States)", space: "O(Digits * States)" },
    isBuiltIn: true,
    code: {
      python: `from functools import lru_cache

def count_digit_dp(n: int) -> int:
    """Digit DP counting numbers <= n satisfying digit invariants."""
    s = str(n)

    @lru_cache(maxsize=None)
    def dp(idx: int, tight: bool, is_zero: bool, sum_digits: int) -> int:
        if idx == len(s):
            return 0 if is_zero else 1

        limit = int(s[idx]) if tight else 9
        res = 0

        for d in range(limit + 1):
            res += dp(
                idx + 1,
                tight and (d == limit),
                is_zero and (d == 0),
                sum_digits + d
            )

        return res

    return dp(0, True, True, 0)`,
      java: `public class DigitDP {
    private int[][][][] memo;
    private String s;

    public int countDigitDP(int n) {
        s = String.valueOf(n);
        memo = new int[s.length()][2][2][100];
        for (int[][][] a : memo)
            for (int[][] b : a)
                for (int[] c : b)
                    Arrays.fill(c, -1);
        return dp(0, 1, 1, 0);
    }

    private int dp(int idx, int tight, int isZero, int sum) {
        if (idx == s.length()) return isZero == 1 ? 0 : 1;
        if (memo[idx][tight][isZero][sum] != -1) return memo[idx][tight][isZero][sum];

        int limit = (tight == 1) ? (s.charAt(idx) - '0') : 9;
        int res = 0;

        for (int d = 0; d <= limit; d++) {
            res += dp(idx + 1, (tight == 1 && d == limit) ? 1 : 0, (isZero == 1 && d == 0) ? 1 : 0, sum + d);
        }
        return memo[idx][tight][isZero][sum] = res;
    }
}`,
      cpp: `int memo[20][2][2][100];

int dp(int idx, bool tight, bool isZero, int sum, const string& s) {
    if (idx == (int)s.size()) return isZero ? 0 : 1;
    if (memo[idx][tight][isZero][sum] != -1) return memo[idx][tight][isZero][sum];

    int limit = tight ? s[idx] - '0' : 9;
    int res = 0;

    for (int d = 0; d <= limit; d++) {
        res += dp(idx + 1, tight && (d == limit), isZero && (d == 0), sum + d, s);
    }
    return memo[idx][tight][isZero][sum] = res;
}

int countDigitDP(int n) {
    string s = to_string(n);
    memset(memo, -1, sizeof(memo));
    return dp(0, true, true, 0, s);
}`,
      typescript: `function countDigitDP(n: number): number {
  const s = String(n);
  const memo = new Map<string, number>();

  function dp(idx: number, tight: boolean, isZero: boolean, sum: number): number {
    if (idx === s.length) return isZero ? 0 : 1;
    const key = \`\${idx}-\${tight}-\${isZero}-\${sum}\`;
    if (memo.has(key)) return memo.get(key)!;

    const limit = tight ? Number(s[idx]) : 9;
    let res = 0;

    for (let d = 0; d <= limit; d++) {
      res += dp(idx + 1, tight && d === limit, isZero && d === 0, sum + d);
    }

    memo.set(key, res);
    return res;
  }

  return dp(0, true, true, 0);
}`,
      go: `import "strconv"

func countDigitDP(n int) int {
    s := strconv.Itoa(n)
    memo := make(map[string]int)

    var dp func(idx int, tight, isZero bool, sum int) int
    dp = func(idx int, tight, isZero bool, sum int) int {
        if idx == len(s) {
            if isZero { return 0 }
            return 1
        }
        key := strconv.Itoa(idx) + "-" + strconv.FormatBool(tight) + "-" + strconv.FormatBool(isZero) + "-" + strconv.Itoa(sum)
        if val, ok := memo[key]; ok { return val }

        limit := 9
        if tight { limit = int(s[idx] - '0') }
        res := 0

        for d := 0; d <= limit; d++ {
            res += dp(idx+1, tight && (d == limit), isZero && (d == 0), sum+d)
        }
        memo[key] = res
        return res
    }
    return dp(0, true, true, 0)
}`
    }
  }
]
