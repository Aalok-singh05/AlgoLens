import type { MultiLangTemplate } from "./types"

export const DATA_STRUCTURE_TEMPLATES: MultiLangTemplate[] = [
  {
    id: "difference-array-1d",
    title: "Difference Array (O(1) Range Update)",
    category: "Data Structures",
    tags: ["Difference Array", "Prefix Sum", "Range Update", "Car Pooling"],
    description: "Performs frequent range addition updates [i, j, val] in O(1) time and reconstructs the final array in O(N).",
    complexity: { time: "Update: O(1), Build: O(N)", space: "O(N)" },
    isBuiltIn: true,
    code: {
      python: `class DifferenceArray:
    """Supports O(1) range additions [i, j, val] and O(N) reconstruction."""
    def __init__(self, nums: list[int]):
        self.diff = [0] * len(nums)
        self.diff[0] = nums[0]
        for i in range(1, len(nums)):
            self.diff[i] = nums[i] - nums[i - 1]

    def increment(self, i: int, j: int, val: int) -> None:
        """Adds val to all elements in range nums[i...j] (inclusive)."""
        self.diff[i] += val
        if j + 1 < len(self.diff):
            self.diff[j + 1] -= val

    def result(self) -> list[int]:
        """Reconstructs the original array after all range updates."""
        res = [0] * len(self.diff)
        res[0] = self.diff[0]
        for i in range(1, len(self.diff)):
            res[i] = res[i - 1] + self.diff[i]
        return res`,
      java: `public class DifferenceArray {
    private final int[] diff;

    public DifferenceArray(int[] nums) {
        diff = new int[nums.length];
        diff[0] = nums[0];
        for (int i = 1; i < nums.length; i++) {
            diff[i] = nums[i] - nums[i - 1];
        }
    }

    public void increment(int i, int j, int val) {
        diff[i] += val;
        if (j + 1 < diff.length) {
            diff[j + 1] -= val;
        }
    }

    public int[] result() {
        int[] res = new int[diff.length];
        res[0] = diff[0];
        for (int i = 1; i < diff.length; i++) {
            res[i] = res[i - 1] + diff[i];
        }
        return res;
    }
}`,
      cpp: `class DifferenceArray {
    vector<int> diff;

public:
    DifferenceArray(const vector<int>& nums) {
        diff.resize(nums.size());
        diff[0] = nums[0];
        for (size_t i = 1; i < nums.size(); i++) {
            diff[i] = nums[i] - nums[i - 1];
        }
    }

    void increment(int i, int j, int val) {
        diff[i] += val;
        if (j + 1 < (int)diff.size()) {
            diff[j + 1] -= val;
        }
    }

    vector<int> result() {
        vector<int> res(diff.size());
        res[0] = diff[0];
        for (size_t i = 1; i < diff.size(); i++) {
            res[i] = res[i - 1] + diff[i];
        }
        return res;
    }
};`,
      typescript: `class DifferenceArray {
  private diff: number[];

  constructor(nums: number[]) {
    this.diff = new Array(nums.length);
    this.diff[0] = nums[0];
    for (let i = 1; i < nums.length; i++) {
      this.diff[i] = nums[i] - nums[i - 1];
    }
  }

  increment(i: number, j: number, val: number): void {
    this.diff[i] += val;
    if (j + 1 < this.diff.length) {
      this.diff[j + 1] -= val;
    }
  }

  result(): number[] {
    const res = new Array(this.diff.length);
    res[0] = this.diff[0];
    for (let i = 1; i < this.diff.length; i++) {
      res[i] = res[i - 1] + this.diff[i];
    }
    return res;
  }
}`,
      go: `type DifferenceArray struct {
    diff []int
}

func NewDifferenceArray(nums []int) *DifferenceArray {
    d := make([]int, len(nums))
    d[0] = nums[0]
    for i := 1; i < len(nums); i++ {
        d[i] = nums[i] - nums[i-1]
    }
    return &DifferenceArray{diff: d}
}

func (d *DifferenceArray) Increment(i, j, val int) {
    d.diff[i] += val
    if j+1 < len(d.diff) {
        d.diff[j+1] -= val
    }
}

func (d *DifferenceArray) Result() []int {
    res := make([]int, len(d.diff))
    res[0] = d.diff[0]
    for i := 1; i < len(d.diff); i++ {
        res[i] = res[i-1] + d.diff[i]
    }
    return res
}`
    }
  },
  {
    id: "prefix-sum-2d",
    title: "2D Matrix Prefix Sum (O(1) Range Query)",
    category: "Data Structures",
    tags: ["Prefix Sum", "2D Matrix", "Matrix Range Sum", "Geometry"],
    description: "Computes the sum of any submatrix [r1, c1] to [r2, c2] in O(1) time after O(R * C) 2D prefix precomputation.",
    complexity: { time: "Precompute: O(R * C), Query: O(1)", space: "O(R * C)" },
    isBuiltIn: true,
    code: {
      python: `class MatrixPrefixSum:
    """2D Prefix Sum for O(1) submatrix sum queries."""
    def __init__(self, matrix: list[list[int]]):
        if not matrix or not matrix[0]:
            return
        m, n = len(matrix), len(matrix[0])
        # pre[r+1][c+1] stores sum from (0,0) to (r,c)
        self.pre = [[0] * (n + 1) for _ in range(m + 1)]

        for r in range(m):
            for c in range(n):
                self.pre[r + 1][c + 1] = (
                    matrix[r][c]
                    + self.pre[r][c + 1]
                    + self.pre[r + 1][c]
                    - self.pre[r][c]
                )

    def sum_region(self, r1: int, c1: int, r2: int, c2: int) -> int:
        """Returns sum of elements inside rectangle (r1, c1) to (r2, c2)."""
        return (
            self.pre[r2 + 1][c2 + 1]
            - self.pre[r1][c2 + 1]
            - self.pre[r2 + 1][c1]
            + self.pre[r1][c1]
        )`,
      java: `public class MatrixPrefixSum {
    private final int[][] pre;

    public MatrixPrefixSum(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        pre = new int[m + 1][n + 1];

        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                pre[r + 1][c + 1] = matrix[r][c] 
                    + pre[r][c + 1] 
                    + pre[r + 1][c] 
                    - pre[r][c];
            }
        }
    }

    public int sumRegion(int r1, int c1, int r2, int c2) {
        return pre[r2 + 1][c2 + 1] 
             - pre[r1][c2 + 1] 
             - pre[r2 + 1][c1] 
             + pre[r1][c1];
    }
}`,
      cpp: `class MatrixPrefixSum {
    vector<vector<int>> pre;

public:
    MatrixPrefixSum(const vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        pre.assign(m + 1, vector<int>(n + 1, 0));

        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                pre[r + 1][c + 1] = matrix[r][c] 
                    + pre[r][c + 1] 
                    + pre[r + 1][c] 
                    - pre[r][c];
            }
        }
    }

    int sumRegion(int r1, int c1, int r2, int c2) {
        return pre[r2 + 1][c2 + 1] 
             - pre[r1][c2 + 1] 
             - pre[r2 + 1][c1] 
             + pre[r1][c1];
    }
};`,
      typescript: `class MatrixPrefixSum {
  private pre: number[][];

  constructor(matrix: number[][]) {
    const m = matrix.length, n = matrix[0].length;
    this.pre = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        this.pre[r + 1][c + 1] =
          matrix[r][c] +
          this.pre[r][c + 1] +
          this.pre[r + 1][c] -
          this.pre[r][c];
      }
    }
  }

  sumRegion(r1: number, c1: number, r2: number, c2: number): number {
    return (
      this.pre[r2 + 1][c2 + 1] -
      this.pre[r1][c2 + 1] -
      this.pre[r2 + 1][c1] +
      this.pre[r1][c1]
    );
  }
}`,
      go: `type MatrixPrefixSum struct {
    pre [][]int
}

func NewMatrixPrefixSum(matrix [][]int) *MatrixPrefixSum {
    m, n := len(matrix), len(matrix[0])
    pre := make([][]int, m+1)
    for i := range pre {
        pre[i] = make([]int, n+1)
    }

    for r := 0; r < m; r++ {
        for c := 0; c < n; c++ {
            pre[r+1][c+1] = matrix[r][c] + pre[r][c+1] + pre[r+1][c] - pre[r][c]
        }
    }
    return &MatrixPrefixSum{pre: pre}
}

func (mps *MatrixPrefixSum) SumRegion(r1, c1, r2, c2 int) int {
    return mps.pre[r2+1][c2+1] - mps.pre[r1][c2+1] - mps.pre[r2+1][c1] + mps.pre[r1][c1]
}`
    }
  },
  {
    id: "monotonic-queue-class",
    title: "Monotonic Queue (O(1) Sliding Window Max)",
    category: "Data Structures",
    tags: ["Monotonic Queue", "Sliding Window", "Deque", "Max API"],
    description: "Monotonic Queue data structure with push, pop, and max methods in O(1) amortized time.",
    complexity: { time: "O(1) Amortized per operation", space: "O(K)" },
    isBuiltIn: true,
    code: {
      python: `from collections import deque

class MonotonicQueue:
    """Maintains monotonically decreasing elements in a deque."""
    def __init__(self):
        self.q = deque()

    def push(self, n: int) -> None:
        """Push element and pop all smaller elements from the back."""
        while self.q and self.q[-1] < n:
            self.q.pop()
        self.q.append(n)

    def max(self) -> int:
        """Returns the current maximum in O(1)."""
        return self.q[0]

    def pop(self, n: int) -> None:
        """Pop from the front only if it equals the outgoing element."""
        if self.q and self.q[0] == n:
            self.q.popleft()`,
      java: `public class MonotonicQueue {
    private final Deque<Integer> q = new ArrayDeque<>();

    public void push(int n) {
        while (!q.isEmpty() && q.peekLast() < n) {
            q.pollLast();
        }
        q.offerLast(n);
    }

    public int max() {
        return q.peekFirst();
    }

    public void pop(int n) {
        if (!q.isEmpty() && q.peekFirst() == n) {
            q.pollFirst();
        }
    }
}`,
      cpp: `class MonotonicQueue {
    deque<int> q;

public:
    void push(int n) {
        while (!q.empty() && q.back() < n) {
            q.pop_back();
        }
        q.push_back(n);
    }

    int max() const {
        return q.front();
    }

    void pop(int n) {
        if (!q.empty() && q.front() == n) {
            q.pop_front();
        }
    }
};`,
      typescript: `class MonotonicQueue {
  private q: number[] = [];

  push(n: number): void {
    while (this.q.length > 0 && this.q[this.q.length - 1] < n) {
      this.q.pop();
    }
    this.q.push(n);
  }

  max(): number {
    return this.q[0];
  }

  pop(n: number): void {
    if (this.q.length > 0 && this.q[0] === n) {
      this.q.shift();
    }
  }
}`,
      go: `type MonotonicQueue struct {
    q []int
}

func NewMonotonicQueue() *MonotonicQueue {
    return &MonotonicQueue{q: make([]int, 0)}
}

func (mq *MonotonicQueue) Push(n int) {
    for len(mq.q) > 0 && mq.q[len(mq.q)-1] < n {
        mq.q = mq.q[:len(mq.q)-1]
    }
    mq.q = append(mq.q, n)
}

func (mq *MonotonicQueue) Max() int {
    return mq.q[0]
}

func (mq *MonotonicQueue) Pop(n int) {
    if len(mq.q) > 0 && mq.q[0] == n {
        mq.q = mq.q[1:]
    }
}`
    }
  },
  {
    id: "fenwick-bit-tree",
    title: "Binary Indexed Tree (Fenwick Tree)",
    category: "Data Structures",
    tags: ["Fenwick Tree", "BIT", "Prefix Sum", "Point Update", "Range Query"],
    description: "Lightweight tree structure for O(log N) point updates and range prefix sum queries.",
    complexity: { time: "O(log N) per query/update", space: "O(N)" },
    isBuiltIn: true,
    code: {
      python: `class FenwickTree:
    """1-indexed Binary Indexed Tree for prefix sums and point updates."""
    def __init__(self, size: int):
        self.tree = [0] * (size + 1)
        self.size = size

    def update(self, i: int, delta: int) -> None:
        """Add delta to index i (1-indexed)."""
        while i <= self.size:
            self.tree[i] += delta
            i += i & (-i)

    def query(self, i: int) -> int:
        """Sum of elements from 1 to i (1-indexed)."""
        total = 0
        while i > 0:
            total += self.tree[i]
            i -= i & (-i)
        return total

    def query_range(self, left: int, right: int) -> int:
        return self.query(right) - self.query(left - 1)`,
      java: `public class FenwickTree {
    private final int[] tree;
    private final int size;

    public FenwickTree(int size) {
        this.size = size;
        this.tree = new int[size + 1];
    }

    public void update(int i, int delta) {
        for (; i <= size; i += i & (-i)) {
            tree[i] += delta;
        }
    }

    public int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & (-i)) {
            sum += tree[i];
        }
        return sum;
    }

    public int queryRange(int left, int right) {
        return query(right) - query(left - 1);
    }
}`,
      cpp: `class FenwickTree {
public:
    int size;
    vector<int> tree;

    FenwickTree(int n) : size(n), tree(n + 1, 0) {}

    void update(int i, int delta) {
        for (; i <= size; i += i & (-i)) {
            tree[i] += delta;
        }
    }

    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & (-i)) {
            sum += tree[i];
        }
        return sum;
    }

    int queryRange(int left, int right) {
        return query(right) - query(left - 1);
    }
};`,
      typescript: `class FenwickTree {
  size: number;
  tree: number[];

  constructor(size: number) {
    this.size = size;
    this.tree = new Array(size + 1).fill(0);
  }

  update(i: number, delta: number): void {
    for (; i <= this.size; i += i & -i) {
      this.tree[i] += delta;
    }
  }

  query(i: number): number {
    let sum = 0;
    for (; i > 0; i -= i & -i) {
      sum += this.tree[i];
    }
    return sum;
  }

  queryRange(left: number, right: number): number {
    return this.query(right) - this.query(left - 1);
  }
}`,
      go: `type FenwickTree struct {
    tree []int
    size int
}

func NewFenwickTree(size int) *FenwickTree {
    return &FenwickTree{tree: make([]int, size+1), size: size}
}

func (f *FenwickTree) Update(i, delta int) {
    for ; i <= f.size; i += i & (-i) {
        f.tree[i] += delta
    }
}

func (f *FenwickTree) Query(i int) int {
    sum := 0
    for ; i > 0; i -= i & (-i) {
        sum += f.tree[i]
    }
    return sum
}

func (f *FenwickTree) QueryRange(left, right int) int {
    return f.Query(right) - f.Query(left-1)
}`
    }
  },
  {
    id: "monotonic-stack-nge",
    title: "Monotonic Stack (Next Greater Element)",
    category: "Monotonic Stack",
    tags: ["Monotonic Stack", "Next Greater Element", "Stock Span", "Histogram"],
    description: "Finds next greater (or smaller) element index for every array position in single O(N) pass.",
    complexity: { time: "O(N)", space: "O(N)" },
    isBuiltIn: true,
    code: {
      python: `def next_greater_elements(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [-1] * n
    stack = []  # stores indices

    for i in range(n):
        while stack and nums[i] > nums[stack[-1]]:
            prev_idx = stack.pop()
            res[prev_idx] = i  # or nums[i]
        stack.append(i)

    return res`,
      java: `public int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    Arrays.fill(res, -1);
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
            int prevIdx = stack.pop();
            res[prevIdx] = i;
        }
        stack.push(i);
    }
    return res;
}`,
      cpp: `vector<int> nextGreaterElements(const vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n, -1);
    stack<int> st;

    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[i] > nums[st.top()]) {
            int prevIdx = st.top();
            st.pop();
            res[prevIdx] = i;
        }
        st.push(i);
    }
    return res;
}`,
      typescript: `function nextGreaterElements(nums: number[]): number[] {
  const n = nums.length;
  const res = new Array(n).fill(-1);
  const stack: number[] = [];

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      const prevIdx = stack.pop()!;
      res[prevIdx] = i;
    }
    stack.push(i);
  }
  return res;
}`,
      go: `func nextGreaterElements(nums []int) []int {
    n := len(nums)
    res := make([]int, n)
    for i := range res { res[i] = -1 }
    stack := make([]int, 0, n)

    for i := 0; i < n; i++ {
        for len(stack) > 0 && nums[i] > nums[stack[len(stack)-1]] {
            prevIdx := stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            res[prevIdx] = i
        }
        stack = append(stack, i)
    }
    return res
}`
    }
  },
  {
    id: "interval-merger",
    title: "Interval Merging & Overlap Sweep",
    category: "Intervals",
    tags: ["Intervals", "Sorting", "Greedy", "Sweep Line"],
    description: "Sorts intervals by start time and merges contiguous overlapping ranges in O(N log N).",
    complexity: { time: "O(N log N)", space: "O(N)" },
    isBuiltIn: true,
    code: {
      python: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for curr in intervals[1:]:
        prev = merged[-1]
        if curr[0] <= prev[1]:
            prev[1] = max(prev[1], curr[1])
        else:
            merged.append(curr)

    return merged`,
      java: `public int[][] mergeIntervals(int[][] intervals) {
    if (intervals == null || intervals.length == 0) return new int[0][0];
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);

    for (int i = 1; i < intervals.length; i++) {
        int[] prev = merged.get(merged.size() - 1);
        int[] curr = intervals[i];
        if (curr[0] <= prev[1]) {
            prev[1] = Math.max(prev[1], curr[1]);
        } else {
            merged.add(curr);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}`,
      cpp: `vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
        return a[0] < b[0];
    });

    vector<vector<int>> merged = {intervals[0]};
    for (int i = 1; i < (int)intervals.size(); i++) {
        auto& prev = merged.back();
        const auto& curr = intervals[i];
        if (curr[0] <= prev[1]) {
            prev[1] = max(prev[1], curr[1]);
        } else {
            merged.push_back(curr);
        }
    }
    return merged;
}`,
      typescript: `function mergeIntervals(intervals: number[][]): number[][] {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = intervals[i];
    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }
  return merged;
}`,
      go: `import "sort"

func mergeIntervals(intervals [][]int) [][]int {
    if len(intervals) == 0 { return [][]int{} }
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })

    merged := [][]int{intervals[0]}
    for i := 1; i < len(intervals); i++ {
        prev := merged[len(merged)-1]
        curr := intervals[i]
        if curr[0] <= prev[1] {
            if curr[1] > prev[1] { prev[1] = curr[1] }
        } else {
            merged = append(merged, curr)
        }
    }
    return merged
}`
    }
  }
]
