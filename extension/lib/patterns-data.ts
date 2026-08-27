// ─────────────────────────────────────────────────────────────────────────────
// AlgoVault Pattern Academy — Handcrafted Algorithmic Thinking System
// ─────────────────────────────────────────────────────────────────────────────

export type PatternDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert"

export interface AlgorithmicPattern {
  id: string
  title: string
  trigger: string
  strategy: string
  minutes: number
  difficulty: PatternDifficulty
  prerequisites: string[]
  tags: string[]
}

export interface PatternTier {
  id: string
  title: string
  subtitle: string
  patterns: AlgorithmicPattern[]
}

export interface CommonIllusion {
  looksLike: string
  actuallyIs: string
  keyDifference: string
}

export interface EvolutionStage {
  stage: string
  name: string
  desc: string
}

export interface PracticeProblem {
  title: string
  slug: string
  difficulty: "Easy" | "Medium" | "Hard"
  clue: string
}

export interface PatternExhibitData {
  mentalTrigger: string
  visualIntuition: string
  bruteForceVsPattern: {
    bruteLabel: string
    bruteTime: string
    bruteDesc: string
    patternLabel: string
    patternTime: string
    patternDesc: string
    opComparison: string
  }
  coreInsight: string
  mentalModel: {
    name: string
    metaphor: string
    explanation: string
  }
  visualInvariant: string
  universalPseudocode: string[]
  templates: {
    python: string
    java: string
    cpp: string
    rust: string
    typescript: string
  }
  dnaCard: {
    trigger: string
    invariant: string
    dataStructure: string
    timeComplexity: string
    spaceComplexity: string
    typicalConstraints: string
    difficulty: PatternDifficulty
    interviewFrequency: string
    goldenFormula: string
  }
  problemBreakthrough: {
    title: string
    problemStatement: string
    naiveApproach: string
    patternRevelation: string
    keyEquation: string
  }
  illusions: CommonIllusion[]
  evolution: EvolutionStage[]
  familyTree: {
    children: string[]
    related: string[]
    confusedWith: string[]
  }
  interviewSignals: string[]
  pitfalls: string[]
  memoryCard: {
    trigger: string
    invariant: string
    formula: string
    complexity: string
    mentalImage: string
    goldenRule: string
  }
  practiceProblems?: PracticeProblem[]
}

// ─────────────────────────────────────────────────────────────────────────────
// 16 CORE COMPETITIVE PROGRAMMING PATTERNS MATRIX
// ─────────────────────────────────────────────────────────────────────────────

export const PATTERN_TIERS: PatternTier[] = [
  {
    id: "tier-1-linear",
    title: "Tier 1: Linear & Boundary Processing",
    subtitle: "Essential array, window, pointer, and stack mechanics",
    patterns: [
      {
        id: "prefix-sum",
        title: "Prefix Sum & Cumulative Range",
        trigger: "You repeatedly need sum/count of contiguous elements between indices L and R.",
        strategy: "Precompute cumulative array P[i] = P[i-1] + A[i]. Query sum(L..R) = P[R+1] - P[L] in O(1).",
        minutes: 15,
        difficulty: "Beginner",
        prerequisites: ["Arrays"],
        tags: ["Arrays", "Range Queries", "O(1) Query"]
      },
      {
        id: "two-pointers",
        title: "Two Pointers (Inward Convergence)",
        trigger: "Searching for pairs or pairs matching a condition in a SORTED array.",
        strategy: "Maintain Left at start, Right at end. Move inwards based on monotonic sum condition.",
        minutes: 15,
        difficulty: "Beginner",
        prerequisites: ["Arrays", "Sorting"],
        tags: ["Sorted Arrays", "Pair Sum", "In-Place"]
      },
      {
        id: "sliding-window",
        title: "Sliding Window (Dynamic Boundary)",
        trigger: "Finding longest/shortest contiguous subarray matching a condition.",
        strategy: "Expand Right pointer to grow window; shrink Left pointer when condition is violated.",
        minutes: 20,
        difficulty: "Intermediate",
        prerequisites: ["Arrays", "Two Pointers"],
        tags: ["Subarrays", "Substrings", "Optimization"]
      },
      {
        id: "fast-slow-pointers",
        title: "Fast & Slow Pointers (Floyd's Cycle)",
        trigger: "Detecting loops in Linked Lists or infinite state transitions.",
        strategy: "Slow moves 1 step, Fast moves 2 steps. If a cycle exists, Fast will catch up to Slow.",
        minutes: 15,
        difficulty: "Beginner",
        prerequisites: ["Linked Lists"],
        tags: ["Linked List", "Cycle Detection", "O(1) Space"]
      },
      {
        id: "monotonic-stack",
        title: "Monotonic Stack (Next Greater Element)",
        trigger: "Finding the Next Greater or Previous Smaller element for each item in O(N).",
        strategy: "Maintain a stack of indices with strictly increasing/decreasing values.",
        minutes: 25,
        difficulty: "Intermediate",
        prerequisites: ["Stack", "Arrays"],
        tags: ["Stack", "O(N) Traversal", "Histograms"]
      },
      {
        id: "difference-array",
        title: "Difference Array (Range Updates)",
        trigger: "Applying multiple range increments [L..R] += V efficiently.",
        strategy: "Set D[L] += V and D[R+1] -= V in O(1). Compute prefix sum at the end to restore values.",
        minutes: 20,
        difficulty: "Intermediate",
        prerequisites: ["Prefix Sum"],
        tags: ["Range Updates", "O(1) Mutate", "Prefix Sum"]
      }
    ]
  },
  {
    id: "tier-2-search-sort",
    title: "Tier 2: Space Reduction & Heaps",
    subtitle: "Logarithmic binary reduction, heaps, and inplace sorting",
    patterns: [
      {
        id: "binary-search-range",
        title: "Binary Search on Search Space",
        trigger: "Finding the minimum capacity/speed or maximum value where a condition holds (isPossible(X)).",
        strategy: "Define search range [Low..High]. Evaluate Mid. Halve search space based on monotonic check.",
        minutes: 25,
        difficulty: "Intermediate",
        prerequisites: ["Binary Search"],
        tags: ["Search Space", "Optimization", "O(log N)"]
      },
      {
        id: "top-k-elements",
        title: "Top K Elements (Heap / Priority Queue)",
        trigger: "Finding the K largest, smallest, or most frequent items in a streaming or large set.",
        strategy: "Maintain a Min-Heap of size K. If heap size exceeds K, pop the smallest element.",
        minutes: 20,
        difficulty: "Intermediate",
        prerequisites: ["Heap", "Priority Queue"],
        tags: ["Heap", "Streaming", "O(N log K)"]
      },
      {
        id: "overlapping-intervals",
        title: "Interval Merging & Scheduling",
        trigger: "Given start and end times, merge overlapping intervals or maximize non-overlapping events.",
        strategy: "Sort intervals by start time. Iterate and merge if current.start <= previous.end.",
        minutes: 20,
        difficulty: "Intermediate",
        prerequisites: ["Sorting"],
        tags: ["Intervals", "Greedy", "Sorting"]
      },
      {
        id: "cyclic-sort",
        title: "Cyclic Sort (O(N) In-Place Sorting)",
        trigger: "Array contains numbers from 1 to N, find missing or duplicate numbers in O(N) time and O(1) space.",
        strategy: "Iterate array: while nums[i] != nums[nums[i]-1], swap nums[i] with nums[nums[i]-1].",
        minutes: 20,
        difficulty: "Intermediate",
        prerequisites: ["Arrays"],
        tags: ["In-Place", "Permutation", "O(1) Space"]
      }
    ]
  },
  {
    id: "tier-3-graph-tree",
    title: "Tier 3: Tree, Graph & Component Traversal",
    subtitle: "Structural recursion, level order BFS, flood fill, and topological ordering",
    patterns: [
      {
        id: "bfs-dfs-trees",
        title: "Tree BFS Level-Order & DFS Traversal",
        trigger: "Exploring tree levels, finding shortest path to leaf, or path sum in hierarchical tree.",
        strategy: "Use Queue for BFS level-by-level; use Recursion/Stack for DFS path exploration.",
        minutes: 25,
        difficulty: "Intermediate",
        prerequisites: ["Trees", "Recursion"],
        tags: ["Trees", "BFS", "DFS", "Level Order"]
      },
      {
        id: "matrix-traversal",
        title: "Matrix Grid Flood Fill (BFS / DFS)",
        trigger: "Counting connected islands, shortest path in grid, or spreading propagation.",
        strategy: "Iterate grid cells. Use 4-directional BFS/DFS with vis array or in-place modification.",
        minutes: 25,
        difficulty: "Intermediate",
        prerequisites: ["Grid", "Graphs"],
        tags: ["2D Grid", "Flood Fill", "Islands"]
      },
      {
        id: "union-find",
        title: "Disjoint Set Union (DSU)",
        trigger: "Dynamic connectivity queries, counting connected components, or detecting graph cycles.",
        strategy: "Maintain parent[] array with path compression and rank optimization. union(u, v) in O(α(N)).",
        minutes: 30,
        difficulty: "Advanced",
        prerequisites: ["Graphs", "Trees"],
        tags: ["DSU", "Connected Components", "Graph"]
      },
      {
        id: "topological-sort",
        title: "Topological Sort (Kahn's Algorithm)",
        trigger: "Task scheduling with prerequisites, build systems, or ordering directed acyclic graphs.",
        strategy: "Calculate in-degrees. Push 0 in-degree nodes into Queue. Pop and decrement neighbors.",
        minutes: 30,
        difficulty: "Advanced",
        prerequisites: ["Graphs", "Queue"],
        tags: ["DAG", "In-Degree", "Kahn Algorithm"]
      }
    ]
  },
  {
    id: "tier-4-dp-advanced",
    title: "Tier 4: Dynamic Programming & Advanced DS",
    subtitle: "Optimal substructure, decision trees, and range tree query structures",
    patterns: [
      {
        id: "knapsack-dp",
        title: "0/1 Knapsack & Subset DP",
        trigger: "Given weights and values, find maximum value under capacity constraint W, or subset sum equal to target.",
        strategy: "Define dp[i][w] = max value using first i items and weight w. State transition: include or exclude.",
        minutes: 35,
        difficulty: "Advanced",
        prerequisites: ["Recursion", "Memoization"],
        tags: ["DP", "Subset Sum", "Optimization"]
      },
      {
        id: "segment-tree",
        title: "Segment Tree & Point/Range Updates",
        trigger: "Point updates with range minimum/maximum/sum queries in O(log N) time dynamically.",
        strategy: "Build binary tree over array range [0..N-1]. Each node stores aggregated range value.",
        minutes: 40,
        difficulty: "Expert",
        prerequisites: ["Binary Trees", "Recursion"],
        tags: ["Segment Tree", "O(log N) Query", "Range Mutate"]
      }
    ]
  }
]

export const ALL_PATTERNS = PATTERN_TIERS.flatMap((t) => t.patterns)

// ─────────────────────────────────────────────────────────────────────────────
// TAILOR-MADE EXHIBITS FOR ALL 16 PATTERNS (NO MIXED/GENERIC DATA)
// ─────────────────────────────────────────────────────────────────────────────

