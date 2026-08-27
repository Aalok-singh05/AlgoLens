import type { MultiLangTemplate } from "./types"

export const MATH_TEMPLATES: MultiLangTemplate[] = [
  {
    id: "fast-power-mod",
    title: "Fast Exponentiation & Modulo Inverse",
    category: "Math & Number Theory",
    tags: ["Math", "Number Theory", "Binary Exponentiation", "Mod Inverse", "Fermat"],
    description: "Calculates (base^exp) % MOD in O(log exp) time. Computes modular inverse using Fermat's Little Theorem (base^(MOD-2) % MOD) when MOD is prime.",
    complexity: { time: "O(log Exp)", space: "O(1)" },
    isBuiltIn: true,
    code: {
      python: `def power_mod(base: int, exp: int, mod: int = 10**9 + 7) -> int:
    """Calculates (base^exp) % mod in O(log exp) time."""
    res = 1
    base %= mod
    while exp > 0:
        if exp % 2 == 1:
            res = (res * base) % mod
        base = (base * base) % mod
        exp //= 2
    return res

def mod_inverse(n: int, p: int = 10**9 + 7) -> int:
    """Modular inverse for prime p using Fermat's Little Theorem: n^(p-2) % p."""
    return power_mod(n, p - 2, p)`,
      java: `public class MathUtils {
    public static final long MOD = 1_000_000_007L;

    public static long powerMod(long base, long exp, long mod) {
        long res = 1;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) res = (res * base) % mod;
            base = (base * base) % mod;
            exp >>= 1;
        }
        return res;
    }

    public static long modInverse(long n, long primeMod) {
        return powerMod(n, primeMod - 2, primeMod);
    }
}`,
      cpp: `long long powerMod(long long base, long long exp, long long mod = 1e9 + 7) {
    long long res = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) res = (res * base) % mod;
        base = (base * base) % mod;
        exp >>= 1;
    }
    return res;
}

long long modInverse(long long n, long long primeMod = 1e9 + 7) {
    return powerMod(n, primeMod - 2, primeMod);
}`,
      typescript: `function powerMod(base: bigint, exp: bigint, mod: bigint = 1000000007n): bigint {
  let res = 1n;
  base %= mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) res = (res * base) % mod;
    base = (base * base) % mod;
    exp /= 2n;
  }
  return res;
}

function modInverse(n: bigint, primeMod: bigint = 1000000007n): bigint {
  return powerMod(n, primeMod - 2n, primeMod);
}`,
      go: `func powerMod(base, exp, mod int64) int64 {
    var res int64 = 1
    base %= mod
    for exp > 0 {
        if exp%2 == 1 {
            res = (res * base) % mod
        }
        base = (base * base) % mod
        exp /= 2
    }
    return res
}

func modInverse(n, primeMod int64) int64 {
    return powerMod(n, primeMod-2, primeMod)
}`
    }
  },
  {
    id: "sieve-primes",
    title: "Sieve of Eratosthenes (Prime Generator)",
    category: "Math & Number Theory",
    tags: ["Math", "Primes", "Sieve", "Number Theory", "Factors"],
    description: "Generates all primes up to N in O(N log log N) and builds smallest prime factor (SPF) array for O(log K) factorizations.",
    complexity: { time: "O(N log log N)", space: "O(N)" },
    isBuiltIn: true,
    code: {
      python: `def sieve_of_eratosthenes(n: int) -> list[int]:
    """Returns list of all prime numbers up to n."""
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False

    for p in range(2, int(n**0.5) + 1):
        if is_prime[p]:
            for multiple in range(p * p, n + 1, p):
                is_prime[multiple] = False

    return [i for i, prime in enumerate(is_prime) if prime]`,
      java: `public static List<Integer> sieve(int n) {
    boolean[] isPrime = new boolean[n + 1];
    Arrays.fill(isPrime, true);
    isPrime[0] = isPrime[1] = false;

    for (int p = 2; p * p <= n; p++) {
        if (isPrime[p]) {
            for (int mult = p * p; mult <= n; mult += p) {
                isPrime[mult] = false;
            }
        }
    }

    List<Integer> primes = new ArrayList<>();
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) primes.add(i);
    }
    return primes;
}`,
      cpp: `vector<int> sieve(int n) {
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;

    for (int p = 2; p * p <= n; p++) {
        if (isPrime[p]) {
            for (int mult = p * p; mult <= n; mult += p) {
                isPrime[mult] = false;
            }
        }
    }

    vector<int> primes;
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) primes.push_back(i);
    }
    return primes;
}`,
      typescript: `function sieve(n: number): number[] {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;

  for (let p = 2; p * p <= n; p++) {
    if (isPrime[p]) {
      for (let mult = p * p; mult <= n; mult += p) {
        isPrime[mult] = false;
      }
    }
  }

  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
  }
  return primes;
}`,
      go: `func sieve(n int) []int {
    isPrime := make([]bool, n+1)
    for i := 2; i <= n; i++ {
        isPrime[i] = true
    }

    for p := 2; p*p <= n; p++ {
        if isPrime[p] {
            for mult := p * p; mult <= n; mult += p {
                isPrime[mult] = false
            }
        }
    }

    primes := make([]int, 0)
    for i := 2; i <= n; i++ {
        if isPrime[i] {
            primes = append(primes, i)
        }
    }
    return primes
}`
    }
  },
  {
    id: "gcd-lcm",
    title: "Euclidean GCD & LCM",
    category: "Math & Number Theory",
    tags: ["Math", "GCD", "LCM", "Euclid"],
    description: "Calculates Greatest Common Divisor and Least Common Multiple in logarithmic time.",
    complexity: { time: "O(log(min(a, b)))", space: "O(1)" },
    isBuiltIn: true,
    code: {
      python: `def gcd(a: int, b: int) -> int:
    while b:
        a, b = b, a % b
    return a

def lcm(a: int, b: int) -> int:
    return (a * b) // gcd(a, b) if a and b else 0`,
      java: `public static long gcd(long a, long b) {
    while (b != 0) {
        long temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

public static long lcm(long a, long b) {
    return (a == 0 || b == 0) ? 0 : (a / gcd(a, b)) * b;
}`,
      cpp: `long long gcd(long long a, long long b) {
    while (b) {
        a %= b;
        swap(a, b);
    }
    return a;
}

long long lcm(long long a, long long b) {
    return (a == 0 || b == 0) ? 0 : (a / gcd(a, b)) * b;
}`,
      typescript: `function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function lcm(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : (a / gcd(a, b)) * b;
}`,
      go: `func gcd(a, b int64) int64 {
    for b != 0 {
        a, b = b, a%b
    }
    return a
}

func lcm(a, b int64) int64 {
    if a == 0 || b == 0 {
        return 0
    }
    return (a / gcd(a, b)) * b
}`
    }
  }
]
