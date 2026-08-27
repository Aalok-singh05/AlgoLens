import type { MultiLangTemplate } from "./types"

export const BACKTRACKING_TEMPLATES: MultiLangTemplate[] = [
  {
    id: "backtracking-subsets-combinations",
    title: "Subsets & Combinations (With Duplicate Pruning)",
    category: "Backtracking",
    tags: ["Backtracking", "Subsets", "Combinations", "Recursion", "Pruning"],
    description: "Universal template for generating all subsets/combinations. Handles duplicate elements by sorting and skipping identical adjacent items.",
    complexity: { time: "O(2^N * N)", space: "O(N)" },
    isBuiltIn: true,
    code: {
      python: `def subsets_with_dup(nums: list[int]) -> list[list[int]]:
    """Generates all unique subsets, handling duplicates."""
    nums.sort()  # Sort to bring duplicates together
    res = []
    track = []

    def backtrack(start: int):
        res.append(list(track))  # Add current subset state

        for i in range(start, len(nums)):
            # Prune duplicate branches at the same tree level
            if i > start and nums[i] == nums[i - 1]:
                continue

            track.append(nums[i])   # Choose
            backtrack(i + 1)        # Explore
            track.pop()             # Unchoose

    backtrack(0)
    return res`,
      java: `public class SubsetsCombinations {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums); // Sort to group duplicates
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> track = new ArrayList<>();
        backtrack(nums, 0, track, res);
        return res;
    }

    private void backtrack(int[] nums, int start, List<Integer> track, List<List<Integer>> res) {
        res.add(new ArrayList<>(track));

        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue; // Prune duplicate branch

            track.add(nums[i]);                  // Choose
            backtrack(nums, i + 1, track, res);  // Explore
            track.remove(track.size() - 1);      // Unchoose
        }
    }
}`,
      cpp: `vector<vector<int>> subsetsWithDup(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    vector<int> track;

    auto backtrack = [&](auto self, int start) -> void {
        res.push_back(track);

        for (int i = start; i < (int)nums.size(); i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;

            track.push_back(nums[i]);
            self(self, i + 1);
            track.pop_back();
        }
    };

    backtrack(backtrack, 0);
    return res;
}`,
      typescript: `function subsetsWithDup(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const res: number[][] = [];
  const track: number[] = [];

  function backtrack(start: number) {
    res.push([...track]);

    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;

      track.push(nums[i]);
      backtrack(i + 1);
      track.pop();
    }
  }

  backtrack(0);
  return res;
}`,
      go: `import "sort"

func subsetsWithDup(nums []int) [][]int {
    sort.Ints(nums)
    res := make([][]int, 0)
    track := make([]int, 0)

    var backtrack func(start int)
    backtrack = func(start int) {
        temp := make([]int, len(track))
        copy(temp, track)
        res = append(res, temp)

        for i := start; i < len(nums); i++ {
            if i > start && nums[i] == nums[i-1] {
                continue
            }
            track = append(track, nums[i])
            backtrack(i + 1)
            track = track[:len(track)-1]
        }
    }

    backtrack(0)
    return res
}`
    }
  },
  {
    id: "backtracking-permutations",
    title: "Permutations (Using Used Array)",
    category: "Backtracking",
    tags: ["Backtracking", "Permutations", "Used Array", "Recursion"],
    description: "Generates all permutations of a collection of elements using a boolean 'used' array to track visited items.",
    complexity: { time: "O(N! * N)", space: "O(N)" },
    isBuiltIn: true,
    code: {
      python: `def permute(nums: list[int]) -> list[list[int]]:
    """Generates all permutations of nums."""
    res = []
    track = []
    used = [False] * len(nums)

    def backtrack():
        if len(track) == len(nums):
            res.append(list(track))
            return

        for i in range(len(nums)):
            if used[i]:
                continue

            used[i] = True
            track.append(nums[i])
            backtrack()
            track.pop()
            used[i] = False

    backtrack()
    return res`,
      java: `public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    List<Integer> track = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    backtrack(nums, track, used, res);
    return res;
}

private void backtrack(int[] nums, List<Integer> track, boolean[] used, List<List<Integer>> res) {
    if (track.size() == nums.length) {
        res.add(new ArrayList<>(track));
        return;
    }

    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;

        used[i] = true;
        track.add(nums[i]);
        backtrack(nums, track, used, res);
        track.remove(track.size() - 1);
        used[i] = false;
    }
}`,
      cpp: `vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> res;
    vector<int> track;
    vector<bool> used(nums.size(), false);

    auto backtrack = [&](auto self) -> void {
        if (track.size() == nums.size()) {
            res.push_back(track);
            return;
        }

        for (size_t i = 0; i < nums.size(); i++) {
            if (used[i]) continue;

            used[i] = true;
            track.push_back(nums[i]);
            self(self);
            track.pop_back();
            used[i] = false;
        }
    };

    backtrack(backtrack);
    return res;
}`,
      typescript: `function permute(nums: number[]): number[][] {
  const res: number[][] = [];
  const track: number[] = [];
  const used = new Array(nums.length).fill(false);

  function backtrack() {
    if (track.length === nums.length) {
      res.push([...track]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;

      used[i] = true;
      track.push(nums[i]);
      backtrack();
      track.pop();
      used[i] = false;
    }
  }

  backtrack();
  return res;
}`,
      go: `func permute(nums []int) [][]int {
    res := make([][]int, 0)
    track := make([]int, 0)
    used := make([]bool, len(nums))

    var backtrack func()
    backtrack = func() {
        if len(track) == len(nums) {
            temp := make([]int, len(track))
            copy(temp, track)
            res = append(res, temp)
            return
        }

        for i := 0; i < len(nums); i++ {
            if used[i] {
                continue
            }
            used[i] = true
            track = append(track, nums[i])
            backtrack()
            track = track[:len(track)-1]
            used[i] = false
        }
    }

    backtrack()
    return res
}`
    }
  }
]