export const PATTERN_EXHIBITS: Record<string, PatternExhibitData> = {
  "prefix-sum": {
    mentalTrigger: "You repeatedly need the sum or count of contiguous elements between indices L and R.",
    visualIntuition: `
  Original Array A:   [  3  |  1  |  4  |  2  |  5  ]
  Prefix Array P:     [  0  |  3  |  4  |  8  | 10  | 15 ]
                             ↑                 ↑
                           P[1]=3            P[4]=10

  Range Sum(1..3) = P[4] - P[1] = 10 - 3 = 7
  (Verified: A[1] + A[2] + A[3] = 1 + 4 + 2 = 7)
    `,
    bruteForceVsPattern: {
      bruteLabel: "Iterative Range Loop",
      bruteTime: "O(Q × N)",
      bruteDesc: "Loops over elements from L to R for every query. For 100,000 queries, performs 10 billion additions.",
      patternLabel: "Prefix Sum Lookup",
      patternTime: "O(N) prep + O(1) query",
      patternDesc: "Precomputes cumulative sum in one O(N) pass. Every subsequent range sum query takes exactly 1 subtraction.",
      opComparison: "10,000,000,000 ops → 100,001 ops (100,000x speedup)"
    },
    coreInsight: "We trade a single O(N) preprocessing step for instant O(1) range queries.",
    mentalModel: {
      name: "The Odometer Metaphor",
      metaphor: "Distance driven between Mile 10 and Mile 40 is simply Odometer(40) - Odometer(10).",
      explanation: "Instead of re-measuring distance step by step, we take the difference of accumulated totals."
    },
    visualInvariant: "P[i] always equals the sum of all array elements from index 0 up to i-1.",
    universalPseudocode: [
      "P = array of size N + 1 filled with 0",
      "for i from 0 to N-1:",
      "    P[i + 1] = P[i] + nums[i]",
      "function query(L, R):",
      "    return P[R + 1] - P[L]"
    ],
    templates: {
      python: `class PrefixSum:
    def __init__(self, nums: list[int]):
        self.P = [0] * (len(nums) + 1)
        for i, num in enumerate(nums):
            self.P[i + 1] = self.P[i] + num

    def query(self, L: int, R: int) -> int:
        return self.P[R + 1] - self.P[L]`,
      java: `public class PrefixSum {
    private int[] P;

    public PrefixSum(int[] nums) {
        P = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            P[i + 1] = P[i] + nums[i];
        }
    }

    public int query(int L, int R) {
        return P[R + 1] - P[L];
    }
}`,
      cpp: `class PrefixSum {
    vector<int> P;
public:
    PrefixSum(const vector<int>& nums) : P(nums.size() + 1, 0) {
        for (size_t i = 0; i < nums.size(); ++i) {
            P[i + 1] = P[i] + nums[i];
        }
    }

    int query(int L, int R) const {
        return P[R + 1] - P[L];
    }
};`,
      rust: `struct PrefixSum {
    p: Vec<i32>,
}

impl PrefixSum {
    fn new(nums: &[i32]) -> Self {
        let mut p = vec![0; nums.len() + 1];
        for i in 0..nums.len() {
            p[i + 1] = p[i] + nums[i];
        }
        PrefixSum { p }
    }

    fn query(&self, l: usize, r: usize) -> i32 {
        self.p[r + 1] - self.p[l]
    }
}`,
      typescript: `class PrefixSum {
  private P: number[];

  constructor(nums: number[]) {
    this.P = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
      this.P[i + 1] = this.P[i] + nums[i];
    }
  }

  query(L: number, R: number): number {
    return this.P[R + 1] - this.P[L];
  }
}`
    },
    dnaCard: {
      trigger: "Contiguous range sum query",
      invariant: "P[k] = sum(0..k-1)",
      dataStructure: "Array",
      timeComplexity: "O(1) Query, O(N) Prep",
      spaceComplexity: "O(N)",
      typicalConstraints: "N ≤ 10^5, Q ≤ 10^5",
      difficulty: "Beginner",
      interviewFrequency: "Extremely High (95%)",
      goldenFormula: "RangeSum(L..R) = P[R+1] - P[L]"
    },
    problemBreakthrough: {
      title: "LeetCode 560: Subarray Sum Equals K",
      problemStatement: "Given an array of integers nums and an integer k, return total subarrays whose sum equals k.",
      naiveApproach: "Nested loops checking every pair (i, j) taking O(N²) time.",
      patternRevelation: "Subarray sum(i..j) = P[j] - P[i] = K  ⇒  P[i] = P[j] - K. Use a Hash Map to count frequency of P[j] - K in O(N) time!",
      keyEquation: "target_prefix_sum = current_prefix_sum - K"
    },
    illusions: [
      {
        looksLike: "Sliding Window",
        actuallyIs: "Prefix Sum + Hash Map",
        keyDifference: "Sliding Window fails when array contains negative numbers because monotonicity is broken!"
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "Brute Force Loop", desc: "O(N) per range query" },
      { stage: "Tier 2", name: "Prefix Sum", desc: "O(1) static range query" },
      { stage: "Tier 3", name: "Difference Array", desc: "O(1) range updates" },
      { stage: "Tier 4", name: "Segment Tree", desc: "O(log N) dynamic mutate + query" }
    ],
    familyTree: {
      children: ["difference-array", "segment-tree"],
      related: ["sliding-window"],
      confusedWith: ["sliding-window"]
    },
    interviewSignals: ["Subarray sum", "Range sum query", "Cumulative total"],
    pitfalls: [
      "Forgetting to pad prefix array with P[0] = 0 (causes 1-off index bugs).",
      "Using Prefix Sum on dynamic arrays with frequent point updates (use Segment Tree instead)."
    ],
    memoryCard: {
      trigger: "Range sum between L and R",
      invariant: "P[i] = sum(0..i-1)",
      formula: "P[R+1] - P[L]",
      complexity: "O(1) Query",
      mentalImage: "Odometer Mile Marker",
      goldenRule: "Precompute totals, subtract starting marker"
    },
    practiceProblems: [
      { title: "Range Sum Query - Immutable", slug: "range-sum-query-immutable", difficulty: "Easy", clue: "Precompute prefix sum array for O(1) subarray range sum queries." },
      { title: "Subarray Sum Equals K", slug: "subarray-sum-equals-k", difficulty: "Medium", clue: "Use Hash Map to store frequency of prefix sums P[j] - P[i] = K." },
      { title: "Continuous Subarray Sum", slug: "continuous-subarray-sum", difficulty: "Medium", clue: "Track prefix sum remainders modulo K in a Hash Map." },
      { title: "Product of Array Except Self", slug: "product-of-array-except-self", difficulty: "Medium", clue: "Build prefix product array and suffix product array without division." },
      { title: "Find Pivot Index", slug: "find-pivot-index", difficulty: "Easy", clue: "Compare left sum with total sum minus left sum minus current element." },
      { title: "Subarray Sums Divisible by K", slug: "subarray-sums-divisible-by-k", difficulty: "Medium", clue: "Track prefix sum remainder counts modulo K." },
      { title: "Random Pick with Weight", slug: "random-pick-with-weight", difficulty: "Medium", clue: "Build prefix sum array and binary search the random target weight." }
    ]
  },

  "two-pointers": {
    mentalTrigger: "Searching for pair sum, palindrome, or target condition in a SORTED array.",
    visualIntuition: `
  Sorted Array:   [  1  |  3  |  4  |  6  |  8  | 11  ]
                  L ↑                               ↑ R
                  Sum = 1 + 11 = 12 > Target(10) → Move R left!

                  [  1  |  3  |  4  |  6  |  8  | 11  ]
                  L ↑                         ↑ R
                  Sum = 1 + 8 = 9 < Target(10) → Move L right!

                  [  1  |  3  |  4  |  6  |  8  | 11  ]
                        L ↑                   ↑ R
                        Sum = 3 + 8 = 11 > Target(10) → Move R left!

                  [  1  |  3  |  4  |  6  |  8  | 11  ]
                        L ↑             ↑ R
                        Sum = 3 + 6 = 9 < Target(10) → Move L right!

                  [  1  |  3  |  4  |  6  |  8  | 11  ]
                              L ↑       ↑ R
                              Sum = 4 + 6 = 10 == Target(10) ✓ FOUND!
    `,
    bruteForceVsPattern: {
      bruteLabel: "Nested Pair Loops",
      bruteTime: "O(N²)",
      bruteDesc: "Compares every element with every other element using two nested loops.",
      patternLabel: "Inward Two Pointers",
      patternTime: "O(N)",
      patternDesc: "Moves Left rightward or Right leftward. Each step eliminates an entire row or column of possibilities.",
      opComparison: "1,000,000 pair checks → 1,000 pointer steps"
    },
    coreInsight: "Sorting creates monotonicity: if sum is too large, ONLY moving Right leftward can reduce it.",
    mentalModel: {
      name: "The Vice Grip Metaphor",
      metaphor: "Squeezing a vice from both ends inward until the exact fit is found.",
      explanation: "No candidate pairs outside the pointers need to be checked because sorted order guarantees they fail."
    },
    visualInvariant: "All pair candidates outside [L..R] are mathematically guaranteed not to sum to target.",
    universalPseudocode: [
      "L = 0, R = N - 1",
      "while L < R:",
      "    current_sum = nums[L] + nums[R]",
      "    if current_sum == target: return [L, R]",
      "    else if current_sum < target: L += 1",
      "    else: R -= 1"
    ],
    templates: {
      python: `def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    L, R = 0, len(nums) - 1
    while L < R:
        s = nums[L] + nums[R]
        if s == target:
            return [L, R]
        elif s < target:
            L += 1
        else:
            R -= 1
    return []`,
      java: `public int[] twoSumSorted(int[] nums, int target) {
    int L = 0, R = nums.length - 1;
    while (L < R) {
        int sum = nums[L] + nums[R];
        if (sum == target) return new int[]{L, R};
        else if (sum < target) L++;
        else R--;
    }
    return new int[]{};
}`,
      cpp: `vector<int> twoSumSorted(const vector<int>& nums, int target) {
    int L = 0, R = nums.size() - 1;
    while (L < R) {
        int sum = nums[L] + nums[R];
        if (sum == target) return {L, R};
        else if (sum < target) L++;
        else R--;
    }
    return {};
}`,
      rust: `fn two_sum_sorted(nums: &[i32], target: i32) -> Vec<usize> {
    let (mut l, mut r) = (0, nums.len() - 1);
    while l < r {
        let sum = nums[l] + nums[r];
        if sum == target { return vec![l, r]; }
        else if sum < target { l += 1; }
        else { r -= 1; }
    }
    vec![]
}`,
      typescript: `function twoSumSorted(nums: number[], target: number): number[] {
  let L = 0, R = nums.length - 1;
  while (L < R) {
    const sum = nums[L] + nums[R];
    if (sum === target) return [L, R];
    else if (sum < target) L++;
    else R--;
  }
  return [];
}`
    },
    dnaCard: {
      trigger: "Pair search in sorted array",
      invariant: "Candidate pair lies within [L..R]",
      dataStructure: "Array / Pointers",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)",
      typicalConstraints: "N ≤ 10^5",
      difficulty: "Beginner",
      interviewFrequency: "High",
      goldenFormula: "L++ if sum < target else R--"
    },
    problemBreakthrough: {
      title: "LeetCode 167: Two Sum II (Input Array Is Sorted)",
      problemStatement: "Find two numbers in 1-indexed sorted array that add up to target.",
      naiveApproach: "Check all pairs taking O(N²) time.",
      patternRevelation: "Since array is sorted, sum = A[L] + A[R]. If sum < target, L MUST increase. If sum > target, R MUST decrease. Solved in O(N) time and O(1) space!",
      keyEquation: "L++ when sum < target, R-- when sum > target"
    },
    illusions: [
      {
        looksLike: "Binary Search",
        actuallyIs: "Two Pointers",
        keyDifference: "Two Pointers finds PAIRS in O(N), whereas Binary Search finds single elements in O(log N)."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "Nested Loops", desc: "O(N²) pair search" },
      { stage: "Tier 2", name: "Two Pointers", desc: "O(N) convergence on sorted array" }
    ],
    familyTree: {
      children: ["sliding-window", "fast-slow-pointers"],
      related: ["binary-search-range"],
      confusedWith: ["sliding-window"]
    },
    interviewSignals: ["Sorted array pair sum", "Container with most water", "3Sum / 4Sum"],
    pitfalls: [
      "Using Two Pointers on UNSORTED arrays without sorting first.",
      "Off-by-one loop condition (using L <= R instead of L < R when pair elements must be distinct)."
    ],
    memoryCard: {
      trigger: "Sorted array pair target",
      invariant: "Candidate in [L..R]",
      formula: "Move L right if sum low, R left if high",
      complexity: "O(N)",
      mentalImage: "Vice Grip Squeezing Inward",
      goldenRule: "Exploit sorted order monotonicity"
    },
    practiceProblems: [
      { title: "Two Sum II - Input Array Is Sorted", slug: "two-sum-ii-input-array-is-sorted", difficulty: "Medium", clue: "Inward L & R pointers on sorted array based on sum vs target." },
      { title: "3Sum", slug: "3sum", difficulty: "Medium", clue: "Sort array, fix outer index i, run Two Pointers on remaining subarray." },
      { title: "Container With Most Water", slug: "container-with-most-water", difficulty: "Medium", clue: "Move the pointer pointing to the shorter line inward to maximize area." },
      { title: "Trapping Rain Water", slug: "trapping-rain-water", difficulty: "Hard", clue: "Track maxLeft and maxRight bounds with inward L & R pointers." },
      { title: "Valid Palindrome", slug: "valid-palindrome", difficulty: "Easy", clue: "Compare characters from outer bounds inward while skipping non-alphanumeric." },
      { title: "Sort Colors (Dutch National Flag)", slug: "sort-colors", difficulty: "Medium", clue: "Partition array into 3 sections using low, mid, and high pointers." },
      { title: "Remove Duplicates from Sorted Array", slug: "remove-duplicates-from-sorted-array", difficulty: "Easy", clue: "Slow write pointer and fast read pointer scanning sorted array." }
    ]
  },

  "sliding-window": {
    mentalTrigger: "Finding longest/shortest contiguous subarray/substring meeting a constraint.",
    visualIntuition: `
  Array:    [ 2 | 1 | 5 | 1 | 3 | 2 ]    Target Threshold K = 7
  Step 1:   [ 2 ]                        Window Sum = 2  (Valid, Max Len = 1)
  Step 2:   [ 2 | 1 ]                    Window Sum = 3  (Valid, Max Len = 2)
  Step 3:   [ 2 | 1 | 5 ]                Window Sum = 8 > 7 (INVALID!) → Shrink Left!
  Step 4:     [ 1 | 5 ]                  Window Sum = 6  (Valid, Max Len = 2)
  Step 5:     [ 1 | 5 | 1 ]              Window Sum = 7  (Valid, Max Len = 3)
  Step 6:       [ 5 | 1 | 3 ]            Window Sum = 9 > 7 (INVALID!) → Shrink Left!
    `,
    bruteForceVsPattern: {
      bruteLabel: "All Subarray Enumerate",
      bruteTime: "O(N²)",
      bruteDesc: "Generates all N*(N+1)/2 subarrays and sums each one.",
      patternLabel: "Sliding Window",
      patternTime: "O(N)",
      patternDesc: "Right pointer expands window; Left pointer shrinks it. Each index is visited at most twice.",
      opComparison: "50,000,000 subarray checks → 200,000 pointer shifts"
    },
    coreInsight: "When expanding Right makes condition invalid, shrinking Left is guaranteed to make it valid again.",
    mentalModel: {
      name: "The Breathing Lung Metaphor",
      metaphor: "The window expands on inhale (R++) and contracts on exhale (L++) to maintain valid internal pressure.",
      explanation: "Instead of rebuilding the window from scratch, we incrementally add incoming elements and drop outgoing ones."
    },
    visualInvariant: "Window [L..R] maintains the state of currently active contiguous elements.",
    universalPseudocode: [
      "L = 0, state = empty",
      "for R from 0 to N-1:",
      "    add nums[R] to state",
      "    while state is invalid:",
      "        remove nums[L] from state",
      "        L += 1",
      "    update max_length = max(max_length, R - L + 1)"
    ],
    templates: {
      python: `def max_subarray_length(nums: list[int], k: int) -> int:
    L, cur_sum, max_len = 0, 0, 0
    for R in range(len(nums)):
        cur_sum += nums[R]
        while cur_sum > k and L <= R:
            cur_sum -= nums[L]
            L += 1
        max_len = max(max_len, R - L + 1)
    return max_len`,
      java: `public int maxSubarrayLength(int[] nums, int k) {
    int L = 0, sum = 0, maxLen = 0;
    for (int R = 0; R < nums.length; R++) {
        sum += nums[R];
        while (sum > k && L <= R) {
            sum -= nums[L];
            L++;
        }
        maxLen = Math.max(maxLen, R - L + 1);
    }
    return maxLen;
}`,
      cpp: `int maxSubarrayLength(const vector<int>& nums, int k) {
    int L = 0, sum = 0, maxLen = 0;
    for (int R = 0; R < (int)nums.size(); ++R) {
        sum += nums[R];
        while (sum > k && L <= R) {
            sum -= nums[L];
            L++;
        }
        maxLen = max(maxLen, R - L + 1);
    }
    return maxLen;
}`,
      rust: `fn max_subarray_length(nums: &[i32], k: i32) -> usize {
    let (mut l, mut sum, mut max_len) = (0, 0, 0);
    for r in 0..nums.len() {
        sum += nums[r];
        while sum > k && l <= r {
            sum -= nums[l];
            l += 1;
        }
        max_len = max_len.max(r - l + 1);
    }
    max_len
}`,
      typescript: `function maxSubarrayLength(nums: number[], k: number): number {
  let L = 0, sum = 0, maxLen = 0;
  for (let R = 0; R < nums.length; R++) {
    sum += nums[R];
    while (sum > k && L <= R) {
      sum -= nums[L];
      L++;
    }
    maxLen = Math.max(maxLen, R - L + 1);
  }
  return maxLen;
}`
    },
    dnaCard: {
      trigger: "Contiguous subarray length/sum optimization",
      invariant: "Window [L..R] maintains valid state",
      dataStructure: "Array / Hash Table",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1) / O(K)",
      typicalConstraints: "N ≤ 10^5",
      difficulty: "Intermediate",
      interviewFrequency: "Extremely High (90%)",
      goldenFormula: "Expand R, Shrink L when invalid, Length = R - L + 1"
    },
    problemBreakthrough: {
      title: "LeetCode 3: Longest Substring Without Repeating Characters",
      problemStatement: "Find length of longest substring without repeating characters.",
      naiveApproach: "Check all substrings for uniqueness in O(N³) time.",
      patternRevelation: "Maintain a set of characters in window [L..R]. When nums[R] is duplicate, shrink L until duplicate is removed. Runs in O(N) time!",
      keyEquation: "Window size = R - L + 1"
    },
    illusions: [
      {
        looksLike: "Two Pointers",
        actuallyIs: "Sliding Window",
        keyDifference: "Two Pointers move inwards on sorted arrays; Sliding Window moves in same direction (R expanding, L following)."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "Brute Subarrays", desc: "O(N²)" },
      { stage: "Tier 2", name: "Sliding Window", desc: "O(N) dynamic window" }
    ],
    familyTree: {
      children: ["prefix-sum"],
      related: ["two-pointers"],
      confusedWith: ["two-pointers"]
    },
    interviewSignals: ["Longest substring with K distinct", "Minimum window substring", "Max consecutive ones"],
    pitfalls: [
      "Resetting L back to 0 (destroys O(N) linear performance).",
      "Updating max_len while window state is invalid."
    ],
    memoryCard: {
      trigger: "Contiguous subarray/substring",
      invariant: "State of [L..R]",
      formula: "R - L + 1",
      complexity: "O(N)",
      mentalImage: "Breathing Window",
      goldenRule: "Expand R, Shrink L, Never Reset"
    },
    practiceProblems: [
      { title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock", difficulty: "Easy", clue: "Track minimum buy price and maximum profit window." },
      { title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", difficulty: "Medium", clue: "Expand R, shrink L when character frequency exceeds 1." },
      { title: "Longest Repeating Character Replacement", slug: "longest-repeating-character-replacement", difficulty: "Medium", clue: "Maintain window where (window size - max frequency) <= K." },
      { title: "Minimum Window Substring", slug: "minimum-window-substring", difficulty: "Hard", clue: "Expand R until all required characters match, shrink L to find minimum." },
      { title: "Sliding Window Maximum", slug: "sliding-window-maximum", difficulty: "Hard", clue: "Monotonic deque storing indices in decreasing order of values." },
      { title: "Permutation in String", slug: "permutation-in-string", difficulty: "Medium", clue: "Fixed window size equal to length of pattern string s1." },
      { title: "Max Consecutive Ones III", slug: "max-consecutive-ones-iii", difficulty: "Medium", clue: "Dynamic window allowing at most K zero flips." }
    ]
  },

  "fast-slow-pointers": {
    mentalTrigger: "Detecting cycles or finding middle element in a Linked List.",
    visualIntuition: `
  Linked List Cycle:  1 ──► 2 ──► 3 ──► 4
                            ▲           │
                            └───────────┘
  Step 0: Slow @ 1, Fast @ 1
  Step 1: Slow @ 2, Fast @ 3
  Step 2: Slow @ 3, Fast @ 2  (Fast looped around!)
  Step 3: Slow @ 4, Fast @ 4  (MATCH! Cycle Detected ✓)
    `,
    bruteForceVsPattern: {
      bruteLabel: "Visited Node Hash Set",
      bruteTime: "O(N) Time, O(N) Space",
      bruteDesc: "Stores visited nodes in a Hash Set to spot repeats.",
      patternLabel: "Floyd's Tortoise & Hare",
      patternTime: "O(N) Time, O(1) Space",
      patternDesc: "Uses two pointers moving at speed 1x and 2x. If cycle exists, they must collide inside cycle.",
      opComparison: "O(N) extra memory → O(1) zero extra memory"
    },
    coreInsight: "Inside a cycle of length C, Fast closes distance to Slow by 1 step every turn.",
    mentalModel: {
      name: "Racetrack Loop Metaphor",
      metaphor: "A faster runner on a circular track will always lap the slower runner.",
      explanation: "Relative speed difference (2 - 1 = 1) guarantees collision within loop length steps."
    },
    visualInvariant: "Fast will always catch up to Slow if and only if a cycle exists.",
    universalPseudocode: [
      "slow = head, fast = head",
      "while fast and fast.next:",
      "    slow = slow.next",
      "    fast = fast.next.next",
      "    if slow == fast: return True",
      "return False"
    ],
    templates: {
      python: `def hasCycle(head) -> bool:
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
      java: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
      cpp: `bool hasCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
      rust: `// Fast & Slow Pointers Cycle Detection
fn has_cycle(head: Option<&Node>) -> bool {
    let mut slow = head;
    let mut fast = head;
    while let Some(f) = fast {
        if let Some(f_next) = f.next {
            fast = f_next.next;
            slow = slow.unwrap().next;
            if std::ptr::eq(slow.unwrap(), fast.unwrap()) { return true; }
        } else { break; }
    }
    false
}`,
      typescript: `function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`
    },
    dnaCard: {
      trigger: "Cycle detection or middle node in list",
      invariant: "Fast moves 2x, Slow moves 1x",
      dataStructure: "Linked List / Array Pointer",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)",
      typicalConstraints: "N ≤ 10^5",
      difficulty: "Beginner",
      interviewFrequency: "High",
      goldenFormula: "slow = slow.next, fast = fast.next.next"
    },
    problemBreakthrough: {
      title: "LeetCode 141: Linked List Cycle",
      problemStatement: "Determine if linked list has a cycle in O(1) memory.",
      naiveApproach: "Use HashSet to track visited nodes using O(N) extra space.",
      patternRevelation: "Floyd's algorithm: slow moves 1 step, fast moves 2 steps. If cycle exists, fast catches slow in O(N) time and O(1) space!",
      keyEquation: "Relative speed = 2 - 1 = 1 node per step"
    },
    illusions: [
      {
        looksLike: "Standard Traversal",
        actuallyIs: "Fast & Slow Pointers",
        keyDifference: "Standard traversal gets stuck in infinite loops without cycle detection mechanics."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "HashSet Memory", desc: "O(N) space" },
      { stage: "Tier 2", name: "Floyd's Cycle", desc: "O(1) space" }
    ],
    familyTree: {
      children: [],
      related: ["two-pointers"],
      confusedWith: ["two-pointers"]
    },
    interviewSignals: ["Detect cycle in list", "Find middle of linked list", "Happy number"],
    pitfalls: [
      "NullPointer dereference checking fast.next before fast.next.next.",
      "Not accounting for lists of length 0 or 1."
    ],
    memoryCard: {
      trigger: "List loop or mid-point",
      invariant: "Fast moves 2x speed",
      formula: "slow.next vs fast.next.next",
      complexity: "O(1) Space",
      mentalImage: "Runners on Track",
      goldenRule: "Fast catches slow inside cycle"
    },
    practiceProblems: [
      { title: "Linked List Cycle", slug: "linked-list-cycle", difficulty: "Easy", clue: "Floyd's 1x slow and 2x fast pointer collision detection." },
      { title: "Linked List Cycle II", slug: "linked-list-cycle-ii", difficulty: "Medium", clue: "Reset slow to head after collision to locate exact cycle start node." },
      { title: "Middle of the Linked List", slug: "middle-of-the-linked-list", difficulty: "Easy", clue: "When fast hits end of list, slow is at exact middle node." },
      { title: "Happy Number", slug: "happy-number", difficulty: "Easy", clue: "Detect digit square sum loops using fast and slow pointers." },
      { title: "Find the Duplicate Number", slug: "find-the-duplicate-number", difficulty: "Medium", clue: "Treat array indices as linked list pointers and find cycle entrance." },
      { title: "Palindrome Linked List", slug: "palindrome-linked-list", difficulty: "Easy", clue: "Find middle with fast/slow pointers, reverse second half, compare." },
      { title: "Reorder List", slug: "reorder-list", difficulty: "Medium", clue: "Find mid node with fast/slow, reverse second half, interleave lists." }
    ]
  },

  "monotonic-stack": {
    mentalTrigger: "Finding Next Greater or Previous Smaller element for each array item.",
    visualIntuition: `
  Array:    [ 2 | 1 | 5 | 6 | 2 | 3 ]

  Stack Processing Next Greater Element (NGE):
  i=0 (val 2): Stack = [0]
  i=1 (val 1): Stack = [0, 1]
  i=2 (val 5): 5 > 1 (Pop 1, NGE[1]=5), 5 > 2 (Pop 0, NGE[0]=5) → Stack = [2]
  i=3 (val 6): Stack = [2, 3]
  i=4 (val 2): Stack = [2, 3, 4]
  i=5 (val 3): 3 > 2 (Pop 4, NGE[4]=3) → Stack = [2, 3, 5]
    `,
    bruteForceVsPattern: {
      bruteLabel: "Nested Forward Loop",
      bruteTime: "O(N²)",
      bruteDesc: "For each element, searches forward until finding a larger value.",
      patternLabel: "Monotonic Stack",
      patternTime: "O(N)",
      patternDesc: "Each index is pushed once and popped once. Total stack operations = 2N.",
      opComparison: "10,000,000 checks → 200,000 stack ops"
    },
    coreInsight: "Elements in stack are kept strictly ordered. An incoming larger element resolves NGE for all smaller items on top.",
    mentalModel: {
      name: "Line of Sight Metaphor",
      metaphor: "Standing in a line of buildings: taller buildings block view of shorter ones behind them.",
      explanation: "Elements that can no longer be the 'next greater' are popped permanently."
    },
    visualInvariant: "Stack elements remain strictly monotonic (decreasing or increasing).",
    universalPseudocode: [
      "stack = empty",
      "for i from 0 to N-1:",
      "    while stack and nums[i] > nums[stack.top()]:",
      "        idx = stack.pop()",
      "        result[idx] = nums[i]",
      "    stack.push(i)"
    ],
    templates: {
      python: `def nextGreaterElement(nums: list[int]) -> list[int]:
    N = len(nums)
    res = [-1] * N
    stack = []  # stores indices
    for i in range(N):
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            res[idx] = nums[i]
        stack.append(i)
    return res`,
      java: `public int[] nextGreaterElement(int[] nums) {
    int N = nums.length;
    int[] res = new int[N];
    Arrays.fill(res, -1);
    Stack<Integer> stack = new Stack<>();
    for (int i = 0; i < N; i++) {
        while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
            res[stack.pop()] = nums[i];
        }
        stack.push(i);
    }
    return res;
}`,
      cpp: `vector<int> nextGreaterElement(const vector<int>& nums) {
    int N = nums.size();
    vector<int> res(N, -1);
    stack<int> st;
    for (int i = 0; i < N; ++i) {
        while (!st.empty() && nums[i] > nums[st.top()]) {
            res[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return res;
}`,
      rust: `fn next_greater_element(nums: &[i32]) -> Vec<i32> {
    let mut res = vec![-1; nums.len()];
    let mut stack = Vec::new();
    for i in 0..nums.len() {
        while let Some(&top) = stack.last() {
            if nums[i] > nums[top] {
                res[stack.pop().unwrap()] = nums[i];
            } else { break; }
        }
        stack.push(i);
    }
    res
}`,
      typescript: `function nextGreaterElement(nums: number[]): number[] {
  const N = nums.length;
  const res = new Array(N).fill(-1);
  const stack: number[] = [];
  for (let i = 0; i < N; i++) {
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop()!;
      res[idx] = nums[i];
    }
    stack.push(i);
  }
  return res;
}`
    },
    dnaCard: {
      trigger: "Next greater or previous smaller element",
      invariant: "Stack elements strictly monotonic",
      dataStructure: "Stack",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      typicalConstraints: "N ≤ 10^5",
      difficulty: "Intermediate",
      interviewFrequency: "High",
      goldenFormula: "Pop while nums[i] > nums[stack.top()]"
    },
    problemBreakthrough: {
      title: "LeetCode 739: Daily Temperatures",
      problemStatement: "Return array where answer[i] is number of days until warmer temperature.",
      naiveApproach: "Forward scan for each day taking O(N²) time.",
      patternRevelation: "Use Monotonic Stack of day indices. Pop top index when current temp is warmer. Solves problem in O(N) time!",
      keyEquation: "days_waited = current_day - popped_day"
    },
    illusions: [
      {
        looksLike: "Sliding Window",
        actuallyIs: "Monotonic Stack",
        keyDifference: "Sliding Window finds contiguous range lengths; Monotonic Stack finds nearest boundary elements."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "Brute Scan", desc: "O(N²)" },
      { stage: "Tier 2", name: "Monotonic Stack", desc: "O(N) single pass" }
    ],
    familyTree: {
      children: [],
      related: ["sliding-window"],
      confusedWith: ["sliding-window"]
    },
    interviewSignals: ["Next greater element", "Largest rectangle in histogram", "Trapping rain water"],
    pitfalls: [
      "Storing values instead of indices in stack (prevents calculating distance/index gaps).",
      "Using wrong inequality (> vs >=) causing issues with duplicate elements."
    ],
    memoryCard: {
      trigger: "Next greater / previous smaller",
      invariant: "Stack values strictly ordered",
      formula: "Pop while incoming > top",
      complexity: "O(N)",
      mentalImage: "Building Line of Sight",
      goldenRule: "Store indices, resolve on pop"
    },
    practiceProblems: [
      { title: "Next Greater Element I", slug: "next-greater-element-i", difficulty: "Easy", clue: "Monotonic decreasing stack mapping element to next greater value." },
      { title: "Daily Temperatures", slug: "daily-temperatures", difficulty: "Medium", clue: "Store day indices on stack; compute day difference when popping." },
      { title: "Online Stock Span", slug: "online-stock-span", difficulty: "Medium", clue: "Monotonic stack storing [price, cumulative span] pairs." },
      { title: "Car Fleet", slug: "car-fleet", difficulty: "Medium", clue: "Sort cars by position, push arrival time onto monotonic stack." },
      { title: "Largest Rectangle in Histogram", slug: "largest-rectangle-in-histogram", difficulty: "Hard", clue: "Monotonic increasing stack to determine left & right height boundaries." },
      { title: "Trapping Rain Water", slug: "trapping-rain-water", difficulty: "Hard", clue: "Pop valley index from stack and calculate bounded water height." },
      { title: "Sum of Subarray Minimums", slug: "sum-of-subarray-minimums", difficulty: "Medium", clue: "Previous smaller & next smaller element counts via monotonic stack." }
    ]
  },

  "difference-array": {
    mentalTrigger: "Multiple range update operations [L..R] += V on an array.",
    visualIntuition: `
  Range Update [1..3] += 5 on Array A size 5:
  Difference Array D initialized to 0:
  D = [ 0 |  0 | 0 | 0 | 0 | 0 ]

  Apply Update L=1, R=3, V=5 in O(1):
  D[1] += 5   ⇒ D[1] = 5
  D[4] -= 5   ⇒ D[4] = -5
  D = [ 0 | +5 | 0 | 0 | -5 | 0 ]

  Reconstruct Array via Prefix Sum of D:
  A[0] = 0
  A[1] = 0 + 5 = 5
  A[2] = 5 + 0 = 5
  A[3] = 5 + 0 = 5
  A[4] = 5 - 5 = 0  ✓ Range [1..3] updated by +5 in O(1)!
    `,
    bruteForceVsPattern: {
      bruteLabel: "Iterative Range Mutate",
      bruteTime: "O(K × N)",
      bruteDesc: "Loops over elements L to R for every update.",
      patternLabel: "Difference Array",
      patternTime: "O(K) updates + O(N) restore",
      patternDesc: "Sets D[L]+=V and D[R+1]-=V in O(1). Computes prefix sum of D at end.",
      opComparison: "10,000,000 updates → 100,000 O(1) ops"
    },
    coreInsight: "Range addition [L..R] += V is equivalent to adding +V at L and subtracting V at R+1.",
    mentalModel: {
      name: "The On/Off Switch Metaphor",
      metaphor: "Flip switch ON at start point L and OFF at end point R+1.",
      explanation: "Prefix sum accumulates the ON signal between L and R and turns it off at R+1."
    },
    visualInvariant: "A[i] equals the prefix sum of D from 0 to i.",
    universalPseudocode: [
      "D = array of size N + 1 filled with 0",
      "for update (L, R, V):",
      "    D[L] += V",
      "    D[R + 1] -= V",
      "nums[0] = D[0]",
      "for i from 1 to N-1:",
      "    nums[i] = nums[i-1] + D[i]"
    ],
    templates: {
      python: `class DifferenceArray:
    def __init__(self, n: int):
        self.D = [0] * (n + 1)
        self.n = n

    def update(self, L: int, R: int, val: int):
        self.D[L] += val
        self.D[R + 1] -= val

    def build(self) -> list[int]:
        res = [0] * self.n
        cur = 0
        for i in range(self.n):
            cur += self.D[i]
            res[i] = cur
        return res`,
      java: `public class DifferenceArray {
    private int[] D;
    private int n;

    public DifferenceArray(int n) {
        this.n = n;
        this.D = new int[n + 1];
    }

    public void update(int L, int R, int val) {
        D[L] += val;
        D[R + 1] -= val;
    }

    public int[] build() {
        int[] res = new int[n];
        int cur = 0;
        for (int i = 0; i < n; i++) {
            cur += D[i];
            res[i] = cur;
        }
        return res;
    }
}`,
      cpp: `class DifferenceArray {
    vector<int> D;
    int n;
public:
    DifferenceArray(int n) : n(n), D(n + 1, 0) {}

    void update(int L, int R, int val) {
        D[L] += val;
        D[R + 1] -= val;
    }

    vector<int> build() {
        vector<int> res(n, 0);
        int cur = 0;
        for (int i = 0; i < n; ++i) {
            cur += D[i];
            res[i] = cur;
        }
        return res;
    }
};`,
      rust: `struct DifferenceArray {
    d: Vec<i32>,
    n: usize,
}

impl DifferenceArray {
    fn new(n: usize) -> Self {
        DifferenceArray { d: vec![0; n + 1], n }
    }

    fn update(&mut self, l: usize, r: usize, val: i32) {
        self.d[l] += val;
        self.d[r + 1] -= val;
    }

    fn build(&self) -> Vec<i32> {
        let mut res = vec![0; self.n];
        let mut cur = 0;
        for i in 0..self.n {
            cur += self.d[i];
            res[i] = cur;
        }
        res
    }
}`,
      typescript: `class DifferenceArray {
  private D: number[];

  constructor(private n: number) {
    this.D = new Array(n + 1).fill(0);
  }

  update(L: number, R: number, val: number): void {
    this.D[L] += val;
    this.D[R + 1] -= val;
  }

  build(): number[] {
    const res = new Array(this.n).fill(0);
    let cur = 0;
    for (let i = 0; i < this.n; i++) {
      cur += this.D[i];
      res[i] = cur;
    }
    return res;
  }
}`
    },
    dnaCard: {
      trigger: "Multiple range update operations [L..R] += V",
      invariant: "A[i] = sum(D[0]..D[i])",
      dataStructure: "Array",
      timeComplexity: "O(1) Update, O(N) Final Build",
      spaceComplexity: "O(N)",
      typicalConstraints: "N ≤ 10^5, K ≤ 10^5",
      difficulty: "Intermediate",
      interviewFrequency: "High",
      goldenFormula: "D[L] += V, D[R+1] -= V"
    },
    problemBreakthrough: {
      title: "LeetCode 1109: Corporate Flight Bookings",
      problemStatement: "Apply bookings [first, last, seats] to n flights.",
      naiveApproach: "Iterate from first to last for each booking taking O(K × N).",
      patternRevelation: "Use Difference Array: D[first - 1] += seats, D[last] -= seats. Solved in O(K + N) time!",
      keyEquation: "D[L] += V; D[R+1] -= V"
    },
    illusions: [
      {
        looksLike: "Prefix Sum",
        actuallyIs: "Difference Array",
        keyDifference: "Prefix Sum is used for Range QUERIES; Difference Array is used for Range UPDATES."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "Iterative Mutate", desc: "O(N) per update" },
      { stage: "Tier 2", name: "Difference Array", desc: "O(1) per range update" }
    ],
    familyTree: {
      children: ["segment-tree"],
      related: ["prefix-sum"],
      confusedWith: ["prefix-sum"]
    },
    interviewSignals: ["Range update", "Car pooling capacity", "Flight bookings"],
    pitfalls: [
      "Forgetting to pad difference array with size N+1 (causes out-of-bounds on R+1).",
      "Trying to query values mid-update sequence before building prefix sum."
    ],
    memoryCard: {
      trigger: "Range update [L..R] += V",
      invariant: "D[L]+=V, D[R+1]-=V",
      formula: "Prefix sum of D yields array",
      complexity: "O(1) Update",
      mentalImage: "On/Off Switch",
      goldenRule: "Update ends, reconstruct at finish"
    },
    practiceProblems: [
      { title: "Corporate Flight Bookings", slug: "corporate-flight-bookings", difficulty: "Medium", clue: "Range updates D[L] += K, D[R+1] -= K followed by prefix sum restoration." },
      { title: "Range Addition", slug: "range-addition", difficulty: "Medium", clue: "Apply O(1) range updates to difference array before computing final values." },
      { title: "Car Pooling", slug: "car-pooling", difficulty: "Medium", clue: "Track passenger delta changes at pickup and dropoff stop locations." },
      { title: "My Calendar III", slug: "my-calendar-iii", difficulty: "Hard", clue: "Boundary count shifts (+1 at start, -1 at end) with max overlap line sweep." },
      { title: "Describe the Painting", slug: "describe-the-painting", difficulty: "Medium", clue: "Segment boundary sum changes on difference array timeline." },
      { title: "Shifting Letters II", slug: "shifting-letters-ii", difficulty: "Medium", clue: "Range shift queries applied to difference array." }
    ]
  },

  "binary-search-range": {
    mentalTrigger: "Finding min/max optimal value X where monotonic check function isPossible(X) holds.",
    visualIntuition: `
  Search Range [Low=1 .. High=100], Target capacity:
  Check Mid = 50 ──► isPossible(50) = True
  (Valid! Try smaller value: High = 49)

  Search Range [Low=1 .. High=49]:
  Check Mid = 25 ──► isPossible(25) = False
  (Too small! Try larger value: Low = 26)

  Search Range Halved Every Step! O(log N) iterations total.
    `,
    bruteForceVsPattern: {
      bruteLabel: "Linear Scan 1..N",
      bruteTime: "O(N × Check)",
      bruteDesc: "Tests every integer from 1 to N sequentially.",
      patternLabel: "Binary Search on Answer",
      patternTime: "O(log N × Check)",
      patternDesc: "Halves search range at every step using monotonic decision predicate.",
      opComparison: "1,000,000 checks → 20 checks (50,000x speedup)"
    },
    coreInsight: "If isPossible(X) is monotonic (False False ... True True), Binary Search locates the boundary in O(log N).",
    mentalModel: {
      name: "High-Low Guessing Game",
      metaphor: "Guessing a number between 1 and 100 with 'Too High' or 'Too Low' feedback.",
      explanation: "Each feedback eliminates half of all remaining possibilities."
    },
    visualInvariant: "Optimal answer always lies inside active range [Low..High].",
    universalPseudocode: [
      "Low = min_possible, High = max_possible",
      "ans = High",
      "while Low <= High:",
      "    Mid = Low + (High - Low) // 2",
      "    if isPossible(Mid):",
      "        ans = Mid",
      "        High = Mid - 1",
      "    else:",
      "        Low = Mid + 1",
      "return ans"
    ],
    templates: {
      python: `def minEatingSpeed(piles: list[int], h: int) -> int:
    def isPossible(k: int) -> bool:
        return sum((p + k - 1) // k for p in piles) <= h

    Low, High = 1, max(piles)
    ans = High
    while Low <= High:
        Mid = (Low + High) // 2
        if isPossible(Mid):
            ans = Mid
            High = Mid - 1
        else:
            Low = Mid + 1
    return ans`,
      java: `public int minEatingSpeed(int[] piles, int h) {
    int Low = 1, High = 0;
    for (int p : piles) High = Math.max(High, p);
    int ans = High;
    while (Low <= High) {
        int Mid = Low + (High - Low) / 2;
        if (isPossible(piles, h, Mid)) {
            ans = Mid;
            High = Mid - 1;
        } else {
            Low = Mid + 1;
        }
    }
    return ans;
}`,
      cpp: `int minEatingSpeed(vector<int>& piles, int h) {
    int Low = 1, High = *max_element(piles.begin(), piles.end());
    int ans = High;
    while (Low <= High) {
        int Mid = Low + (High - Low) / 2;
        if (isPossible(piles, h, Mid)) {
            ans = Mid;
            High = Mid - 1;
        } else {
            Low = Mid + 1;
        }
    }
    return ans;
}`,
      rust: `fn min_eating_speed(piles: &[i32], h: i32) -> i32 {
    let (mut low, mut high) = (1, *piles.iter().max().unwrap());
    let mut ans = high;
    while low <= high {
        let mid = low + (high - low) / 2;
        if is_possible(piles, h, mid) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    ans
}`,
      typescript: `function minEatingSpeed(piles: number[], h: number): number {
  let Low = 1, High = Math.max(...piles);
  let ans = High;
  while (Low <= High) {
    const Mid = Math.floor(Low + (High - Low) / 2);
    if (isPossible(piles, h, Mid)) {
      ans = Mid;
      High = Mid - 1;
    } else {
      Low = Mid + 1;
    }
  }
  return ans;
}`
    },
    dnaCard: {
      trigger: "Find min/max value satisfying condition",
      invariant: "Predicate is monotonic FFF...TTT",
      dataStructure: "Implicit Search Space",
      timeComplexity: "O(log(Search Space) × Check)",
      spaceComplexity: "O(1)",
      typicalConstraints: "Search Space ≤ 10^9",
      difficulty: "Intermediate",
      interviewFrequency: "Extremely High (90%)",
      goldenFormula: "Mid = Low + (High - Low) / 2"
    },
    problemBreakthrough: {
      title: "LeetCode 875: Koko Eating Bananas",
      problemStatement: "Find minimum eating speed K to eat all bananas within H hours.",
      naiveApproach: "Try speeds K=1, K=2, K=3... linearly taking O(Max_Pile × N).",
      patternRevelation: "Speed K is monotonic: if speed K works, K+1 also works. Binary Search on range [1..Max_Pile] solves it in O(N log(Max))!",
      keyEquation: "Mid = Low + (High - Low) / 2"
    },
    illusions: [
      {
        looksLike: "Greedy Search",
        actuallyIs: "Binary Search on Answer",
        keyDifference: "Greedy chooses local choices; Binary Search tests global feasibility of mid-point."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "Linear Search", desc: "O(N)" },
      { stage: "Tier 2", name: "Binary Search", desc: "O(log N)" }
    ],
    familyTree: {
      children: [],
      related: ["two-pointers"],
      confusedWith: ["two-pointers"]
    },
    interviewSignals: ["Minimize maximum", "Maximize minimum", "Capacity / speed threshold"],
    pitfalls: [
      "Integer overflow computing (Low + High) / 2 (use Low + (High - Low) / 2).",
      "Incorrect search range bounds initialization."
    ],
    memoryCard: {
      trigger: "Min/Max threshold condition",
      invariant: "Monotonic check result",
      formula: "Halve search space at Mid",
      complexity: "O(log N)",
      mentalImage: "High/Low Target Game",
      goldenRule: "If Mid valid, try smaller/larger"
    },
    practiceProblems: [
      { title: "Binary Search", slug: "binary-search", difficulty: "Easy", clue: "Canonical monotonic sorted array divide and conquer." },
      { title: "Search a 2D Matrix", slug: "search-a-2d-matrix", difficulty: "Medium", clue: "Binary search 2D matrix by mapping mid to row and column indices." },
      { title: "Koko Eating Bananas", slug: "koko-eating-bananas", difficulty: "Medium", clue: "Binary search eating speed K in range [1..maxPiles]." },
      { title: "Find Minimum in Rotated Sorted Array", slug: "find-minimum-in-rotated-sorted-array", difficulty: "Medium", clue: "Compare mid element with right boundary to locate rotation pivot." },
      { title: "Search in Rotated Sorted Array", slug: "search-in-rotated-sorted-array", difficulty: "Medium", clue: "Identify which half is sorted and check if target lies within bounds." },
      { title: "Capacity To Ship Packages Within D Days", slug: "capacity-to-ship-packages-within-d-days", difficulty: "Medium", clue: "Binary search daily shipping weight capacity." },
      { title: "Split Array Largest Sum", slug: "split-array-largest-sum", difficulty: "Hard", clue: "Minimize maximum subarray sum threshold via binary search." },
      { title: "Median of Two Sorted Arrays", slug: "median-of-two-sorted-arrays", difficulty: "Hard", clue: "Binary search partition line on the smaller sorted array." }
    ]
  },

  "top-k-elements": {
    mentalTrigger: "Finding K largest, smallest, or most frequent items in a stream or large set.",
    visualIntuition: `
  Find 3 Largest Elements in [3, 1, 5, 12, 2, 11]:
  Maintain Min-Heap of size K=3:

  Process 3: Heap = [3]
  Process 1: Heap = [1, 3]
  Process 5: Heap = [1, 3, 5]
  Process 12: 12 > Heap.top(1) ──► Pop 1, Push 12 ──► Heap = [3, 5, 12]
  Process 2: 2 < Heap.top(3) ──► Ignore 2
  Process 11: 11 > Heap.top(3) ──► Pop 3, Push 11 ──► Heap = [5, 11, 12]

  Final Top 3 Elements = [5, 11, 12] ✓
    `,
    bruteForceVsPattern: {
      bruteLabel: "Full Sort Array",
      bruteTime: "O(N log N)",
      bruteDesc: "Sorts entire array of N elements then takes first K.",
      patternLabel: "Min-Heap Size K",
      patternTime: "O(N log K)",
      patternDesc: "Maintains a Min-Heap of size K. Each insertion/pop takes O(log K).",
      opComparison: "1,000,000 log(1,000,000) ≈ 20M ops → 1,000,000 log(10) ≈ 3.3M ops"
    },
    coreInsight: "To keep the K largest elements, use a MIN-HEAP of size K so the smallest among the top K is at top for easy eviction.",
    mentalModel: {
      name: "VIP Bouncer Metaphor",
      metaphor: "A room with K seats. The weakest VIP sits right at the door. If a stronger VIP arrives, weak VIP gets kicked out.",
      explanation: "Smallest element among the K largest stays at the top of the Min-Heap."
    },
    visualInvariant: "Heap always contains exactly the K best candidate elements seen so far.",
    universalPseudocode: [
      "heap = empty Min-Heap",
      "for val in nums:",
      "    heap.push(val)",
      "    if heap.size() > K:",
      "        heap.pop()",
      "return heap elements"
    ],
    templates: {
      python: `import heapq

def findKthLargest(nums: list[int], k: int) -> int:
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`,
      java: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int num : nums) {
        heap.add(num);
        if (heap.size() > k) heap.poll();
    }
    return heap.peek();
}`,
      cpp: `int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> heap;
    for (int num : nums) {
        heap.push(num);
        if (heap.size() > k) heap.pop();
    }
    return heap.top();
}`,
      rust: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn find_kth_largest(nums: Vec<i32>, k: usize) -> i32 {
    let mut heap = BinaryHeap::new();
    for num in nums {
        heap.push(Reverse(num));
        if heap.len() > k { heap.pop(); }
    }
    heap.peek().unwrap().0
}`,
      typescript: `function findKthLargest(nums: number[], k: number): number {
  // Use Min-Heap structure or QuickSelect
  const heap: number[] = [];
  for (const num of nums) {
    heap.push(num);
    heap.sort((a, b) => a - b);
    if (heap.length > k) heap.shift();
  }
  return heap[0];
}`
    },
    dnaCard: {
      trigger: "Top K largest/smallest/frequent items",
      invariant: "Heap size bounded to K",
      dataStructure: "Priority Queue / Min-Heap",
      timeComplexity: "O(N log K)",
      spaceComplexity: "O(K)",
      typicalConstraints: "N ≤ 10^6, K ≤ 10^4",
      difficulty: "Intermediate",
      interviewFrequency: "High",
      goldenFormula: "Min-Heap for K Largest, Max-Heap for K Smallest"
    },
    problemBreakthrough: {
      title: "LeetCode 215: Kth Largest Element in an Array",
      problemStatement: "Find Kth largest element in unsorted array without sorting whole array.",
      naiveApproach: "Sort entire array in O(N log N) time.",
      patternRevelation: "Maintain Min-Heap of size K. Process all N elements in O(N log K) time and O(K) memory!",
      keyEquation: "Pop heap when size > K"
    },
    illusions: [
      {
        looksLike: "Sorting",
        actuallyIs: "Top K Heap",
        keyDifference: "Top K Heap avoids sorting the entire array when K << N."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "Full Sort", desc: "O(N log N)" },
      { stage: "Tier 2", name: "Min-Heap Size K", desc: "O(N log K)" }
    ],
    familyTree: {
      children: [],
      related: ["two-pointers"],
      confusedWith: ["two-pointers"]
    },
    interviewSignals: ["K largest elements", "K most frequent words", "Top K streaming"],
    pitfalls: [
      "Using Max-Heap instead of Min-Heap for K Largest (causes size N heap with O(N log N) cost).",
      "Forgetting to check heap size before popping."
    ],
    memoryCard: {
      trigger: "K largest/smallest items",
      invariant: "Min-Heap size K",
      formula: "Push item, pop if size > K",
      complexity: "O(N log K)",
      mentalImage: "VIP Club Bouncer at Door",
      goldenRule: "Keep K best candidates in heap"
    },
    practiceProblems: [
      { title: "Kth Largest Element in an Array", slug: "kth-largest-element-in-an-array", difficulty: "Medium", clue: "Maintain Min-Heap of size K while iterating array." },
      { title: "Top K Frequent Elements", slug: "top-k-frequent-elements", difficulty: "Medium", clue: "Frequency Hash Map + Min-Heap of size K." },
      { title: "K Closest Points to Origin", slug: "k-closest-points-to-origin", difficulty: "Medium", clue: "Max-Heap of size K storing points ordered by Euclidean distance." },
      { title: "Find Median from Data Stream", slug: "find-median-from-data-stream", difficulty: "Hard", clue: "Two balanced heaps: Max-Heap for lower half, Min-Heap for upper half." },
      { title: "Task Scheduler", slug: "task-scheduler", difficulty: "Medium", clue: "Max-Heap storing task frequency counts with cooling queue." },
      { title: "Reorganize String", slug: "reorganize-string", difficulty: "Medium", clue: "Max-Heap of character frequencies, popping top 2 to avoid adjacent duplicates." },
      { title: "Merge k Sorted Lists", slug: "merge-k-sorted-lists", difficulty: "Hard", clue: "Min-Heap storing heads of all K sorted linked lists." }
    ]
  },

  "overlapping-intervals": {
    mentalTrigger: "Given start and end times, merge overlapping intervals or schedule maximum non-overlapping events.",
    visualIntuition: `
  Intervals: [1, 3], [2, 6], [8, 10], [15, 18]

  Step 1: Sort by start time (already sorted).
  Step 2: Start with [1, 3].
  Step 3: Check [2, 6] ──► 2 <= 3 (OVERLAP!) ──► Merge to [1, max(3, 6)] = [1, 6].
  Step 4: Check [8, 10] ──► 8 > 6 (NO OVERLAP) ──► Push [1, 6], start new [8, 10].
  Step 5: Check [15, 18] ──► 15 > 10 (NO OVERLAP) ──► Push [8, 10], start new [15, 18].

  Merged Result: [1, 6], [8, 10], [15, 18] ✓
    `,
    bruteForceVsPattern: {
      bruteLabel: "Graph Overlap Search",
      bruteTime: "O(N²)",
      bruteDesc: "Compares every interval against every other interval to find overlaps.",
      patternLabel: "Sort + Single Sweep",
      patternTime: "O(N log N)",
      patternDesc: "Sorts intervals by start time. A single linear sweep merges overlapping adjacent intervals.",
      opComparison: "1,000,000 comparisons → 10,000 sort ops + 1,000 sweep ops"
    },
    coreInsight: "Sorting intervals by start time guarantees that any overlap MUST occur between adjacent intervals.",
    mentalModel: {
      name: "Calendar Meeting Merger",
      metaphor: "Looking at a daily calendar schedule: if Meeting B starts before Meeting A ends, they merge into one continuous block.",
      explanation: "Chronological sorting ensures you only ever need to compare with the last merged interval."
    },
    visualInvariant: "Intervals are processed in strictly non-decreasing order of start times.",
    universalPseudocode: [
      "sort intervals by start time",
      "merged = [intervals[0]]",
      "for interval in intervals[1..]:",
      "    if interval.start <= merged.last.end:",
      "        merged.last.end = max(merged.last.end, interval.end)",
      "    else:",
      "        merged.append(interval)",
      "return merged"
    ],
    templates: {
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged`,
      java: `public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    for (int[] interval : intervals) {
        if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) {
            merged.add(interval);
        } else {
            merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], interval[1]);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}`,
      cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged;
    for (const auto& interval : intervals) {
        if (merged.empty() || merged.back()[1] < interval[0]) {
            merged.push_back(interval);
        } else {
            merged.back()[1] = max(merged.back()[1], interval[1]);
        }
    }
    return merged;
}`,
      rust: `fn merge(mut intervals: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
    intervals.sort_by_key(|x| x[0]);
    let mut merged: Vec<Vec<i32>> = Vec::new();
    for interval in intervals {
        if merged.is_empty() || merged.last().unwrap()[1] < interval[0] {
            merged.push(interval);
        } else {
            let last_end = merged.last_mut().unwrap();
            last_end[1] = last_end[1].max(interval[1]);
        }
    }
    merged
}`,
      typescript: `function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [];
  for (const interval of intervals) {
    if (merged.length === 0 || merged[merged.length - 1][1] < interval[0]) {
      merged.push(interval);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1]);
    }
  }
  return merged;
}`
    },
    dnaCard: {
      trigger: "Merge or schedule overlapping time intervals",
      invariant: "Sorted by start time",
      dataStructure: "Array / List",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)",
      typicalConstraints: "N ≤ 10^5",
      difficulty: "Intermediate",
      interviewFrequency: "High",
      goldenFormula: "If cur.start <= prev.end: prev.end = max(prev.end, cur.end)"
    },
    problemBreakthrough: {
      title: "LeetCode 56: Merge Intervals",
      problemStatement: "Merge all overlapping intervals and return array of non-overlapping intervals.",
      naiveApproach: "Pairwise overlap check with graph components in O(N²) time.",
      patternRevelation: "Sort by start time. Linear sweep merges adjacent overlaps in O(N log N) time!",
      keyEquation: "cur.start <= prev.end ⇒ Overlap!"
    },
    illusions: [
      {
        looksLike: "Two Pointers",
        actuallyIs: "Interval Sorting",
        keyDifference: "Interval problems require sorting by start/end times before processing."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "Pairwise Overlap", desc: "O(N²)" },
      { stage: "Tier 2", name: "Sort + Sweep", desc: "O(N log N)" }
    ],
    familyTree: {
      children: [],
      related: ["two-pointers"],
      confusedWith: ["two-pointers"]
    },
    interviewSignals: ["Merge intervals", "Non-overlapping intervals", "Meeting rooms II"],
    pitfalls: [
      "Forgetting to sort intervals first.",
      "Using max(prev.end, cur.end) incorrectly when merging."
    ],
    memoryCard: {
      trigger: "Time intervals / meetings",
      invariant: "Chronological start time order",
      formula: "cur.start <= prev.end ⇒ merge",
      complexity: "O(N log N)",
      mentalImage: "Calendar Meeting Timeline",
      goldenRule: "Sort by start, merge adjacent"
    },
    practiceProblems: [
      { title: "Merge Intervals", slug: "merge-intervals", difficulty: "Medium", clue: "Sort by start time; merge adjacent if curr.start <= prev.end." },
      { title: "Insert Interval", slug: "insert-interval", difficulty: "Medium", clue: "Push left non-overlapping, merge overlapping, push right non-overlapping." },
      { title: "Non-overlapping Intervals", slug: "non-overlapping-intervals", difficulty: "Medium", clue: "Greedy selection: sort by end time to preserve maximum remaining space." },
      { title: "Meeting Rooms", slug: "meeting-rooms", difficulty: "Easy", clue: "Sort meetings by start time and check if adjacent meetings overlap." },
      { title: "Meeting Rooms II", slug: "meeting-rooms-ii", difficulty: "Medium", clue: "Min-Heap of end times to track required concurrent meeting rooms." },
      { title: "Minimum Interval to Include Each Query", slug: "minimum-interval-to-include-each-query", difficulty: "Hard", clue: "Sort queries & intervals, maintain Min-Heap by interval length." }
    ]
  },

  "cyclic-sort": {
    mentalTrigger: "Array contains numbers from 1 to N, find missing/duplicate numbers in O(N) time and O(1) space.",
    visualIntuition: `
  Array size N=5, values 1..5:  [ 3 | 4 | 1 | 2 | 5 ]

  i=0: nums[0]=3. Correct index for 3 is 3-1 = 2. Swap nums[0] <-> nums[2]!
  Array becomes:               [ 1 | 4 | 3 | 2 | 5 ]

  i=0: nums[0]=1 is at correct index 0. i++!
  i=1: nums[1]=4. Correct index for 4 is 3. Swap nums[1] <-> nums[3]!
  Array becomes:               [ 1 | 2 | 3 | 4 | 5 ]

  Array sorted in O(N) time and O(1) space! ✓
    `,
    bruteForceVsPattern: {
      bruteLabel: "Hash Set or Full Sort",
      bruteTime: "O(N log N) or O(N) Space",
      bruteDesc: "Uses extra O(N) memory array or sorting.",
      patternLabel: "Cyclic Sort",
      patternTime: "O(N) Time, O(1) Space",
      patternDesc: "Swaps each element directly to its target index nums[i]-1. Total swaps ≤ N.",
      opComparison: "O(N) memory → O(1) in-place swaps"
    },
    coreInsight: "When array values range from 1 to N, every value X belongs at index X - 1.",
    mentalModel: {
      name: "Assigned Seating Metaphor",
      metaphor: "A theater where every ticket has a seat number. If you sit in the wrong seat, you swap with the person currently in your assigned seat.",
      explanation: "Every swap puts at least one person in their correct assigned seat forever."
    },
    visualInvariant: "After cyclic sort, nums[i] == i + 1 for all valid non-missing elements.",
    universalPseudocode: [
      "i = 0",
      "while i < N:",
      "    correct_idx = nums[i] - 1",
      "    if nums[i] != nums[correct_idx]:",
      "        swap(nums[i], nums[correct_idx])",
      "    else:",
      "        i += 1"
    ],
    templates: {
      python: `def findMissingNumber(nums: list[int]) -> int:
    i, N = 0, len(nums)
    while i < N:
        correct = nums[i]
        if nums[i] < N and nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1
    for i in range(N):
        if nums[i] != i:
            return i
    return N`,
      java: `public int findMissingNumber(int[] nums) {
    int i = 0, N = nums.length;
    while (i < N) {
        int correct = nums[i];
        if (nums[i] < N && nums[i] != nums[correct]) {
            int tmp = nums[i];
            nums[i] = nums[correct];
            nums[correct] = tmp;
        } else {
            i++;
        }
    }
    for (i = 0; i < N; i++) {
        if (nums[i] != i) return i;
    }
    return N;
}`,
      cpp: `int findMissingNumber(vector<int>& nums) {
    int i = 0, N = nums.size();
    while (i < N) {
        int correct = nums[i];
        if (nums[i] < N && nums[i] != nums[correct]) {
            swap(nums[i], nums[correct]);
        } else {
            i++;
        }
    }
    for (i = 0; i < N; ++i) {
        if (nums[i] != i) return i;
    }
    return N;
}`,
      rust: `fn find_missing_number(mut nums: Vec<usize>) -> usize {
    let mut i = 0;
    let n = nums.len();
    while i < n {
        let correct = nums[i];
        if nums[i] < n && nums[i] != nums[correct] {
            nums.swap(i, correct);
        } else {
            i += 1;
        }
    }
    for i in 0..n {
        if nums[i] != i { return i; }
    }
    n
}`,
      typescript: `function findMissingNumber(nums: number[]): number {
  let i = 0, N = nums.length;
  while (i < N) {
    const correct = nums[i];
    if (nums[i] < N && nums[i] !== nums[correct]) {
      [nums[i], nums[correct]] = [nums[correct], nums[i]];
    } else {
      i++;
    }
  }
  for (i = 0; i < N; i++) {
    if (nums[i] !== i) return i;
  }
  return N;
}`
    },
    dnaCard: {
      trigger: "Numbers in range 1..N (or 0..N), find missing/duplicate",
      invariant: "nums[i] == i + 1",
      dataStructure: "Array In-Place",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)",
      typicalConstraints: "N ≤ 10^5, values in 1..N",
      difficulty: "Intermediate",
      interviewFrequency: "High",
      goldenFormula: "swap(nums[i], nums[nums[i]-1])"
    },
    problemBreakthrough: {
      title: "LeetCode 41: First Missing Positive",
      problemStatement: "Find smallest missing positive integer in unsorted array in O(N) time and O(1) space.",
      naiveApproach: "Sort array O(N log N) or use HashSet O(N) space.",
      patternRevelation: "Cyclic sort places positive integer X in index X-1. First index i where nums[i] != i+1 gives answer i+1 in O(N) time and O(1) space!",
      keyEquation: "nums[i] belongs at index nums[i] - 1"
    },
    illusions: [
      {
        looksLike: "Standard Sorting",
        actuallyIs: "Cyclic Sort",
        keyDifference: "Standard sort takes O(N log N); Cyclic Sort exploits range 1..N for O(N) in-place placement."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "HashSet Check", desc: "O(N) space" },
      { stage: "Tier 2", name: "Cyclic Sort", desc: "O(1) space" }
    ],
    familyTree: {
      children: [],
      related: ["two-pointers"],
      confusedWith: ["two-pointers"]
    },
    interviewSignals: ["Find missing number 1..N", "Find duplicate 1..N", "First missing positive"],
    pitfalls: [
      "Infinite while loop if swap target is equal to current element (nums[i] == nums[correct]).",
      "Using i++ inside while loop when swap occurs (must NOT increment i on swap!)."
    ],
    memoryCard: {
      trigger: "Numbers in range 1..N",
      invariant: "nums[i] belongs at nums[i]-1",
      formula: "Swap to correct index until fixed",
      complexity: "O(N) Time, O(1) Space",
      mentalImage: "Assigned Theater Seats",
      goldenRule: "Swap to target seat, don't increment i on swap"
    },
    practiceProblems: [
      { title: "Missing Number", slug: "missing-number", difficulty: "Easy", clue: "Cyclic sort elements to index nums[i], find index where nums[i] != i." },
      { title: "Find All Numbers Disappeared in an Array", slug: "find-all-numbers-disappeared-in-an-array", difficulty: "Easy", clue: "Place nums[i] at index nums[i]-1, inspect missing numbers." },
      { title: "Find the Duplicate Number", slug: "find-the-duplicate-number", difficulty: "Medium", clue: "Swap nums[i] to target index nums[i]-1 until duplicate collides." },
      { title: "Find All Duplicates in an Array", slug: "find-all-duplicates-in-an-array", difficulty: "Medium", clue: "In-place index negation or cyclic swap placement." },
      { title: "First Missing Positive", slug: "first-missing-positive", difficulty: "Hard", clue: "Cyclic sort positive integers into indices 1..N, find first mismatch." },
      { title: "Set Mismatch", slug: "set-mismatch", difficulty: "Easy", clue: "Cyclic sort placement to find duplicated & missing integer pair." }
    ]
  },

  "bfs-dfs-trees": {
    mentalTrigger: "Exploring tree level-by-level (BFS) or finding root-to-leaf paths (DFS).",
    visualIntuition: `
  Binary Tree:        1
                    /   \\
                   2     3
                  / \\   / \\
                 4   5 6   7

  BFS Level Order:  Queue = [1] ──► Level 1: [1]
                    Queue = [2, 3] ──► Level 2: [2, 3]
                    Queue = [4, 5, 6, 7] ──► Level 3: [4, 5, 6, 7]

  DFS Preorder:     1 ──► 2 ──► 4 ──► 5 ──► 3 ──► 6 ──► 7
    `,
    bruteForceVsPattern: {
      bruteLabel: "Unstructured Traversal",
      bruteTime: "Exponential / Redundant",
      bruteDesc: "Revisiting nodes or failing to track levels.",
      patternLabel: "Queue BFS / Recursion DFS",
      patternTime: "O(N) Time, O(W) Space",
      patternDesc: "Visits every tree node exactly once. BFS uses Queue for level size; DFS uses Recursion Stack.",
      opComparison: "O(N) single pass guarantee"
    },
    coreInsight: "BFS uses FIFO Queue to process distance levels step-by-step; DFS uses LIFO Stack/Recursion to dive deep.",
    mentalModel: {
      name: "Water Ripple vs Deep Mine Metaphor",
      metaphor: "BFS expands outward like water ripples; DFS digs down one tunnel completely before backtracking.",
      explanation: "BFS is optimal for shortest distance/level order; DFS is optimal for path properties."
    },
    visualInvariant: "In BFS, Queue size at start of loop equals number of nodes at current depth level.",
    universalPseudocode: [
      "// BFS Level Order",
      "queue = [root]",
      "while queue is not empty:",
      "    level_size = queue.size()",
      "    for i from 0 to level_size-1:",
      "        node = queue.pop_left()",
      "        if node.left: queue.push(node.left)",
      "        if node.right: queue.push(node.right)"
    ],
    templates: {
      python: `def levelOrder(root) -> list[list[int]]:
    if not root: return []
    res, queue = [], [root]
    while queue:
        level_size = len(queue)
        level = []
        for _ in range(level_size):
            node = queue.pop(0)
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        res.append(level)
    return res`,
      java: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        res.add(level);
    }
    return res;
}`,
      cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> res;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        vector<int> level;
        for (int i = 0; i < sz; ++i) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        res.push_back(level);
    }
    return res;
}`,
      rust: `// Tree BFS Level Order Traversal
fn level_order(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<Vec<i32>> {
    let mut res = Vec::new();
    if root.is_none() { return res; }
    let mut q = std::collections::VecDeque::new();
    q.push_back(root.unwrap());
    while !q.is_empty() {
        let sz = q.len();
        let mut level = Vec::new();
        for _ in 0..sz {
            let node = q.pop_front().unwrap();
            let n = node.borrow();
            level.push(n.val);
            if let Some(ref l) = n.left { q.push_back(l.clone()); }
            if let Some(ref r) = n.right { q.push_back(r.clone()); }
        }
        res.push(level);
    }
    res
}`,
      typescript: `function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const res: number[][] = [];
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const size = queue.length;
    const level: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}`
    },
    dnaCard: {
      trigger: "Level order tree traversal / path search",
      invariant: "Queue size snapshot equals level count",
      dataStructure: "Queue (BFS) / Stack (DFS)",
      timeComplexity: "O(N)",
      spaceComplexity: "O(W) Max Tree Width",
      typicalConstraints: "N ≤ 10^5",
      difficulty: "Intermediate",
      interviewFrequency: "Extremely High (95%)",
      goldenFormula: "level_size = queue.size()"
    },
    problemBreakthrough: {
      title: "LeetCode 102: Binary Tree Level Order Traversal",
      problemStatement: "Return level order traversal of binary tree nodes' values.",
      naiveApproach: "DFS with depth mapping.",
      patternRevelation: "Queue BFS naturally groups nodes level by level using queue size snapshot!",
      keyEquation: "for _ in range(queue.size())"
    },
    illusions: [
      {
        looksLike: "Recursion",
        actuallyIs: "Queue BFS",
        keyDifference: "Queue BFS guarantees nodes are visited in strictly non-decreasing depth order."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "Recursive DFS", desc: "Depth first" },
      { stage: "Tier 2", name: "Queue BFS", desc: "Level-by-level" }
    ],
    familyTree: {
      children: ["matrix-traversal"],
      related: ["topological-sort"],
      confusedWith: ["matrix-traversal"]
    },
    interviewSignals: ["Level order traversal", "Minimum depth of tree", "Zigzag level order"],
    pitfalls: [
      "Not taking a snapshot of queue.size() before inner loop (causes level merging).",
      "Forgetting root null check."
    ],
    memoryCard: {
      trigger: "Tree levels or shortest path",
      invariant: "Queue holds current level",
      formula: "Snapshot queue size each level",
      complexity: "O(N)",
      mentalImage: "Water Ripple Expanding",
      goldenRule: "Snapshot size before popping"
    },
    practiceProblems: [
      { title: "Binary Tree Level Order Traversal", slug: "binary-tree-level-order-traversal", difficulty: "Medium", clue: "Queue snapshot level by level using queue size." },
      { title: "Maximum Depth of Binary Tree", slug: "maximum-depth-of-binary-tree", difficulty: "Easy", clue: "Recursive DFS depth calculation 1 + max(left, right)." },
      { title: "Invert Binary Tree", slug: "invert-binary-tree", difficulty: "Easy", clue: "Recursively swap left and right child pointers of each node." },
      { title: "Binary Tree Right Side View", slug: "binary-tree-right-side-view", difficulty: "Medium", clue: "BFS adding last node of each level or DFS right-first traversal." },
      { title: "Validate Binary Search Tree", slug: "validate-binary-search-tree", difficulty: "Medium", clue: "DFS passing valid (min, max) range constraints to subtrees." },
      { title: "Lowest Common Ancestor of a Binary Tree", slug: "lowest-common-ancestor-of-a-binary-tree", difficulty: "Medium", clue: "Post-order DFS returning non-null subtree nodes." },
      { title: "Binary Tree Maximum Path Sum", slug: "binary-tree-maximum-path-sum", difficulty: "Hard", clue: "DFS calculating max gain from subtrees and updating global max." },
      { title: "Serialize and Deserialize Binary Tree", slug: "serialize-and-deserialize-binary-tree", difficulty: "Hard", clue: "Preorder DFS encoding tree structure with null delimiters." }
    ]
  },

  "matrix-traversal": {
    mentalTrigger: "Counting connected components (islands) or flood filling a 2D Grid.",
    visualIntuition: `
  2D Grid (1 = Land, 0 = Water):
  [ 1 , 1 , 0 , 0 ]
  [ 1 , 1 , 0 , 0 ]
  [ 0 , 0 , 1 , 0 ]
  [ 0 , 0 , 0 , 1 ]

  Iterate grid cells:
  (0,0) is Land '1'! Start Flood Fill DFS:
  Mark (0,0), (0,1), (1,0), (1,1) as visited '0'.
  Island Count = 1.

  Continue scan:
  (2,2) is Land '1'! Flood Fill DFS ──► Island Count = 2.
  (3,3) is Land '1'! Flood Fill DFS ──► Island Count = 3.

  Total Connected Islands = 3 ✓
    `,
    bruteForceVsPattern: {
      bruteLabel: "Unvisited Cell Scan",
      bruteTime: "Exponential / Infinite loop",
      bruteDesc: "Revisiting grid cells without tracking visited state.",
      patternLabel: "Grid Flood Fill (DFS/BFS)",
      patternTime: "O(R × C)",
      patternDesc: "Visits each grid cell at most once. Sinks visited land cells to '0' or marks visited array.",
      opComparison: "O(R × C) linear grid traversal"
    },
    coreInsight: "A 2D Grid is an implicit graph where each cell (r, c) connects to its 4 cardinal neighbors.",
    mentalModel: {
      name: "Paint Bucket Flood Fill",
      metaphor: "Using the paint bucket tool in graphics software to fill connected same-color pixels.",
      explanation: "Explores all 4 directions (up, down, left, right) recursively or via queue."
    },
    visualInvariant: "Visited land cells are immediately mutated to water '0' to prevent infinite cycles.",
    universalPseudocode: [
      "islands = 0",
      "for r in 0..R-1:",
      "    for c in 0..C-1:",
      "        if grid[r][c] == '1':",
      "            islands += 1",
      "            dfs(r, c)",
      "",
      "def dfs(r, c):",
      "    if out of bounds or grid[r][c] == '0': return",
      "    grid[r][c] = '0'",
      "    for (dr, dc) in [(-1,0), (1,0), (0,-1), (0,1)]:",
      "        dfs(r + dr, c + dc)"
    ],
    templates: {
      python: `def numIslands(grid: list[list[str]]) -> int:
    if not grid: return 0
    R, C = len(grid), len(grid[0])
    islands = 0

    def dfs(r, c):
        if r < 0 or r >= R or c < 0 or c >= C or grid[r][c] == '0':
            return
        grid[r][c] = '0'  # mark visited
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(R):
        for c in range(C):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)
    return islands`,
      java: `public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;
    int R = grid.length, C = grid[0].length, islands = 0;

    for (int r = 0; r < R; r++) {
        for (int c = 0; c < C; c++) {
            if (grid[r][c] == '1') {
                islands++;
                dfs(grid, r, c, R, C);
            }
        }
    }
    return islands;
}

private void dfs(char[][] grid, int r, int c, int R, int C) {
    if (r < 0 || r >= R || c < 0 || c >= C || grid[r][c] == '0') return;
    grid[r][c] = '0';
    dfs(grid, r + 1, c, R, C);
    dfs(grid, r - 1, c, R, C);
    dfs(grid, r, c + 1, R, C);
    dfs(grid, r, c - 1, R, C);
}`,
      cpp: `int numIslands(vector<vector<char>>& grid) {
    if (grid.empty()) return 0;
    int R = grid.size(), C = grid[0].size(), islands = 0;

    auto dfs = [&](auto self, int r, int c) -> void {
        if (r < 0 || r >= R || c < 0 || c >= C || grid[r][c] == '0') return;
        grid[r][c] = '0';
        self(self, r + 1, c);
        self(self, r - 1, c);
        self(self, r, c + 1);
        self(self, r, c - 1);
    };

    for (int r = 0; r < R; ++r) {
        for (int c = 0; c < C; ++c) {
            if (grid[r][c] == '1') {
                islands++;
                dfs(dfs, r, c);
            }
        }
    }
    return islands;
}`,
      rust: `fn num_islands(mut grid: Vec<Vec<char>>) -> i32 {
    if grid.is_empty() { return 0; }
    let (r_len, c_len) = (grid.len(), grid[0].len());
    let mut islands = 0;

    for r in 0..r_len {
        for c in 0..c_len {
            if grid[r][c] == '1' {
                islands += 1;
                dfs(&mut grid, r as i32, c as i32, r_len as i32, c_len as i32);
            }
        }
    }
    islands
}

fn dfs(grid: &mut Vec<Vec<char>>, r: i32, c: i32, r_len: i32, c_len: i32) {
    if r < 0 || r >= r_len || c < 0 || c >= c_len || grid[r as usize][c as usize] == '0' { return; }
    grid[r as usize][c as usize] = '0';
    dfs(grid, r + 1, c, r_len, c_len);
    dfs(grid, r - 1, c, r_len, c_len);
    dfs(grid, r, c + 1, r_len, c_len);
    dfs(grid, r, c - 1, r_len, c_len);
}`,
      typescript: `function numIslands(grid: string[][]): number {
  if (!grid.length) return 0;
  const R = grid.length, C = grid[0].length;
  let islands = 0;

  function dfs(r: number, c: number) {
    if (r < 0 || r >= R || c < 0 || c >= C || grid[r][c] === '0') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === '1') {
        islands++;
        dfs(r, c);
      }
    }
  }
  return islands;
}`
    },
    dnaCard: {
      trigger: "Connected components in 2D Grid / Flood fill",
      invariant: "Cell visited ⇒ mutated to '0'",
      dataStructure: "2D Matrix Grid",
      timeComplexity: "O(R × C)",
      spaceComplexity: "O(R × C) Recursion Stack",
      typicalConstraints: "R, C ≤ 300",
      difficulty: "Intermediate",
      interviewFrequency: "Extremely High (90%)",
      goldenFormula: "Directions: [(-1,0), (1,0), (0,-1), (0,1)]"
    },
    problemBreakthrough: {
      title: "LeetCode 200: Number of Islands",
      problemStatement: "Count number of 4-directionally connected islands in binary grid.",
      naiveApproach: "Unbounded recursion causing stack overflow.",
      patternRevelation: "Grid Flood Fill DFS mutates visited '1' cells to '0' to guarantee O(R × C) single-pass runtime!",
      keyEquation: "grid[r][c] = '0' on visit"
    },
    illusions: [
      {
        looksLike: "Graph Adjacency List",
        actuallyIs: "Implicit Grid Graph",
        keyDifference: "No need to build adjacency lists; neighbor coordinates are (r + dr, c + dc)."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "Tree DFS", desc: "Left/Right branches" },
      { stage: "Tier 2", name: "Grid Flood Fill", desc: "4-directional neighbors" }
    ],
    familyTree: {
      children: ["union-find"],
      related: ["bfs-dfs-trees"],
      confusedWith: ["bfs-dfs-trees"]
    },
    interviewSignals: ["Number of islands", "Max area of island", "Rotting oranges (BFS)"],
    pitfalls: [
      "Forgetting boundary checks (r < 0 || r >= R || c < 0 || c >= C).",
      "Forgetting to mark cell as visited before making recursive calls (causes infinite recursion loop)."
    ],
    memoryCard: {
      trigger: "2D Grid connected islands / flood fill",
      invariant: "Sink visited land to '0'",
      formula: "4-directional recursive DFS",
      complexity: "O(R × C)",
      mentalImage: "Paint Bucket Fill",
      goldenRule: "Mutate cell on entry to prevent loops"
    },
    practiceProblems: [
      { title: "Number of Islands", slug: "number-of-islands", difficulty: "Medium", clue: "Grid flood fill DFS/BFS mutating visited land '1' -> '0'." },
      { title: "Max Area of Island", slug: "max-area-of-island", difficulty: "Medium", clue: "DFS counting 4-directionally connected land cells." },
      { title: "Rotting Oranges", slug: "rotting-oranges", difficulty: "Medium", clue: "Multi-source BFS spreading rot minute by minute." },
      { title: "Pacific Atlantic Water Flow", slug: "pacific-atlantic-water-flow", difficulty: "Medium", clue: "Reverse BFS/DFS starting from ocean boundary cells." },
      { title: "Surrounded Regions", slug: "surrounded-regions", difficulty: "Medium", clue: "DFS from border 'O's to mark non-surrounded land." },
      { title: "Word Search", slug: "word-search", difficulty: "Medium", clue: "Grid Backtracking DFS with visited cell marking." },
      { title: "Longest Increasing Path in a Matrix", slug: "longest-increasing-path-in-a-matrix", difficulty: "Hard", clue: "Grid DFS with memoization on increasing neighbor paths." }
    ]
  },

  "union-find": {
    mentalTrigger: "Dynamic connectivity queries, counting connected components, or detecting graph cycles.",
    visualIntuition: `
  Elements: 0, 1, 2, 3, 4  (Initially 5 isolated components)
  parent = [0, 1, 2, 3, 4]

  Union(0, 1): parent[1] = 0 ──► Sets: {0,1}, {2}, {3}, {4}
  Union(1, 2): parent[2] = 0 ──► Sets: {0,1,2}, {3}, {4}
  Query find(2) == find(0)? ──► Both root 0! Connected ✓

  Union(3, 4): parent[4] = 3 ──► Sets: {0,1,2}, {3,4}
  Query find(2) == find(4)? ──► Root 0 != Root 3 ──► Not Connected!
    `,
    bruteForceVsPattern: {
      bruteLabel: "DFS/BFS Graph Re-scan",
      bruteTime: "O(V + E) per query",
      bruteDesc: "Re-runs full graph traversal for every connection query.",
      patternLabel: "Disjoint Set Union (DSU)",
      patternTime: "O(α(N)) ≈ O(1) Nearly Constant",
      patternDesc: "Uses Path Compression and Rank to make find and union operations virtually instantaneous.",
      opComparison: "O(V) per query → O(α(N)) constant time"
    },
    coreInsight: "Each connected component is represented as a tree rooted at a single canonical representative node.",
    mentalModel: {
      name: "Kingdom Representatives Metaphor",
      metaphor: "Every city belongs to a kingdom led by a King (Root). Two cities belong to the same kingdom if they share the same King.",
      explanation: "Path compression connects every city directly to its King during lookup."
    },
    visualInvariant: "find(u) always returns the ultimate root representative of element u.",
    universalPseudocode: [
      "class DSU:",
      "    parent = [0..N-1]",
      "    def find(i):",
      "        if parent[i] != i:",
      "            parent[i] = find(parent[i]) // Path Compression",
      "        return parent[i]",
      "    def union(i, j):",
      "        rootI, rootJ = find(i), find(j)",
      "        if rootI != rootJ: parent[rootI] = rootJ"
    ],
    templates: {
      python: `class DSU:
    def __init__(self, n: int):
        self.parent = list(range(n))

    def find(self, i: int) -> int:
        if self.parent[i] != i:
            self.parent[i] = self.find(self.parent[i])  # Path Compression
        return self.parent[i]

    def union(self, i: int, j: int) -> bool:
        root_i, root_j = self.find(i), self.find(j)
        if root_i != root_j:
            self.parent[root_i] = root_j
            return True
        return False`,
      java: `public class DSU {
    private int[] parent;

    public DSU(int n) {
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    public int find(int i) {
        if (parent[i] != i) {
            parent[i] = find(parent[i]); // Path Compression
        }
        return parent[i];
    }

    public boolean union(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI != rootJ) {
            parent[rootI] = rootJ;
            return true;
        }
        return false;
    }
}`,
      cpp: `class DSU {
    vector<int> parent;
public:
    DSU(int n) : parent(n) {
        iota(parent.begin(), parent.end(), 0);
    }

    int find(int i) {
        if (parent[i] != i)
            parent[i] = find(parent[i]); // Path Compression
        return parent[i];
    }

    bool unionSets(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI != rootJ) {
            parent[rootI] = rootJ;
            return true;
        }
        return false;
    }
};`,
      rust: `struct DSU {
    parent: Vec<usize>,
}

impl DSU {
    fn new(n: usize) -> Self {
        DSU { parent: (0..n).collect() }
    }

    fn find(&mut self, i: usize) -> usize {
        if self.parent[i] != i {
            let p = self.parent[i];
            self.parent[i] = self.find(p);
        }
        self.parent[i]
    }

    fn union(&mut self, i: usize, j: usize) -> bool {
        let root_i = self.find(i);
        let root_j = self.find(j);
        if root_i != root_j {
            self.parent[root_i] = root_j;
            true
        } else { false }
    }
}`,
      typescript: `class DSU {
  private parent: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
  }

  find(i: number): number {
    if (this.parent[i] !== i) {
      this.parent[i] = this.find(this.parent[i]);
    }
    return this.parent[i];
  }

  union(i: number, j: number): boolean {
    const rootI = this.find(i), rootJ = this.find(j);
    if (rootI !== rootJ) {
      this.parent[rootI] = rootJ;
      return true;
    }
    return false;
  }
}`
    },
    dnaCard: {
      trigger: "Dynamic graph connectivity / cycle detection",
      invariant: "Path compression reduces tree depth",
      dataStructure: "Parent Array",
      timeComplexity: "O(α(N)) ≈ O(1)",
      spaceComplexity: "O(N)",
      typicalConstraints: "N ≤ 10^5",
      difficulty: "Advanced",
      interviewFrequency: "High",
      goldenFormula: "parent[i] = find(parent[i])"
    },
    problemBreakthrough: {
      title: "LeetCode 547: Number of Provinces",
      problemStatement: "Given n cities and connection matrix, return total number of connected provinces.",
      naiveApproach: "Run DFS/BFS graph search taking O(N²) time.",
      patternRevelation: "Initialize DSU with N components. For each connected pair (u,v), call union(u,v). Remaining disjoint set count is the answer in O(N² α(N)) time!",
      keyEquation: "provinces = N - successful_unions"
    },
    illusions: [
      {
        looksLike: "DFS Graph Search",
        actuallyIs: "Disjoint Set Union (DSU)",
        keyDifference: "DSU supports DYNAMIC online union and connectivity queries, whereas DFS is static."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "BFS/DFS Graph Search", desc: "O(V + E) static" },
      { stage: "Tier 2", name: "Disjoint Set Union", desc: "O(α(N)) dynamic" }
    ],
    familyTree: {
      children: ["topological-sort"],
      related: ["matrix-traversal"],
      confusedWith: ["matrix-traversal"]
    },
    interviewSignals: ["Connected components", "Redundant connection cycle", "Kruskal's MST"],
    pitfalls: [
      "Forgetting Path Compression (parent[i] = find(parent[i])) leading to O(N) degenerate trees.",
      "Not initializing parent array parent[i] = i."
    ],
    memoryCard: {
      trigger: "Graph connectivity or cycle check",
      invariant: "parent[root] == root",
      formula: "parent[i] = find(parent[i])",
      complexity: "O(α(N)) ≈ O(1)",
      mentalImage: "Kingdom Representatives",
      goldenRule: "Flatten tree with path compression"
    },
    practiceProblems: [
      { title: "Number of Connected Components", slug: "number-of-connected-components-in-an-undirected-graph", difficulty: "Medium", clue: "Union edge endpoints, decrement total components count." },
      { title: "Redundant Connection", slug: "redundant-connection", difficulty: "Medium", clue: "First edge where find(u) == find(v) creates a cycle." },
      { title: "Graph Valid Tree", slug: "graph-valid-tree", difficulty: "Medium", clue: "Check for N-1 edges and single connected component via Union-Find." },
      { title: "Most Stones Removed with Same Row or Column", slug: "most-stones-removed-with-same-row-or-column", difficulty: "Medium", clue: "Union row index and column index for each stone." },
      { title: "Accounts Merge", slug: "accounts-merge", difficulty: "Medium", clue: "Union email strings belonging to same account holder." },
      { title: "Number of Islands II", slug: "number-of-islands-ii", difficulty: "Hard", clue: "Dynamic grid Union-Find connecting newly added land cells to neighbors." },
      { title: "Min Cost to Connect All Points", slug: "min-cost-to-connect-all-points", difficulty: "Medium", clue: "Kruskal's MST algorithm sorting edges and applying Union-Find." }
    ]
  },

  "topological-sort": {
    mentalTrigger: "Task scheduling with prerequisites, build systems, or DAG ordering.",
    visualIntuition: `
  Course Prerequisites:  0 ──► 1 ──► 3
                         └──► 2 ──► 3

  In-Degree Array: [0:0, 1:1, 2:1, 3:2]

  Step 1: Push 0-indegree nodes to Queue ──► Queue = [0]
  Step 2: Pop 0 ──► Decrement neighbors 1 & 2 ──► In-Degrees: [1:0, 2:0]
  Step 3: Push 1 & 2 to Queue ──► Queue = [1, 2]
  Step 4: Pop 1 & 2 ──► Decrement neighbor 3 twice ──► In-Degree 3: 0!
  Step 5: Push 3 to Queue ──► Queue = [3]

  Topological Order: [0, 1, 2, 3] ✓
    `,
    bruteForceVsPattern: {
      bruteLabel: "Brute Permutation Search",
      bruteTime: "O(N!)",
      bruteDesc: "Generates all orderings and checks prerequisite constraints.",
      patternLabel: "Kahn's Algorithm (BFS)",
      patternTime: "O(V + E)",
      patternDesc: "Computes in-degrees. Processes 0-indegree nodes via Queue, guaranteeing valid topological order.",
      opComparison: "Exponential N! → Linear O(V + E)"
    },
    coreInsight: "A node can only be processed when all its incoming prerequisite edges (in-degree) reach zero.",
    mentalModel: {
      name: "University Course Prerequisite Metaphor",
      metaphor: "You can only enroll in CS102 after completing CS101. CS101 has 0 prerequisites, so you take it first.",
      explanation: "Decrementing in-degree simulates completing a prerequisite."
    },
    visualInvariant: "Nodes in queue always have exactly 0 remaining prerequisites.",
    universalPseudocode: [
      "compute in_degree array for all nodes",
      "queue = [nodes with in_degree == 0]",
      "order = []",
      "while queue:",
      "    u = queue.pop()",
      "    order.append(u)",
      "    for v in adj[u]:",
      "        in_degree[v] -= 1",
      "        if in_degree[v] == 0: queue.push(v)",
      "return order if len(order) == V else []"
    ],
    templates: {
      python: `def findOrder(numCourses: int, prerequisites: list[list[int]]) -> list[int]:
    adj = [[] for _ in range(numCourses)]
    in_degree = [0] * numCourses
    for dest, src in prerequisites:
        adj[src].append(dest)
        in_degree[dest] += 1

    queue = [i for i in range(numCourses) if in_degree[i] == 0]
    order = []
    while queue:
        u = queue.pop(0)
        order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
    return order if len(order) == numCourses else []`,
      java: `public int[] findOrder(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    int[] inDegree = new int[numCourses];
    for (int[] p : prerequisites) {
        adj.get(p[1]).add(p[0]);
        inDegree[p[0]]++;
    }

    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) queue.add(i);

    int[] order = new int[numCourses];
    int idx = 0;
    while (!queue.isEmpty()) {
        int u = queue.poll();
        order[idx++] = u;
        for (int v : adj.get(u)) {
            if (--inDegree[v] == 0) queue.add(v);
        }
    }
    return idx == numCourses ? order : new int[0];
}`,
      cpp: `vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    vector<int> inDegree(numCourses, 0);
    for (const auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);
        inDegree[p[0]]++;
    }

    queue<int> q;
    for (int i = 0; i < numCourses; ++i) if (inDegree[i] == 0) q.push(i);

    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--inDegree[v] == 0) q.push(v);
        }
    }
    return order.size() == numCourses ? order : vector<int>();
}`,
      rust: `fn find_order(num_courses: i32, prerequisites: Vec<Vec<i32>>) -> Vec<i32> {
    let n = num_courses as usize;
    let mut adj = vec![vec![]; n];
    let mut in_degree = vec![0; n];
    for p in prerequisites {
        adj[p[1] as usize].push(p[0] as usize);
        in_degree[p[0] as usize] += 1;
    }

    let mut q = std::collections::VecDeque::new();
    for i in 0..n { if in_degree[i] == 0 { q.push_back(i); } }

    let mut order = Vec::new();
    while let Some(u) = q.pop_front() {
        order.push(u as i32);
        for &v in &adj[u] {
            in_degree[v] -= 1;
            if in_degree[v] == 0 { q.push_back(v); }
        }
    }
    if order.len() == n { order } else { vec![] }
}`,
      typescript: `function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  const inDegree: number[] = new Array(numCourses).fill(0);
  for (const [dest, src] of prerequisites) {
    adj[src].push(dest);
    inDegree[dest]++;
  }

  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i);

  const order: number[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    for (const v of adj[u]) {
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    }
  }
  return order.length === numCourses ? order : [];
}`
    },
    dnaCard: {
      trigger: "Task scheduling / dependency DAG ordering",
      invariant: "Only 0 in-degree nodes entered queue",
      dataStructure: "Queue + Adjacency List",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V + E)",
      typicalConstraints: "V ≤ 10^5, E ≤ 10^5",
      difficulty: "Advanced",
      interviewFrequency: "High",
      goldenFormula: "Push to queue when in_degree[v] == 0"
    },
    problemBreakthrough: {
      title: "LeetCode 210: Course Schedule II",
      problemStatement: "Return ordering of courses to finish all courses given prerequisite pairs.",
      naiveApproach: "Uncontrolled DFS loop causing cycle deadlock.",
      patternRevelation: "Kahn's Algorithm uses in-degree array + Queue. If order length < numCourses, a cycle exists!",
      keyEquation: "in_degree[v] == 0 ⇒ Ready to process"
    },
    illusions: [
      {
        looksLike: "Standard BFS",
        actuallyIs: "Topological Sort (Kahn's)",
        keyDifference: "Standard BFS explores by distance; Topological Sort explores by prerequisite completion."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "Tree BFS", desc: "Level order" },
      { stage: "Tier 2", name: "Kahn's Topo Sort", desc: "In-degree ordering" }
    ],
    familyTree: {
      children: [],
      related: ["union-find"],
      confusedWith: ["union-find"]
    },
    interviewSignals: ["Course schedule prerequisites", "Build system dependency", "Alien dictionary"],
    pitfalls: [
      "Reversing edge direction (adding in-degree to src instead of dest).",
      "Failing to detect cycles when processed node count < total vertices."
    ],
    memoryCard: {
      trigger: "Dependency ordering / prerequisites",
      invariant: "In-degree 0 nodes ready",
      formula: "Decrement in-degree, push when 0",
      complexity: "O(V + E)",
      mentalImage: "University Course Syllabus",
      goldenRule: "Process nodes with zero prerequisites first"
    },
    practiceProblems: [
      { title: "Course Schedule", slug: "course-schedule", difficulty: "Medium", clue: "Cycle detection in prerequisite DAG using in-degrees or DFS coloring." },
      { title: "Course Schedule II", slug: "course-schedule-ii", difficulty: "Medium", clue: "Kahn's algorithm in-degree queue returning valid course ordering." },
      { title: "Alien Dictionary", slug: "alien-dictionary", difficulty: "Hard", clue: "Build character DAG from adjacent word differences, run Topo Sort." },
      { title: "Minimum Height Trees", slug: "minimum-height-trees", difficulty: "Medium", clue: "Trim leaf nodes layer by layer using in-degrees until centroids remain." },
      { title: "Sequence Reconstruction", slug: "sequence-reconstruction", difficulty: "Medium", clue: "Verify if queue size is always 1 during Topo Sort for unique order." },
      { title: "Sort Items by Groups Respecting Dependencies", slug: "sort-items-by-groups-respecting-dependencies", difficulty: "Hard", clue: "Double Topo Sort: sort groups first, then sort items within groups." }
    ]
  },

  "knapsack-dp": {
    mentalTrigger: "Maximum value under capacity constraint W, or subset sum equal to target.",
    visualIntuition: `
  Items: (W:2, V:3), (W:3, V:4), (W:4, V:5)  Capacity W = 5

  2D DP Table dp[i][w] = Max value using items 0..i-1:
            Cap 0 | Cap 1 | Cap 2 | Cap 3 | Cap 4 | Cap 5
  Item 0:     0   |   0   |   0   |   0   |   0   |   0
  Item 1(2,3): 0  |   0   |   3   |   3   |   3   |   3
  Item 2(3,4): 0  |   0   |   3   |   4   |   4   |   7  (3+4=7 ✓)
  Item 3(4,5): 0  |   0   |   3   |   4   |   5   |   7

  Max Optimal Value = 7 (Include Item 1 + Item 2) ✓
    `,
    bruteForceVsPattern: {
      bruteLabel: "Recursive Decision Tree",
      bruteTime: "O(2^N)",
      bruteDesc: "Explores all 2^N subset combinations of items.",
      patternLabel: "0/1 Knapsack DP",
      patternTime: "O(N × W)",
      patternDesc: "Fills 2D table dp[i][w] by storing solutions to overlapping subproblems.",
      opComparison: "2^100 ≈ 10^30 ops → 100 × 1,000 = 100,000 ops"
    },
    coreInsight: "For each item i and capacity w, we make a binary choice: exclude item i (dp[i-1][w]) or include item i (v[i] + dp[i-1][w - w[i]]).",
    mentalModel: {
      name: "Backpack Packing Metaphor",
      metaphor: "Packing a backpack for a hike: for every item, you decide whether its value justifies taking up precious backpack volume.",
      explanation: "Overlapping capacity subproblems are saved in memory."
    },
    visualInvariant: "dp[w] stores maximum achievable value for capacity w using subset of items considered so far.",
    universalPseudocode: [
      "dp = array of size W + 1 filled with 0",
      "for (weight, value) in items:",
      "    for w from W down to weight: // Reverse loop for 0/1 Knapsack!",
      "        dp[w] = max(dp[w], value + dp[w - weight])",
      "return dp[W]"
    ],
    templates: {
      python: `def knapsack(weights: list[int], values: list[int], W: int) -> int:
    dp = [0] * (W + 1)
    for wt, val in zip(weights, values):
        for w in range(W, wt - 1, -1):  # Reverse for 0/1 Knapsack
            dp[w] = max(dp[w], val + dp[w - wt])
    return dp[W]`,
      java: `public int knapsack(int[] weights, int[] values, int W) {
    int[] dp = new int[W + 1];
    for (int i = 0; i < weights.length; i++) {
        for (int w = W; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
        }
    }
    return dp[W];
}`,
      cpp: `int knapsack(const vector<int>& weights, const vector<int>& values, int W) {
    vector<int> dp(W + 1, 0);
    for (size_t i = 0; i < weights.size(); ++i) {
        for (int w = W; w >= weights[i]; --w) {
            dp[w] = max(dp[w], values[i] + dp[w - weights[i]]);
        }
    }
    return dp[W];
}`,
      rust: `fn knapsack(weights: &[usize], values: &[i32], w_cap: usize) -> i32 {
    let mut dp = vec![0; w_cap + 1];
    for (&wt, &val) in weights.iter().zip(values.iter()) {
        for w in (wt..=w_cap).rev() {
            dp[w] = dp[w].max(val + dp[w - wt]);
        }
    }
    dp[w_cap]
}`,
      typescript: `function knapsack(weights: number[], values: number[], W: number): number {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let w = W; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
    }
  }
  return dp[W];
}`
    },
    dnaCard: {
      trigger: "Optimization under capacity constraint / subset sum",
      invariant: "dp[w] = max value for capacity w",
      dataStructure: "1D / 2D DP Table",
      timeComplexity: "O(N × W)",
      spaceComplexity: "O(W) Space-Optimized",
      typicalConstraints: "N ≤ 1000, W ≤ 10^4",
      difficulty: "Advanced",
      interviewFrequency: "High",
      goldenFormula: "dp[w] = max(dp[w], val + dp[w - weight])"
    },
    problemBreakthrough: {
      title: "LeetCode 416: Partition Equal Subset Sum",
      problemStatement: "Determine if array can be partitioned into two subsets with equal sum.",
      naiveApproach: "Check all 2^N subset combinations.",
      patternRevelation: "Transform to 0/1 Knapsack: find subset summing to Target = TotalSum / 2. DP table evaluates in O(N × Target) time!",
      keyEquation: "Target = Sum / 2"
    },
    illusions: [
      {
        looksLike: "Greedy Search",
        actuallyIs: "Dynamic Programming",
        keyDifference: "Greedy fails on Knapsack because choosing highest value/weight ratio item can leave unusable capacity gap."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "Brute Subset 2^N", desc: "Exponential" },
      { stage: "Tier 2", name: "Knapsack DP", desc: "O(N × W)" }
    ],
    familyTree: {
      children: ["segment-tree"],
      related: ["prefix-sum"],
      confusedWith: ["prefix-sum"]
    },
    interviewSignals: ["Subset sum equal to target", "Target sum with + and -", "Coin change"],
    pitfalls: [
      "Iterating weight loop forward instead of backward in 1D array space optimization (allows re-using same item infinitely!).",
      "Not handling odd sum total early in equal subset partition."
    ],
    memoryCard: {
      trigger: "Subset selection under capacity",
      invariant: "Max value for capacity W",
      formula: "Reverse loop for 0/1 knapsack",
      complexity: "O(N × W)",
      mentalImage: "Backpack Volume Packing",
      goldenRule: "Choice: exclude dp[w] vs include val + dp[w-wt]"
    },
    practiceProblems: [
      { title: "Partition Equal Subset Sum", slug: "partition-equal-subset-sum", difficulty: "Medium", clue: "0/1 Knapsack where capacity target = total sum / 2." },
      { title: "Target Sum", slug: "target-sum", difficulty: "Medium", clue: "Transform to subset sum DP where subset target = (target + total) / 2." },
      { title: "Coin Change", slug: "coin-change", difficulty: "Medium", clue: "Unbounded Knapsack DP computing min coins for target amount." },
      { title: "Coin Change II", slug: "coin-change-ii", difficulty: "Medium", clue: "Unbounded Knapsack DP counting total combinations." },
      { title: "Ones and Zeroes", slug: "ones-and-zeroes", difficulty: "Medium", clue: "2D 0/1 Knapsack with capacity limits on m zeros and n ones." },
      { title: "Combination Sum IV", slug: "combination-sum-iv", difficulty: "Medium", clue: "Permutation DP sum for reaching target amount." },
      { title: "Last Stone Weight II", slug: "last-stone-weight-ii", difficulty: "Medium", clue: "Minimize difference between two subset sums using 0/1 Knapsack DP." }
    ]
  },

  "segment-tree": {
    mentalTrigger: "Point updates with range min/max/sum queries in O(log N) dynamic time.",
    visualIntuition: `
  Array: [ 1 | 3 | 5 | 7 ]

              [0..3] Sum=16
             /             \\
      [0..1] Sum=4     [2..3] Sum=12
      /         \\       /         \\
   [0] Sum=1  [1] Sum=3 [2] Sum=5  [3] Sum=7

  Point Update A[1] = 10:
  Update [1] Sum=3 ──► 10
  Update Parent [0..1] Sum=4 ──► 11
  Update Root [0..3] Sum=16 ──► 23 in O(log N) time!
    `,
    bruteForceVsPattern: {
      bruteLabel: "Array Mutate + Linear Query",
      bruteTime: "O(1) Update, O(N) Query",
      bruteDesc: "Prefix sum gives O(1) query but O(N) update; raw array gives O(1) update but O(N) query.",
      patternLabel: "Segment Tree",
      patternTime: "O(log N) Update, O(log N) Query",
      patternDesc: "Binary tree where each node represents a range segment. Both updates and range queries run in O(log N).",
      opComparison: "O(N) per query → O(log N) per query"
    },
    coreInsight: "A Segment Tree balances update cost and query cost at O(log N) by storing precomputed segment aggregates in a binary tree.",
    mentalModel: {
      name: "Tournament Bracket Metaphor",
      metaphor: "A tennis tournament bracket. If one player changes their score, only their match path up to the final championship needs updating.",
      explanation: "Only log2(N) ancestor nodes on the path to root are updated."
    },
    visualInvariant: "Each node at index tree[i] stores the aggregate sum/min/max of its child range segments.",
    universalPseudocode: [
      "tree = array of size 4 * N",
      "def build(node, start, end):",
      "    if start == end: tree[node] = nums[start]; return",
      "    mid = (start + end) // 2",
      "    build(2*node, start, mid)",
      "    build(2*node+1, mid+1, end)",
      "    tree[node] = tree[2*node] + tree[2*node+1]",
      "",
      "def query(node, start, end, L, R):",
      "    if R < start or end < L: return 0",
      "    if L <= start and end <= R: return tree[node]",
      "    mid = (start + end) // 2",
      "    return query(2*node, start, mid, L, R) + query(2*node+1, mid+1, end, L, R)"
    ],
    templates: {
      python: `class SegmentTree:
    def __init__(self, nums: list[int]):
        self.n = len(nums)
        self.tree = [0] * (4 * self.n)
        if self.n > 0:
            self._build(nums, 1, 0, self.n - 1)

    def _build(self, nums, node, start, end):
        if start == end:
            self.tree[node] = nums[start]
            return
        mid = (start + end) // 2
        self._build(nums, 2 * node, start, mid)
        self._build(nums, 2 * node + 1, mid + 1, end)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def update(self, idx: int, val: int, node=1, start=0, end=None):
        if end is None: end = self.n - 1
        if start == end:
            self.tree[node] = val
            return
        mid = (start + end) // 2
        if start <= idx <= mid:
            self.update(idx, val, 2 * node, start, mid)
        else:
            self.update(idx, val, 2 * node + 1, mid + 1, end)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def query(self, L: int, R: int, node=1, start=0, end=None) -> int:
        if end is None: end = self.n - 1
        if R < start or end < L: return 0
        if L <= start and end <= R: return self.tree[node]
        mid = (start + end) // 2
        return self.query(L, R, 2 * node, start, mid) + self.query(L, R, 2 * node + 1, mid + 1, end)`,
      java: `public class SegmentTree {
    private int[] tree;
    private int n;

    public SegmentTree(int[] nums) {
        n = nums.length;
        tree = new int[4 * n];
        if (n > 0) build(nums, 1, 0, n - 1);
    }

    private void build(int[] nums, int node, int start, int end) {
        if (start == end) { tree[node] = nums[start]; return; }
        int mid = (start + end) / 2;
        build(nums, 2 * node, start, mid);
        build(nums, 2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    public void update(int idx, int val, int node, int start, int end) {
        if (start == end) { tree[node] = val; return; }
        int mid = (start + end) / 2;
        if (idx <= mid) update(idx, val, 2 * node, start, mid);
        else update(idx, val, 2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    public int query(int L, int R, int node, int start, int end) {
        if (R < start || end < L) return 0;
        if (L <= start && end <= R) return tree[node];
        int mid = (start + end) / 2;
        return query(L, R, 2 * node, start, mid) + query(L, R, 2 * node + 1, mid + 1, end);
    }
}`,
      cpp: `class SegmentTree {
    vector<int> tree;
    int n;

    void build(const vector<int>& nums, int node, int start, int end) {
        if (start == end) { tree[node] = nums[start]; return; }
        int mid = (start + end) / 2;
        build(nums, 2 * node, start, mid);
        build(nums, 2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }
public:
    SegmentTree(const vector<int>& nums) : n(nums.size()), tree(4 * nums.size(), 0) {
        if (n > 0) build(nums, 1, 0, n - 1);
    }

    void update(int idx, int val, int node, int start, int end) {
        if (start == end) { tree[node] = val; return; }
        int mid = (start + end) / 2;
        if (idx <= mid) update(idx, val, 2 * node, start, mid);
        else update(idx, val, 2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    int query(int L, int R, int node, int start, int end) {
        if (R < start || end < L) return 0;
        if (L <= start && end <= R) return tree[node];
        int mid = (start + end) / 2;
        return query(L, R, 2 * node, start, mid) + query(L, R, 2 * node + 1, mid + 1, end);
    }
};`,
      rust: `struct SegmentTree {
    tree: Vec<i32>,
    n: usize,
}

impl SegmentTree {
    fn new(nums: &[i32]) -> Self {
        let n = nums.len();
        let mut st = SegmentTree { tree: vec![0; 4 * n], n };
        if n > 0 { st.build(nums, 1, 0, n - 1); }
        st
    }

    fn build(&mut self, nums: &[i32], node: usize, start: usize, end: usize) {
        if start == end { self.tree[node] = nums[start]; return; }
        let mid = (start + end) / 2;
        self.build(nums, 2 * node, start, mid);
        self.build(nums, 2 * node + 1, mid + 1, end);
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1];
    }

    fn query(&self, l: usize, r: usize, node: usize, start: usize, end: usize) -> i32 {
        if r < start || end < l { return 0; }
        if l <= start && end <= r { return self.tree[node]; }
        let mid = (start + end) / 2;
        self.query(l, r, 2 * node, start, mid) + self.query(l, r, 2 * node + 1, mid + 1, end)
    }
}`,
      typescript: `class SegmentTree {
  private tree: number[];
  private n: number;

  constructor(nums: number[]) {
    this.n = nums.length;
    this.tree = new Array(4 * this.n).fill(0);
    if (this.n > 0) this.build(nums, 1, 0, this.n - 1);
  }

  private build(nums: number[], node: number, start: number, end: number) {
    if (start === end) { this.tree[node] = nums[start]; return; }
    const mid = Math.floor((start + end) / 2);
    this.build(nums, 2 * node, start, mid);
    this.build(nums, 2 * node + 1, mid + 1, end);
    this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
  }

  query(L: number, R: number, node = 1, start = 0, end = this.n - 1): number {
    if (R < start || end < L) return 0;
    if (L <= start && end <= R) return this.tree[node];
    const mid = Math.floor((start + end) / 2);
    return this.query(L, R, 2 * node, start, mid) + this.query(L, R, 2 * node + 1, mid + 1, end);
  }
}`
    },
    dnaCard: {
      trigger: "Dynamic range sum/min/max with point updates",
      invariant: "tree[node] = aggregate(left_child, right_child)",
      dataStructure: "Binary Segment Tree Array",
      timeComplexity: "O(log N) Update & Query",
      spaceComplexity: "O(4N)",
      typicalConstraints: "N ≤ 10^5, Q ≤ 10^5",
      difficulty: "Expert",
      interviewFrequency: "Moderate (Advanced)",
      goldenFormula: "Both Update & Query take O(log N)"
    },
    problemBreakthrough: {
      title: "LeetCode 307: Range Sum Query - Mutable",
      problemStatement: "Support point updates nums[i] = val and range sum queries sum(L..R) dynamically.",
      naiveApproach: "Prefix sum takes O(N) per point update; raw array takes O(N) per range query.",
      patternRevelation: "Segment Tree balances both point update and range query at O(log N) time per operation!",
      keyEquation: "tree[node] = tree[2*node] + tree[2*node+1]"
    },
    illusions: [
      {
        looksLike: "Prefix Sum",
        actuallyIs: "Segment Tree",
        keyDifference: "Prefix Sum takes O(N) time for point updates; Segment Tree takes O(log N)."
      }
    ],
    evolution: [
      { stage: "Tier 1", name: "Prefix Sum", desc: "O(1) static query, O(N) mutate" },
      { stage: "Tier 2", name: "Segment Tree", desc: "O(log N) dynamic query & mutate" }
    ],
    familyTree: {
      children: [],
      related: ["prefix-sum", "difference-array"],
      confusedWith: ["prefix-sum"]
    },
    interviewSignals: ["Range query with mutable updates", "Count smaller numbers after self", "Skyline problem"],
    pitfalls: [
      "Allocating tree size N instead of 4N (causes index out of bounds).",
      "Incorrect overlap condition logic in range query."
    ],
    memoryCard: {
      trigger: "Dynamic range query + point update",
      invariant: "tree[node] stores range aggregate",
      formula: "Binary tree split at mid",
      complexity: "O(log N) Both Ops",
      mentalImage: "Tournament Score Bracket",
      goldenRule: "Balance update and query at O(log N)"
    },
    practiceProblems: [
      { title: "Range Sum Query - Mutable", slug: "range-sum-query-mutable", difficulty: "Medium", clue: "Segment Tree / Fenwick Tree point update and range sum query in O(log N)." },
      { title: "Count of Smaller Numbers After Self", slug: "count-of-smaller-numbers-after-self", difficulty: "Hard", clue: "Fenwick Tree / Segment Tree on coordinate-compressed value frequencies." },
      { title: "Create Sorted Array Through Instructions", slug: "create-sorted-array-through-instructions", difficulty: "Hard", clue: "Fenwick Tree counting numbers strictly smaller and larger." },
      { title: "My Calendar III", slug: "my-calendar-iii", difficulty: "Hard", clue: "Dynamic Segment Tree with lazy propagation for interval overlap counts." },
      { title: "The Skyline Problem", slug: "the-skyline-problem", difficulty: "Hard", clue: "Segment Tree or Priority Queue sweep line tracking building heights." },
      { title: "Online Majority Element in Subarray", slug: "online-majority-element-in-subarray", difficulty: "Hard", clue: "Segment Tree storing candidate majority element via Boyer-Moore voting." }
    ]
  }
}

export function getPatternExhibit(patternId: string): PatternExhibitData {
  return PATTERN_EXHIBITS[patternId] || PATTERN_EXHIBITS["prefix-sum"]
}

export function getPatternLesson(patternId: string): PatternExhibitData | undefined {
  return PATTERN_EXHIBITS[patternId]
}
