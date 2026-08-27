import type { MultiLangTemplate } from "./types"

export const BIT_TEMPLATES: MultiLangTemplate[] = [
  {
    id: "bit-manipulation-tricks",
    title: "Bit Manipulation Essential Operations",
    category: "Bit Manipulation",
    tags: ["Bit Manipulation", "Bitmask", "Submasks", "Kernighan"],
    description: "Standard toolkit for set bit counting (Brian Kernighan), power of 2 check, submask iteration, and lowest set bit extraction.",
    complexity: { time: "O(1) / O(2^k)", space: "O(1)" },
    isBuiltIn: true,
    code: {
      python: `# 1. Clear lowest set bit: n & (n - 1)
# 2. Extract lowest set bit: n & (-n)
# 3. Check if power of two: n > 0 and (n & (n - 1)) == 0

def count_set_bits(n: int) -> int:
    """Brian Kernighan's Algorithm: counts 1s in O(number of set bits)."""
    count = 0
    while n > 0:
        n &= (n - 1)  # Clears lowest set bit
        count += 1
    return count

def iterate_all_submasks(mask: int):
    """Iterates through all submasks of a bitmask in decreasing order."""
    sub = mask
    while sub > 0:
        # process submask 'sub'
        sub = (sub - 1) & mask`,
      java: `public class BitUtils {
    // 1. Clear lowest set bit: n & (n - 1)
    // 2. Extract lowest set bit: n & (-n)
    // 3. Power of 2: n > 0 && (n & (n - 1)) == 0

    public static int countSetBits(int n) {
        int count = 0;
        while (n > 0) {
            n &= (n - 1); // Clears lowest set bit
            count++;
        }
        return count;
    }

    public static void iterateSubmasks(int mask) {
        for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
            // process submask 'sub'
        }
    }
}`,
      cpp: `// 1. Clear lowest set bit: n & (n - 1)
// 2. Extract lowest set bit: n & (-n)
// 3. Power of 2 check: n > 0 && (n & (n - 1)) == 0

int countSetBits(int n) {
    int count = 0;
    while (n > 0) {
        n &= (n - 1); // Clears lowest set bit
        count++;
    }
    return count;
}

void iterateSubmasks(int mask) {
    for (int sub = mask; sub > 0; sub = (sub - 1) & mask) {
        // process submask 'sub'
    }
}`,
      typescript: `// 1. Clear lowest set bit: n & (n - 1)
// 2. Extract lowest set bit: n & (-n)
// 3. Power of 2 check: n > 0 && (n & (n - 1)) === 0

function countSetBits(n: number): number {
  let count = 0;
  while (n > 0) {
    n &= n - 1; // Clears lowest set bit
    count++;
  }
  return count;
}

function iterateSubmasks(mask: number, callback: (sub: number) => void): void {
  for (let sub = mask; sub > 0; sub = (sub - 1) & mask) {
    callback(sub);
  }
}`,
      go: `// 1. Clear lowest set bit: n & (n - 1)
// 2. Extract lowest set bit: n & (-n)
// 3. Power of 2 check: n > 0 && (n & (n - 1)) == 0

func countSetBits(n int) int {
    count := 0
    for n > 0 {
        n &= (n - 1) // Clears lowest set bit
        count++
    }
    return count
}

func iterateSubmasks(mask int, fn func(sub int)) {
    for sub := mask; sub > 0; sub = (sub - 1) & mask {
        fn(sub)
    }
}`
    }
  }
]
