import type { MultiLangTemplate } from "./types"

export const STRING_TEMPLATES: MultiLangTemplate[] = [
  {
    id: "rolling-hash",
    title: "Rolling Hash (Polynomial String Hashing)",
    category: "Strings",
    tags: ["Strings", "Hashing", "Rabin-Karp", "Substring Match"],
    description: "Computes substring hashes in O(1) after O(N) prefix preprocessing. Ideal for substring matching and palindrome checks.",
    complexity: { time: "Precompute: O(N), Query: O(1)", space: "O(N)" },
    isBuiltIn: true,
    code: {
      python: `class StringHasher:
    """Polynomial rolling hash for O(1) substring hash queries."""
    def __init__(self, s: str, base: int = 31, mod: int = 10**9 + 7):
        self.mod = mod
        n = len(s)
        self.h = [0] * (n + 1)
        self.p = [1] * (n + 1)

        for i, ch in enumerate(s):
            self.h[i + 1] = (self.h[i] * base + ord(ch) - ord('a') + 1) % mod
            self.p[i + 1] = (self.p[i] * base) % mod

    def get_hash(self, left: int, right: int) -> int:
        """Returns hash of substring s[left:right+1] (0-indexed)."""
        raw = (self.h[right + 1] - self.h[left] * self.p[right - left + 1]) % self.mod
        return (raw + self.mod) % self.mod`,
      java: `public class StringHasher {
    private final long[] h;
    private final long[] p;
    private final long mod;

    public StringHasher(String s, long base, long mod) {
        this.mod = mod;
        int n = s.length();
        this.h = new long[n + 1];
        this.p = new long[n + 1];
        this.p[0] = 1;

        for (int i = 0; i < n; i++) {
            h[i + 1] = (h[i] * base + (s.charAt(i) - 'a' + 1)) % mod;
            p[i + 1] = (p[i] * base) % mod;
        }
    }

    public long getHash(int left, int right) {
        long raw = (h[right + 1] - (h[left] * p[right - left + 1]) % mod) % mod;
        return (raw + mod) % mod;
    }
}`,
      cpp: `class StringHasher {
    vector<long long> h, p;
    long long mod;

public:
    StringHasher(const string& s, long long base = 31, long long mod = 1e9 + 7) : mod(mod) {
        int n = s.size();
        h.assign(n + 1, 0);
        p.assign(n + 1, 1);

        for (int i = 0; i < n; i++) {
            h[i + 1] = (h[i] * base + (s[i] - 'a' + 1)) % mod;
            p[i + 1] = (p[i] * base) % mod;
        }
    }

    long long getHash(int left, int right) {
        long long raw = (h[right + 1] - (h[left] * p[right - left + 1]) % mod) % mod;
        return (raw + mod) % mod;
    }
};`,
      typescript: `class StringHasher {
  private h: bigint[];
  private p: bigint[];
  private mod: bigint;

  constructor(s: string, base: bigint = 31n, mod: bigint = 1000000007n) {
    this.mod = mod;
    const n = s.length;
    this.h = new Array(n + 1).fill(0n);
    this.p = new Array(n + 1).fill(1n);

    for (let i = 0; i < n; i++) {
      const code = BigInt(s.charCodeAt(i) - 97 + 1);
      this.h[i + 1] = (this.h[i] * base + code) % mod;
      this.p[i + 1] = (this.p[i] * base) % mod;
    }
  }

  getHash(left: number, right: number): bigint {
    const raw = (this.h[right + 1] - (this.h[left] * this.p[right - left + 1]) % this.mod) % this.mod;
    return (raw + this.mod) % this.mod;
  }
}`,
      go: `type StringHasher struct {
    h   []int64
    p   []int64
    mod int64
}

func NewStringHasher(s string, base, mod int64) *StringHasher {
    n := len(s)
    h := make([]int64, n+1)
    p := make([]int64, n+1)
    p[0] = 1

    for i := 0; i < n; i++ {
        code := int64(s[i]-'a' + 1)
        h[i+1] = (h[i]*base + code) % mod
        p[i+1] = (p[i] * base) % mod
    }
    return &StringHasher{h: h, p: p, mod: mod}
}

func (sh *StringHasher) GetHash(left, right int) int64 {
    raw := (sh.h[right+1] - (sh.h[left]*sh.p[right-left+1])%sh.mod) % sh.mod
    return (raw + sh.mod) % sh.mod
}`
    }
  },
  {
    id: "kmp-pattern-search",
    title: "KMP String Matching (Knuth-Morris-Pratt & LPS Array)",
    category: "Strings",
    tags: ["Strings", "KMP", "LPS", "Pattern Search", "Substring"],
    description: "Optimal linear string matching using the Longest Proper Prefix which is also Suffix (LPS) array in O(N + M).",
    complexity: { time: "O(N + M)", space: "O(M)" },
    isBuiltIn: true,
    code: {
      python: `def kmp_search(text: str, pattern: str) -> list[int]:
    """Finds all starting indices of pattern in text using KMP in O(N + M)."""
    if not pattern:
        return []

    # 1. Build Longest Prefix Suffix (LPS) table
    M, N = len(pattern), len(text)
    lps = [0] * M
    j = 0  # length of previous longest prefix suffix

    for i in range(1, M):
        while j > 0 and pattern[i] != pattern[j]:
            j = lps[j - 1]
        if pattern[i] == pattern[j]:
            j += 1
            lps[i] = j

    # 2. Search pattern in text
    matches = []
    j = 0
    for i in range(N):
        while j > 0 and text[i] != pattern[j]:
            j = lps[j - 1]
        if text[i] == pattern[j]:
            j += 1
            if j == M:
                matches.append(i - M + 1)
                j = lps[j - 1]

    return matches`,
      java: `public List<Integer> kmpSearch(String text, String pattern) {
    List<Integer> matches = new ArrayList<>();
    if (pattern.isEmpty()) return matches;

    int M = pattern.length(), N = text.length();
    int[] lps = new int[M];
    int j = 0;

    for (int i = 1; i < M; i++) {
        while (j > 0 && pattern.charAt(i) != pattern.charAt(j)) j = lps[j - 1];
        if (pattern.charAt(i) == pattern.charAt(j)) lps[i] = ++j;
    }

    j = 0;
    for (int i = 0; i < N; i++) {
        while (j > 0 && text.charAt(i) != pattern.charAt(j)) j = lps[j - 1];
        if (text.charAt(i) == pattern.charAt(j)) {
            j++;
            if (j == M) {
                matches.add(i - M + 1);
                j = lps[j - 1];
            }
        }
    }
    return matches;
}`,
      cpp: `vector<int> kmpSearch(const string& text, const string& pattern) {
    vector<int> matches;
    if (pattern.empty()) return matches;

    int M = pattern.size(), N = text.size();
    vector<int> lps(M, 0);
    int j = 0;

    for (int i = 1; i < M; i++) {
        while (j > 0 && pattern[i] != pattern[j]) j = lps[j - 1];
        if (pattern[i] == pattern[j]) lps[i] = ++j;
    }

    j = 0;
    for (int i = 0; i < N; i++) {
        while (j > 0 && text[i] != pattern[j]) j = lps[j - 1];
        if (text[i] == pattern[j]) {
            j++;
            if (j == M) {
                matches.push_back(i - M + 1);
                j = lps[j - 1];
            }
        }
    }
    return matches;
}`,
      typescript: `function kmpSearch(text: string, pattern: string): number[] {
  const matches: number[] = [];
  if (!pattern) return matches;

  const M = pattern.length, N = text.length;
  const lps = new Array(M).fill(0);
  let j = 0;

  for (let i = 1; i < M; i++) {
    while (j > 0 && pattern[i] !== pattern[j]) j = lps[j - 1];
    if (pattern[i] === pattern[j]) lps[i] = ++j;
  }

  j = 0;
  for (let i = 0; i < N; i++) {
    while (j > 0 && text[i] !== pattern[j]) j = lps[j - 1];
    if (text[i] === pattern[j]) {
      j++;
      if (j === M) {
        matches.push(i - M + 1);
        j = lps[j - 1];
      }
    }
  }
  return matches;
}`,
      go: `func kmpSearch(text, pattern string) []int {
    matches := []int{}
    M, N := len(pattern), len(text)
    if M == 0 { return matches }

    lps := make([]int, M)
    j := 0

    for i := 1; i < M; i++ {
        for j > 0 && pattern[i] != pattern[j] { j = lps[j-1] }
        if pattern[i] == pattern[j] {
            j++
            lps[i] = j
        }
    }

    j = 0
    for i := 0; i < N; i++ {
        for j > 0 && text[i] != pattern[j] { j = lps[j-1] }
        if text[i] == pattern[j] {
            j++
            if j == M {
                matches = append(matches, i-M+1)
                j = lps[j-1]
            }
        }
    }
    return matches
}`
    }
  }
]
