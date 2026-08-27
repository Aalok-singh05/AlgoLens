import type { MultiLangTemplate } from "./types"

export const SLIDING_WINDOW_TEMPLATES: MultiLangTemplate[] = [
  {
    id: "two-pointers-3sum-ksum",
    title: "3Sum & K-Sum Two Pointers (Deduplication & Sorting)",
    category: "Two Pointers",
    tags: ["Two Pointers", "3Sum", "K-Sum", "Sorting", "Deduplication"],
    description: "Sort-based two pointers to find unique triplets or k-tuples summing to a target value without hash set duplicates.",
    complexity: { time: "3Sum: O(N^2), K-Sum: O(N^(K-1))", space: "O(1)" },
    isBuiltIn: true,
    code: {
      python: `def three_sum(nums: list[int]) -> list[list[int]]:
    """Finds all unique triplets [nums[i], nums[j], nums[k]] summing to 0."""
    nums.sort()
    res = []
    n = len(nums)

    for i in range(n - 2):
        # Skip duplicate base element
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left, right = i + 1, n - 1
        target = -nums[i]

        while left < right:
            s = nums[left] + nums[right]
            if s == target:
                res.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                # Skip duplicate left/right pointers
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1
            elif s < target:
                left += 1
            else:
                right -= 1

    return res`,
      java: `public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    int n = nums.length;

    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;

        int left = i + 1, right = n - 1;
        int target = -nums[i];

        while (left < right) {
            int sum = nums[left] + nums[right];
            if (sum == target) {
                res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                left++;
                right--;
                while (left < right && nums[left] == nums[left - 1]) left++;
                while (left < right && nums[right] == nums[right + 1]) right--;
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    return res;
}`,
      cpp: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    int n = nums.size();

    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;

        int left = i + 1, right = n - 1;
        int target = -nums[i];

        while (left < right) {
            int sum = nums[left] + nums[right];
            if (sum == target) {
                res.push_back({nums[i], nums[left], nums[right]});
                left++;
                right--;
                while (left < right && nums[left] == nums[left - 1]) left++;
                while (left < right && nums[right] == nums[right + 1]) right--;
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    return res;
}`,
      typescript: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const res: number[][] = [];
  const n = nums.length;

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1, right = n - 1;
    const target = -nums[i];

    while (left < right) {
      const sum = nums[left] + nums[right];
      if (sum === target) {
        res.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        while (left < right && nums[left] === nums[left - 1]) left++;
        while (left < right && nums[right] === nums[right + 1]) right--;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
  }
  return res;
}`,
      go: `import "sort"

func threeSum(nums []int) [][]int {
    sort.Ints(nums)
    res := [][]int{}
    n := len(nums)

    for i := 0; i < n-2; i++ {
        if i > 0 && nums[i] == nums[i-1] { continue }

        left, right := i+1, n-1
        target := -nums[i]

        for left < right {
            sum := nums[left] + nums[right]
            if sum == target {
                res = append(res, []int{nums[i], nums[left], nums[right]})
                left++
                right--
                for left < right && nums[left] == nums[left-1] { left++ }
                for left < right && nums[right] == nums[right+1] { right-- }
            } else if sum < target {
                left++
            } else {
                right--
            }
        }
    }
    return res
}`
    }
  },
  {
    id: "sliding-window-fixed",
    title: "Fixed-Size Sliding Window",
    category: "Two Pointers",
    tags: ["Sliding Window", "Fixed Size", "Subarray Sum", "Subarray Average"],
    description: "Computes properties across all subarrays of exact size K in O(N) linear time.",
    complexity: { time: "O(N)", space: "O(1)" },
    isBuiltIn: true,
    code: {
      python: `def fixed_sliding_window(nums: list[int], k: int) -> int:
    """Finds max sum of any contiguous subarray of size k."""
    if len(nums) < k:
        return 0

    curr_sum = sum(nums[:k])
    max_sum = curr_sum

    for right in range(k, len(nums)):
        curr_sum += nums[right] - nums[right - k]  # Add incoming, remove outgoing
        max_sum = max(max_sum, curr_sum)

    return max_sum`,
      java: `public int fixedSlidingWindow(int[] nums, int k) {
    if (nums.length < k) return 0;

    int currSum = 0;
    for (int i = 0; i < k; i++) currSum += nums[i];
    int maxSum = currSum;

    for (int right = k; right < nums.length; right++) {
        currSum += nums[right] - nums[right - k];
        maxSum = Math.max(maxSum, currSum);
    }
    return maxSum;
}`,
      cpp: `int fixedSlidingWindow(const vector<int>& nums, int k) {
    if ((int)nums.size() < k) return 0;

    int currSum = 0;
    for (int i = 0; i < k; i++) currSum += nums[i];
    int maxSum = currSum;

    for (int right = k; right < (int)nums.size(); right++) {
        currSum += nums[right] - nums[right - k];
        maxSum = max(maxSum, currSum);
    }
    return maxSum;
}`,
      typescript: `function fixedSlidingWindow(nums: number[], k: number): number {
  if (nums.length < k) return 0;

  let currSum = 0;
  for (let i = 0; i < k; i++) currSum += nums[i];
  let maxSum = currSum;

  for (let right = k; right < nums.length; right++) {
    currSum += nums[right] - nums[right - k];
    maxSum = Math.max(maxSum, currSum);
  }
  return maxSum;
}`,
      go: `func fixedSlidingWindow(nums []int, k int) int {
    if len(nums) < k {
        return 0
    }

    currSum := 0
    for i := 0; i < k; i++ {
        currSum += nums[i]
    }
    maxSum := currSum

    for right := k; right < len(nums); right++ {
        currSum += nums[right] - nums[right-k]
        if currSum > maxSum {
            maxSum = currSum
        }
    }
    return maxSum
}`
    }
  },
  {
    id: "sliding-window-variable",
    title: "Variable-Size Sliding Window",
    category: "Two Pointers",
    tags: ["Sliding Window", "Two Pointers", "Subarray", "Substrings"],
    description: "Template for longest or shortest valid subarray/substring by dynamically expanding right and shrinking left.",
    complexity: { time: "O(N)", space: "O(K)" },
    isBuiltIn: true,
    code: {
      python: `def variable_sliding_window(nums: list[int], limit: int) -> int:
    left = 0
    max_len = 0
    window_sum = 0

    for right in range(len(nums)):
        window_sum += nums[right]

        # Shrink while window condition is invalid
        while window_sum > limit and left <= right:
            window_sum -= nums[left]
            left += 1

        max_len = max(max_len, right - left + 1)

    return max_len`,
      java: `public int variableSlidingWindow(int[] nums, int limit) {
    int left = 0, maxLen = 0, windowSum = 0;

    for (int right = 0; right < nums.length; right++) {
        windowSum += nums[right];

        while (windowSum > limit && left <= right) {
            windowSum -= nums[left];
            left++;
        }

        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      cpp: `int variableSlidingWindow(const vector<int>& nums, int limit) {
    int left = 0, maxLen = 0, windowSum = 0;

    for (int right = 0; right < (int)nums.size(); right++) {
        windowSum += nums[right];

        while (windowSum > limit && left <= right) {
            windowSum -= nums[left];
            left++;
        }

        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      typescript: `function variableSlidingWindow(nums: number[], limit: number): number {
  let left = 0, maxLen = 0, windowSum = 0;

  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right];

    while (windowSum > limit && left <= right) {
      windowSum -= nums[left];
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      go: `func variableSlidingWindow(nums []int, limit int) int {
    left, maxLen, windowSum := 0, 0, 0

    for right := 0; right < len(nums); right++ {
        windowSum += nums[right]

        for windowSum > limit && left <= right {
            windowSum -= nums[left]
            left++
        }

        if right-left+1 > maxLen {
            maxLen = right - left + 1
        }
    }
    return maxLen
}`
    }
  },
  {
    id: "sliding-window-freq-map",
    title: "Frequency Map Sliding Window (At Most K Distinct)",
    category: "Two Pointers",
    tags: ["Sliding Window", "Frequency Map", "Distinct Elements", "Hash Map"],
    description: "Tracks distinct elements count using a frequency map with O(N) linear time and O(K) space.",
    complexity: { time: "O(N)", space: "O(K)" },
    isBuiltIn: true,
    code: {
      python: `def at_most_k_distinct(s: str, k: int) -> int:
    """Finds longest substring with at most k distinct characters."""
    freq = {}
    left = 0
    max_len = 0

    for right in range(len(s)):
        ch = s[right]
        freq[ch] = freq.get(ch, 0) + 1

        while len(freq) > k:
            left_ch = s[left]
            freq[left_ch] -= 1
            if freq[left_ch] == 0:
                del freq[left_ch]
            left += 1

        max_len = max(max_len, right - left + 1)

    return max_len`,
      java: `public int atMostKDistinct(String s, int k) {
    Map<Character, Integer> freq = new HashMap<>();
    int left = 0, maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        char ch = s.charAt(right);
        freq.put(ch, freq.getOrDefault(ch, 0) + 1);

        while (freq.size() > k) {
            char leftCh = s.charAt(left);
            freq.put(leftCh, freq.get(leftCh) - 1);
            if (freq.get(leftCh) == 0) freq.remove(leftCh);
            left++;
        }

        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      cpp: `int atMostKDistinct(const string& s, int k) {
    unordered_map<char, int> freq;
    int left = 0, maxLen = 0;

    for (int right = 0; right < (int)s.size(); right++) {
        freq[s[right]]++;

        while ((int)freq.size() > k) {
            char leftCh = s[left];
            freq[leftCh]--;
            if (freq[leftCh] == 0) freq.erase(leftCh);
            left++;
        }

        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      typescript: `function atMostKDistinct(s: string, k: number): number {
  const freq = new Map<string, number>();
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    freq.set(ch, (freq.get(ch) || 0) + 1);

    while (freq.size > k) {
      const leftCh = s[left];
      const count = (freq.get(leftCh) || 0) - 1;
      if (count <= 0) freq.delete(leftCh);
      else freq.set(leftCh, count);
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      go: `func atMostKDistinct(s string, k int) int {
    freq := make(map[byte]int)
    left, maxLen := 0, 0

    for right := 0; right < len(s); right++ {
        freq[s[right]]++

        for len(freq) > k {
            freq[s[left]]--
            if freq[s[left]] == 0 {
                delete(freq, s[left])
            }
            left++
        }

        if right-left+1 > maxLen {
            maxLen = right - left + 1
        }
    }
    return maxLen
}`
    }
  },
  {
    id: "sliding-window-monotonic-deque",
    title: "Monotonic Deque (Sliding Window Maximum)",
    category: "Two Pointers",
    tags: ["Sliding Window", "Monotonic Deque", "Maximum in Window", "Subarray Max"],
    description: "Computes the maximum value in every sliding window of size K in O(N) linear time using a monotonic deque of indices.",
    complexity: { time: "O(N)", space: "O(K)" },
    isBuiltIn: true,
    code: {
      python: `from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    """Finds maximum for all sliding windows of size k in O(N)."""
    q = deque()  # stores indices in monotonically decreasing values
    res = []

    for i in range(len(nums)):
        # 1. Remove indices that are outside the current window
        if q and q[0] <= i - k:
            q.popleft()

        # 2. Maintain monotonic order (remove smaller elements)
        while q and nums[i] >= nums[q[-1]]:
            q.pop()

        q.append(i)

        # 3. Add to result once first window of size k is formed
        if i >= k - 1:
            res.append(nums[q[0]])

    return res`,
      java: `public int[] maxSlidingWindow(int[] nums, int k) {
    if (nums == null || nums.length == 0) return new int[0];
    int n = nums.length;
    int[] res = new int[n - k + 1];
    Deque<Integer> q = new ArrayDeque<>(); // stores indices

    for (int i = 0; i < n; i++) {
        if (!q.isEmpty() && q.peekFirst() <= i - k) {
            q.pollFirst();
        }
        while (!q.isEmpty() && nums[i] >= nums[q.peekLast()]) {
            q.pollLast();
        }
        q.offerLast(i);

        if (i >= k - 1) {
            res[i - k + 1] = nums[q.peekFirst()];
        }
    }
    return res;
}`,
      cpp: `vector<int> maxSlidingWindow(const vector<int>& nums, int k) {
    vector<int> res;
    deque<int> q; // stores indices

    for (int i = 0; i < (int)nums.size(); i++) {
        if (!q.empty() && q.front() <= i - k) {
            q.pop_front();
        }
        while (!q.empty() && nums[i] >= nums[q.back()]) {
            q.pop_back();
        }
        q.push_back(i);

        if (i >= k - 1) {
            res.push_back(nums[q.front()]);
        }
    }
    return res;
}`,
      typescript: `function maxSlidingWindow(nums: number[], k: number): number[] {
  const res: number[] = [];
  const q: number[] = []; // stores indices

  for (let i = 0; i < nums.length; i++) {
    if (q.length > 0 && q[0] <= i - k) {
      q.shift();
    }
    while (q.length > 0 && nums[i] >= nums[q[q.length - 1]]) {
      q.pop();
    }
    q.push(i);

    if (i >= k - 1) {
      res.push(nums[q[0]]);
    }
  }
  return res;
}`,
      go: `func maxSlidingWindow(nums []int, k int) []int {
    res := make([]int, 0, len(nums)-k+1)
    q := make([]int, 0) // stores indices

    for i := 0; i < len(nums); i++ {
        if len(q) > 0 && q[0] <= i-k {
            q = q[1:]
        }
        for len(q) > 0 && nums[i] >= nums[q[len(q)-1]] {
            q = q[:len(q)-1]
        }
        q = append(q, i)

        if i >= k-1 {
            res = append(res, nums[q[0]])
        }
    }
    return res
}`
    }
  }
]
