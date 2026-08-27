import type { MultiLangTemplate } from "./types"

export const BINARY_SEARCH_TEMPLATES: MultiLangTemplate[] = [
  {
    id: "bs-lower-bound",
    title: "Lower Bound (First Element >= Target)",
    category: "Binary Search",
    tags: ["Binary Search", "Lower Bound", "Bisect Left", "Sorted Array"],
    description: "Finds the first index in a sorted array where nums[idx] >= target. Returns len(nums) if all elements are smaller.",
    complexity: { time: "O(log N)", space: "O(1)" },
    isBuiltIn: true,
    code: {
      python: `def lower_bound(nums: list[int], target: int) -> int:
    """Returns first index where nums[i] >= target."""
    left, right = 0, len(nums)
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] >= target:
            right = mid  # target could be at mid or to the left
        else:
            left = mid + 1
    return left`,
      java: `public int lowerBound(int[] nums, int target) {
    int left = 0, right = nums.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] >= target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}`,
      cpp: `int lowerBound(const vector<int>& nums, int target) {
    int left = 0, right = nums.size();
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] >= target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}`,
      typescript: `function lowerBound(nums: number[], target: number): number {
  let left = 0, right = nums.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] >= target) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}`,
      go: `func lowerBound(nums []int, target int) int {
    left, right := 0, len(nums)
    for left < right {
        mid := left + (right-left)/2
        if nums[mid] >= target {
            right = mid
        } else {
            left = mid + 1
        }
    }
    return left
}`
    }
  },
  {
    id: "bs-upper-bound",
    title: "Upper Bound (First Element > Target)",
    category: "Binary Search",
    tags: ["Binary Search", "Upper Bound", "Bisect Right", "Sorted Array"],
    description: "Finds the first index in a sorted array where nums[idx] > target. Returns len(nums) if no element is strictly greater.",
    complexity: { time: "O(log N)", space: "O(1)" },
    isBuiltIn: true,
    code: {
      python: `def upper_bound(nums: list[int], target: int) -> int:
    """Returns first index where nums[i] > target."""
    left, right = 0, len(nums)
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] > target:
            right = mid
        else:
            left = mid + 1
    return left`,
      java: `public int upperBound(int[] nums, int target) {
    int left = 0, right = nums.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] > target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}`,
      cpp: `int upperBound(const vector<int>& nums, int target) {
    int left = 0, right = nums.size();
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] > target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}`,
      typescript: `function upperBound(nums: number[], target: number): number {
  let left = 0, right = nums.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] > target) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}`,
      go: `func upperBound(nums []int, target int) int {
    left, right := 0, len(nums)
    for left < right {
        mid := left + (right-left)/2
        if nums[mid] > target {
            right = mid
        } else {
            left = mid + 1
        }
    }
    return left
}`
    }
  },
  {
    id: "bs-on-answer",
    title: "Binary Search on Answer / Monotonic Predicate",
    category: "Binary Search",
    tags: ["Binary Search", "Optimization", "Predicate", "Capacity", "Koko Bananas"],
    description: "Template for finding the minimal or maximal value satisfying a monotonic condition check(mid).",
    complexity: { time: "O(log(High - Low) * Cost)", space: "O(1)" },
    isBuiltIn: true,
    code: {
      python: `def binary_search_answer(low: int, high: int) -> int:
    """Finds minimal x in [low, high] where check(x) is True."""
    def check(mid: int) -> bool:
        # Feasibility condition
        return True

    ans = high
    while low <= high:
        mid = low + (high - low) // 2
        if check(mid):
            ans = mid      # Feasible: search lower for smaller answer
            high = mid - 1
        else:
            low = mid + 1  # Infeasible: search higher
    return ans`,
      java: `public int binarySearchAnswer(int low, int high) {
    int ans = high;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (check(mid)) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return ans;
}

private boolean check(int mid) {
    return true;
}`,
      cpp: `int binarySearchAnswer(int low, int high) {
    int ans = high;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (check(mid)) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return ans;
}

bool check(int mid) {
    return true;
}`,
      typescript: `function binarySearchAnswer(low: number, high: number): number {
  const check = (mid: number): boolean => true;

  let ans = high;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (check(mid)) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}`,
      go: `func binarySearchAnswer(low, high int) int {
    check := func(mid int) bool {
        return true
    }

    ans := high
    for low <= high {
        mid := low + (high-low)/2
        if check(mid) {
            ans = mid
            high = mid - 1
        } else {
            low = mid + 1
        }
    }
    return ans
}`
    }
  },
  {
    id: "bs-rotated-array",
    title: "Search in Rotated Sorted Array",
    category: "Binary Search",
    tags: ["Binary Search", "Rotated Array", "Pivot", "Subarray"],
    description: "Finds target in O(log N) in an array sorted in ascending order and rotated at an unknown pivot.",
    complexity: { time: "O(log N)", space: "O(1)" },
    isBuiltIn: true,
    code: {
      python: `def search_rotated(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid

        # Check if left half is normally sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Otherwise, right half is normally sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1`,
      java: `public int searchRotated(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;

        // Left half is sorted
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } 
        // Right half is sorted
        else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}`,
      cpp: `int searchRotated(const vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;

        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}`,
      typescript: `function searchRotated(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}`,
      go: `func searchRotated(nums []int, target int) int {
    left, right := 0, len(nums)-1
    for left <= right {
        mid := left + (right-left)/2
        if nums[mid] == target {
            return mid
        }

        if nums[left] <= nums[mid] {
            if nums[left] <= target && target < nums[mid] {
                right = mid - 1
            } else {
                left = mid + 1
            }
        } else {
            if nums[mid] < target && target <= nums[right] {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
    }
    return -1
}`
    }
  }
]
