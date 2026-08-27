import type { MultiLangTemplate } from "./types"

export const TREE_TEMPLATES: MultiLangTemplate[] = [
  {
    id: "bst-operations",
    title: "Binary Search Tree (BST Validation, Insert & Delete)",
    category: "Tree & Trie",
    tags: ["Tree", "BST", "Binary Search Tree", "Validation", "Delete Node"],
    description: "Canonical templates for BST validation (range checks), node insertion, and 3-case node deletion with inorder successor.",
    complexity: { time: "O(H) where H is tree height", space: "O(H)" },
    isBuiltIn: true,
    code: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BSTOperations:
    @staticmethod
    def is_valid_bst(root: TreeNode, min_val=float('-inf'), max_val=float('inf')) -> bool:
        if not root:
            return True
        if not (min_val < root.val < max_val):
            return False
        return (
            BSTOperations.is_valid_bst(root.left, min_val, root.val)
            and BSTOperations.is_valid_bst(root.right, root.val, max_val)
        )

    @staticmethod
    def insert_into_bst(root: TreeNode, val: int) -> TreeNode:
        if not root:
            return TreeNode(val)
        if val < root.val:
            root.left = BSTOperations.insert_into_bst(root.left, val)
        elif val > root.val:
            root.right = BSTOperations.insert_into_bst(root.right, val)
        return root

    @staticmethod
    def delete_node(root: TreeNode, key: int) -> TreeNode:
        if not root:
            return None
        if key < root.val:
            root.left = BSTOperations.delete_node(root.left, key)
        elif key > root.val:
            root.right = BSTOperations.delete_node(root.right, key)
        else:
            if not root.left:
                return root.right
            if not root.right:
                return root.left
            min_node = root.right
            while min_node.left:
                min_node = min_node.left
            root.val = min_node.val
            root.right = BSTOperations.delete_node(root.right, min_node.val)
        return root`,
      java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class BSTOperations {
    public boolean isValidBST(TreeNode root) {
        return validate(root, null, null);
    }

    private boolean validate(TreeNode node, Integer low, Integer high) {
        if (node == null) return true;
        if ((low != null && node.val <= low) || (high != null && node.val >= high)) return false;
        return validate(node.left, low, node.val) && validate(node.right, node.val, high);
    }

    public TreeNode insertIntoBST(TreeNode root, int val) {
        if (root == null) return new TreeNode(val);
        if (val < root.val) root.left = insertIntoBST(root.left, val);
        else if (val > root.val) root.right = insertIntoBST(root.right, val);
        return root;
    }

    public TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) return null;
        if (key < root.val) root.left = deleteNode(root.left, key);
        else if (key > root.val) root.right = deleteNode(root.right, key);
        else {
            if (root.left == null) return root.right;
            if (root.right == null) return root.left;
            TreeNode minNode = root.right;
            while (minNode.left != null) minNode = minNode.left;
            root.val = minNode.val;
            root.right = deleteNode(root.right, minNode.val);
        }
        return root;
    }
}`,
      cpp: `struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BSTOperations {
public:
    bool isValidBST(TreeNode* root, long long minVal = -1e18, long long maxVal = 1e18) {
        if (!root) return true;
        if (root->val <= minVal || root->val >= maxVal) return false;
        return isValidBST(root->left, minVal, root->val) && isValidBST(root->right, root->val, maxVal);
    }

    TreeNode* insertIntoBST(TreeNode* root, int val) {
        if (!root) return new TreeNode(val);
        if (val < root->val) root->left = insertIntoBST(root->left, val);
        else if (val > root->val) root->right = insertIntoBST(root->right, val);
        return root;
    }

    TreeNode* deleteNode(TreeNode* root, int key) {
        if (!root) return nullptr;
        if (key < root->val) root->left = deleteNode(root->left, key);
        else if (key > root->val) root->right = deleteNode(root->right, key);
        else {
            if (!root->left) return root->right;
            if (!root->right) return root->left;
            TreeNode* minNode = root->right;
            while (minNode->left) minNode = minNode->left;
            root->val = minNode->val;
            root->right = deleteNode(root->right, minNode->val);
        }
        return root;
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

class BSTOperations {
  static isValidBST(root: TreeNode | null, minVal = -Infinity, maxVal = Infinity): boolean {
    if (!root) return true;
    if (root.val <= minVal || root.val >= maxVal) return false;
    return (
      BSTOperations.isValidBST(root.left, minVal, root.val) &&
      BSTOperations.isValidBST(root.right, root.val, maxVal)
    );
  }

  static insertIntoBST(root: TreeNode | null, val: number): TreeNode {
    if (!root) return new TreeNode(val);
    if (val < root.val) root.left = BSTOperations.insertIntoBST(root.left, val);
    else if (val > root.val) root.right = BSTOperations.insertIntoBST(root.right, val);
    return root;
  }

  static deleteNode(root: TreeNode | null, key: number): TreeNode | null {
    if (!root) return null;
    if (key < root.val) root.left = BSTOperations.deleteNode(root.left, key);
    else if (key > root.val) root.right = BSTOperations.deleteNode(root.right, key);
    else {
      if (!root.left) return root.right;
      if (!root.right) return root.left;
      let minNode = root.right;
      while (minNode.left) minNode = minNode.left;
      root.val = minNode.val;
      root.right = BSTOperations.deleteNode(root.right, minNode.val);
    }
    return root;
  }
}`,
      go: `type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func isValidBST(root *TreeNode, minVal, maxVal int64) bool {
    if root == nil { return true }
    val := int64(root.Val)
    if val <= minVal || val >= maxVal { return false }
    return isValidBST(root.Left, minVal, val) && isValidBST(root.Right, val, maxVal)
}

func insertIntoBST(root *TreeNode, val int) *TreeNode {
    if root == nil { return &TreeNode{Val: val} }
    if val < root.Val {
        root.Left = insertIntoBST(root.Left, val)
    } else if val > root.Val {
        root.Right = insertIntoBST(root.Right, val)
    }
    return root
}

func deleteNode(root *TreeNode, key int) *TreeNode {
    if root == nil { return nil }
    if key < root.Val {
        root.Left = deleteNode(root.Left, key)
    } else if key > root.Val {
        root.Right = deleteNode(root.Right, key)
    } else {
        if root.Left == nil { return root.Right }
        if root.Right == nil { return root.Left }
        minNode := root.Right
        for minNode.Left != nil { minNode = minNode.Left }
        root.Val = minNode.Val
        root.Right = deleteNode(root.Right, minNode.Val)
    }
    return root
}`
    }
  },
  {
    id: "segment-tree-point-range",
    title: "Iterative Segment Tree (Point Update & Range Query Sum/Min)",
    category: "Tree & Trie",
    tags: ["Segment Tree", "Range Query", "Point Update", "Array", "Trees"],
    description: "Compact 2N array-based iterative segment tree for O(log N) point updates and O(log N) range queries without recursion overhead.",
    complexity: { time: "Build: O(N), Update: O(log N), Query: O(log N)", space: "O(N)" },
    isBuiltIn: true,
    code: {
      python: `class SegmentTree:
    """Iterative 2N Segment Tree for Range Sum Queries."""
    def __init__(self, arr: list[int]):
        self.n = len(arr)
        self.tree = [0] * (2 * self.n)
        # Build leaves
        for i in range(self.n):
            self.tree[self.n + i] = arr[i]
        # Build internal parents
        for i in range(self.n - 1, 0, -1):
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]

    def update(self, idx: int, val: int) -> None:
        """Point update: set arr[idx] = val."""
        pos = idx + self.n
        self.tree[pos] = val
        while pos > 1:
            pos //= 2
            self.tree[pos] = self.tree[2 * pos] + self.tree[2 * pos + 1]

    def query(self, left: int, right: int) -> int:
        """Range query sum on [left, right] inclusive."""
        res = 0
        l = left + self.n
        r = right + self.n + 1
        while l < r:
            if l & 1:
                res += self.tree[l]
                l += 1
            if r & 1:
                r -= 1
                res += self.tree[r]
            l //= 2
            r //= 2
        return res`,
      java: `public class SegmentTree {
    private final int[] tree;
    private final int n;

    public SegmentTree(int[] arr) {
        this.n = arr.length;
        this.tree = new int[2 * n];
        for (int i = 0; i < n; i++) tree[n + i] = arr[i];
        for (int i = n - 1; i > 0; i--) tree[i] = tree[2 * i] + tree[2 * i + 1];
    }

    public void update(int idx, int val) {
        int pos = idx + n;
        tree[pos] = val;
        while (pos > 1) {
            pos /= 2;
            tree[pos] = tree[2 * pos] + tree[2 * pos + 1];
        }
    }

    public int query(int left, int right) {
        int res = 0;
        for (int l = left + n, r = right + n + 1; l < r; l /= 2, r /= 2) {
            if ((l & 1) == 1) res += tree[l++];
            if ((r & 1) == 1) res += tree[--r];
        }
        return res;
    }
}`,
      cpp: `class SegmentTree {
    int n;
    vector<int> tree;

public:
    SegmentTree(const vector<int>& arr) {
        n = arr.size();
        tree.assign(2 * n, 0);
        for (int i = 0; i < n; i++) tree[n + i] = arr[i];
        for (int i = n - 1; i > 0; i--) tree[i] = tree[2 * i] + tree[2 * i + 1];
    }

    void update(int idx, int val) {
        int pos = idx + n;
        tree[pos] = val;
        while (pos > 1) {
            pos /= 2;
            tree[pos] = tree[2 * pos] + tree[2 * pos + 1];
        }
    }

    int query(int left, int right) {
        int res = 0;
        for (int l = left + n, r = right + n + 1; l < r; l /= 2, r /= 2) {
            if (l & 1) res += tree[l++];
            if (r & 1) res += tree[--r];
        }
        return res;
    }
};`,
      typescript: `class SegmentTree {
  private tree: number[];
  private n: number;

  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = new Array(2 * this.n).fill(0);
    for (let i = 0; i < this.n; i++) this.tree[this.n + i] = arr[i];
    for (let i = this.n - 1; i > 0; i--) this.tree[i] = this.tree[2 * i] + this.tree[2 * i + 1];
  }

  update(idx: number, val: number): void {
    let pos = idx + this.n;
    this.tree[pos] = val;
    while (pos > 1) {
      pos = Math.floor(pos / 2);
      this.tree[pos] = this.tree[2 * pos] + this.tree[2 * pos + 1];
    }
  }

  query(left: number, right: number): number {
    let res = 0;
    for (let l = left + this.n, r = right + this.n + 1; l < r; l = Math.floor(l / 2), r = Math.floor(r / 2)) {
      if (l & 1) res += this.tree[l++];
      if (r & 1) res += this.tree[--r];
    }
    return res;
  }
}`,
      go: `type SegmentTree struct {
    tree []int
    n    int
}

func NewSegmentTree(arr []int) *SegmentTree {
    n := len(arr)
    tree := make([]int, 2*n)
    for i := 0; i < n; i++ { tree[n+i] = arr[i] }
    for i := n - 1; i > 0; i-- { tree[i] = tree[2*i] + tree[2*i+1] }
    return &SegmentTree{tree: tree, n: n}
}

func (st *SegmentTree) Update(idx, val int) {
    pos := idx + st.n
    st.tree[pos] = val
    for pos > 1 {
        pos /= 2
        st.tree[pos] = st.tree[2*pos] + st.tree[2*pos+1]
    }
}

func (st *SegmentTree) Query(left, right int) int {
    res := 0
    for l, r := left+st.n, right+st.n+1; l < r; l, r = l/2, r/2 {
        if l&1 == 1 { res += st.tree[l]; l++ }
        if r&1 == 1 { r--; res += st.tree[r] }
    }
    return res
}`
    }
  },
  {
    id: "segment-tree-lazy-propagation",
    title: "Segment Tree with Lazy Propagation (Range Updates & Range Sum)",
    category: "Tree & Trie",
    tags: ["Segment Tree", "Lazy Propagation", "Range Update", "Range Sum", "Trees"],
    description: "Recursive segment tree supporting O(log N) range additions and O(log N) range sum queries using deferred lazy propagation.",
    complexity: { time: "Range Update: O(log N), Range Query: O(log N)", space: "O(N)" },
    isBuiltIn: true,
    code: {
      python: `class LazySegmentTree:
    """Segment Tree with Lazy Propagation for Range Add Updates."""
    def __init__(self, arr: list[int]):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        self._build(arr, 0, 0, self.n - 1)

    def _build(self, arr: list[int], node: int, l: int, r: int):
        if l == r:
            self.tree[node] = arr[l]
            return
        mid = (l + r) // 2
        self._build(arr, 2 * node + 1, l, mid)
        self._build(arr, 2 * node + 2, mid + 1, r)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def _push(self, node: int, l: int, r: int):
        if self.lazy[node] != 0:
            mid = (l + r) // 2
            val = self.lazy[node]
            # Propagate to left child
            self.tree[2 * node + 1] += val * (mid - l + 1)
            self.lazy[2 * node + 1] += val
            # Propagate to right child
            self.tree[2 * node + 2] += val * (r - mid)
            self.lazy[2 * node + 2] += val
            self.lazy[node] = 0

    def update_range(self, ql: int, qr: int, val: int, node: int = 0, l: int = 0, r: int = None):
        if r is None:
            r = self.n - 1
        if ql <= l and r <= qr:
            self.tree[node] += val * (r - l + 1)
            self.lazy[node] += val
            return
        self._push(node, l, r)
        mid = (l + r) // 2
        if ql <= mid:
            self.update_range(ql, qr, val, 2 * node + 1, l, mid)
        if qr > mid:
            self.update_range(ql, qr, val, 2 * node + 2, mid + 1, r)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def query_range(self, ql: int, qr: int, node: int = 0, l: int = 0, r: int = None) -> int:
        if r is None:
            r = self.n - 1
        if ql <= l and r <= qr:
            return self.tree[node]
        self._push(node, l, r)
        mid = (l + r) // 2
        res = 0
        if ql <= mid:
            res += self.query_range(ql, qr, 2 * node + 1, l, mid)
        if qr > mid:
            res += self.query_range(ql, qr, 2 * node + 2, mid + 1, r)
        return res`,
      java: `public class LazySegmentTree {
    private final long[] tree;
    private final long[] lazy;
    private final int n;

    public LazySegmentTree(int[] arr) {
        this.n = arr.length;
        this.tree = new long[4 * n];
        this.lazy = new long[4 * n];
        build(arr, 0, 0, n - 1);
    }

    private void build(int[] arr, int node, int l, int r) {
        if (l == r) { tree[node] = arr[l]; return; }
        int mid = (l + r) / 2;
        build(arr, 2 * node + 1, l, mid);
        build(arr, 2 * node + 2, mid + 1, r);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    private void push(int node, int l, int r) {
        if (lazy[node] != 0) {
            int mid = (l + r) / 2;
            long val = lazy[node];
            tree[2 * node + 1] += val * (mid - l + 1);
            lazy[2 * node + 1] += val;
            tree[2 * node + 2] += val * (r - mid);
            lazy[2 * node + 2] += val;
            lazy[node] = 0;
        }
    }

    public void updateRange(int ql, int qr, long val) {
        updateRange(0, 0, n - 1, ql, qr, val);
    }

    private void updateRange(int node, int l, int r, int ql, int qr, long val) {
        if (ql <= l && r <= qr) {
            tree[node] += val * (r - l + 1);
            lazy[node] += val;
            return;
        }
        push(node, l, r);
        int mid = (l + r) / 2;
        if (ql <= mid) updateRange(2 * node + 1, l, mid, ql, qr, val);
        if (qr > mid) updateRange(2 * node + 2, mid + 1, r, ql, qr, val);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    public long queryRange(int ql, int qr) {
        return queryRange(0, 0, n - 1, ql, qr);
    }

    private long queryRange(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tree[node];
        push(node, l, r);
        int mid = (l + r) / 2;
        long sum = 0;
        if (ql <= mid) sum += queryRange(2 * node + 1, l, mid, ql, qr);
        if (qr > mid) sum += queryRange(2 * node + 2, mid + 1, r, ql, qr);
        return sum;
    }
}`,
      cpp: `class LazySegmentTree {
    int n;
    vector<long long> tree, lazy;

    void build(const vector<int>& arr, int node, int l, int r) {
        if (l == r) { tree[node] = arr[l]; return; }
        int mid = (l + r) / 2;
        build(arr, 2 * node + 1, l, mid);
        build(arr, 2 * node + 2, mid + 1, r);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    void push(int node, int l, int r) {
        if (lazy[node] != 0) {
            int mid = (l + r) / 2;
            long long val = lazy[node];
            tree[2 * node + 1] += val * (mid - l + 1);
            lazy[2 * node + 1] += val;
            tree[2 * node + 2] += val * (r - mid);
            lazy[2 * node + 2] += val;
            lazy[node] = 0;
        }
    }

public:
    LazySegmentTree(const vector<int>& arr) {
        n = arr.size();
        tree.assign(4 * n, 0);
        lazy.assign(4 * n, 0);
        build(arr, 0, 0, n - 1);
    }

    void updateRange(int ql, int qr, long long val, int node = 0, int l = 0, int r = -1) {
        if (r == -1) r = n - 1;
        if (ql <= l && r <= qr) {
            tree[node] += val * (r - l + 1);
            lazy[node] += val;
            return;
        }
        push(node, l, r);
        int mid = (l + r) / 2;
        if (ql <= mid) updateRange(ql, qr, val, 2 * node + 1, l, mid);
        if (qr > mid) updateRange(ql, qr, val, 2 * node + 2, mid + 1, r);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    long long queryRange(int ql, int qr, int node = 0, int l = 0, int r = -1) {
        if (r == -1) r = n - 1;
        if (ql <= l && r <= qr) return tree[node];
        push(node, l, r);
        int mid = (l + r) / 2;
        long long sum = 0;
        if (ql <= mid) sum += queryRange(ql, qr, 2 * node + 1, l, mid);
        if (qr > mid) sum += queryRange(ql, qr, 2 * node + 2, mid + 1, r);
        return sum;
    }
};`,
      typescript: `class LazySegmentTree {
  private tree: bigint[];
  private lazy: bigint[];
  private n: number;

  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0n);
    this.lazy = new Array(4 * this.n).fill(0n);
    this.build(arr, 0, 0, this.n - 1);
  }

  private build(arr: number[], node: number, l: number, r: number): void {
    if (l === r) { this.tree[node] = BigInt(arr[l]); return; }
    const mid = (l + r) >> 1;
    this.build(arr, 2 * node + 1, l, mid);
    this.build(arr, 2 * node + 2, mid + 1, r);
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  private push(node: number, l: number, r: number): void {
    if (this.lazy[node] !== 0n) {
      const mid = (l + r) >> 1;
      const val = this.lazy[node];
      this.tree[2 * node + 1] += val * BigInt(mid - l + 1);
      this.lazy[2 * node + 1] += val;
      this.tree[2 * node + 2] += val * BigInt(r - mid);
      this.lazy[2 * node + 2] += val;
      this.lazy[node] = 0n;
    }
  }

  updateRange(ql: number, qr: number, val: number, node = 0, l = 0, r = this.n - 1): void {
    if (ql <= l && r <= qr) {
      const bVal = BigInt(val);
      this.tree[node] += bVal * BigInt(r - l + 1);
      this.lazy[node] += bVal;
      return;
    }
    this.push(node, l, r);
    const mid = (l + r) >> 1;
    if (ql <= mid) this.updateRange(ql, qr, val, 2 * node + 1, l, mid);
    if (qr > mid) this.updateRange(ql, qr, val, 2 * node + 2, mid + 1, r);
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  queryRange(ql: number, qr: number, node = 0, l = 0, r = this.n - 1): bigint {
    if (ql <= l && r <= qr) return this.tree[node];
    this.push(node, l, r);
    const mid = (l + r) >> 1;
    let sum = 0n;
    if (ql <= mid) sum += this.queryRange(ql, qr, 2 * node + 1, l, mid);
    if (qr > mid) sum += this.queryRange(ql, qr, 2 * node + 2, mid + 1, r);
    return sum;
  }
}`,
      go: `type LazySegmentTree struct {
    tree []int64
    lazy []int64
    n    int
}

func NewLazySegmentTree(arr []int) *LazySegmentTree {
    n := len(arr)
    st := &LazySegmentTree{
        tree: make([]int64, 4*n),
        lazy: make([]int64, 4*n),
        n:    n,
    }
    st.build(arr, 0, 0, n-1)
    return st
}

func (st *LazySegmentTree) build(arr []int, node, l, r int) {
    if l == r { st.tree[node] = int64(arr[l]); return }
    mid := (l + r) / 2
    st.build(arr, 2*node+1, l, mid)
    st.build(arr, 2*node+2, mid+1, r)
    st.tree[node] = st.tree[2*node+1] + st.tree[2*node+2]
}

func (st *LazySegmentTree) push(node, l, r int) {
    if st.lazy[node] != 0 {
        mid := (l + r) / 2
        val := st.lazy[node]
        st.tree[2*node+1] += val * int64(mid-l+1)
        st.lazy[2*node+1] += val
        st.tree[2*node+2] += val * int64(r-mid)
        st.lazy[2*node+2] += val
        st.lazy[node] = 0
    }
}

func (st *LazySegmentTree) UpdateRange(ql, qr int, val int64, node, l, r int) {
    if ql <= l && r <= qr {
        st.tree[node] += val * int64(r-l+1)
        st.lazy[node] += val
        return
    }
    st.push(node, l, r)
    mid := (l + r) / 2
    if ql <= mid { st.UpdateRange(ql, qr, val, 2*node+1, l, mid) }
    if qr > mid { st.UpdateRange(ql, qr, val, 2*node+2, mid+1, r) }
    st.tree[node] = st.tree[2*node+1] + st.tree[2*node+2]
}

func (st *LazySegmentTree) QueryRange(ql, qr, node, l, r int) int64 {
    if ql <= l && r <= qr { return st.tree[node] }
    st.push(node, l, r)
    mid := (l + r) / 2
    var sum int64 = 0
    if ql <= mid { sum += st.QueryRange(ql, qr, 2*node+1, l, mid) }
    if qr > mid { sum += st.QueryRange(ql, qr, 2*node+2, mid+1, r) }
    return sum
}`
    }
  },
  {
    id: "tree-lca-binary-lifting",
    title: "Lowest Common Ancestor (LCA via Binary Lifting)",
    category: "Tree & Trie",
    tags: ["Tree", "LCA", "Binary Lifting", "Ancestor", "Depth"],
    description: "Binary lifting algorithm for O(N log N) tree precomputations and O(log N) Lowest Common Ancestor queries.",
    complexity: { time: "Precompute: O(N log N), Query: O(log N)", space: "O(N log N)" },
    isBuiltIn: true,
    code: {
      python: `class TreeLCA:
    """Lowest Common Ancestor using Binary Lifting."""
    def __init__(self, n: int, adj: list[list[int]], root: int = 0):
        self.n = n
        self.log = 20
        self.up = [[-1] * self.log for _ in range(n)]
        self.depth = [0] * n

        # DFS to initialize 2^0 parents and depths
        self._dfs(root, -1, 0, adj)

        # Precompute 2^k ancestor binary lifting table
        for j in range(1, self.log):
            for i in range(n):
                if self.up[i][j - 1] != -1:
                    self.up[i][j] = self.up[self.up[i][j - 1]][j - 1]

    def _dfs(self, u: int, p: int, d: int, adj: list[list[int]]):
        self.depth[u] = d
        self.up[u][0] = p
        for v in adj[u]:
            if v != p:
                self._dfs(v, u, d + 1, adj)

    def get_lca(self, u: int, v: int) -> int:
        if self.depth[u] < self.depth[v]:
            u, v = v, u

        # 1. Bring u and v to same depth
        diff = self.depth[u] - self.depth[v]
        for j in range(self.log):
            if (diff >> j) & 1:
                u = self.up[u][j]

        if u == v:
            return u

        # 2. Lift u and v together
        for j in range(self.log - 1, -1, -1):
            if self.up[u][j] != self.up[v][j]:
                u = self.up[u][j]
                v = self.up[v][j]

        return self.up[u][0]`,
      java: `public class TreeLCA {
    private final int[][] up;
    private final int[] depth;
    private final int LOG = 20;

    public TreeLCA(int n, List<List<Integer>> adj, int root) {
        up = new int[n][LOG];
        depth = new int[n];
        for (int[] row : up) Arrays.fill(row, -1);

        dfs(root, -1, 0, adj);

        for (int j = 1; j < LOG; j++) {
            for (int i = 0; i < n; i++) {
                if (up[i][j - 1] != -1) {
                    up[i][j] = up[up[i][j - 1]][j - 1];
                }
            }
        }
    }

    private void dfs(int u, int p, int d, List<List<Integer>> adj) {
        depth[u] = d;
        up[u][0] = p;
        for (int v : adj.get(u)) {
            if (v != p) dfs(v, u, d + 1, adj);
        }
    }

    public int getLCA(int u, int v) {
        if (depth[u] < depth[v]) { int t = u; u = v; v = t; }

        int diff = depth[u] - depth[v];
        for (int j = 0; j < LOG; j++) {
            if (((diff >> j) & 1) == 1) u = up[u][j];
        }

        if (u == v) return u;

        for (int j = LOG - 1; j >= 0; j--) {
            if (up[u][j] != up[v][j]) {
                u = up[u][j];
                v = up[v][j];
            }
        }
        return up[u][0];
    }
}`,
      cpp: `class TreeLCA {
    int n, log;
    vector<vector<int>> up;
    vector<int> depth;

    void dfs(int u, int p, int d, const vector<vector<int>>& adj) {
        depth[u] = d;
        up[u][0] = p;
        for (int v : adj[u]) {
            if (v != p) dfs(v, u, d + 1, adj);
        }
    }

public:
    TreeLCA(int n, const vector<vector<int>>& adj, int root = 0) : n(n), log(20) {
        up.assign(n, vector<int>(log, -1));
        depth.assign(n, 0);

        dfs(root, -1, 0, adj);

        for (int j = 1; j < log; j++) {
            for (int i = 0; i < n; i++) {
                if (up[i][j - 1] != -1) {
                    up[i][j] = up[up[i][j - 1]][j - 1];
                }
            }
        }
    }

    int getLCA(int u, int v) {
        if (depth[u] < depth[v]) swap(u, v);

        int diff = depth[u] - depth[v];
        for (int j = 0; j < log; j++) {
            if ((diff >> j) & 1) u = up[u][j];
        }

        if (u == v) return u;

        for (int j = log - 1; j >= 0; j--) {
            if (up[u][j] != up[v][j]) {
                u = up[u][j];
                v = up[v][j];
            }
        }
        return up[u][0];
    }
};`,
      typescript: `class TreeLCA {
  private up: number[][];
  private depth: number[];
  private readonly LOG = 20;

  constructor(n: number, adj: number[][], root = 0) {
    this.up = Array.from({ length: n }, () => new Array(this.LOG).fill(-1));
    this.depth = new Array(n).fill(0);

    this.dfs(root, -1, 0, adj);

    for (let j = 1; j < this.LOG; j++) {
      for (let i = 0; i < n; i++) {
        if (this.up[i][j - 1] !== -1) {
          this.up[i][j] = this.up[this.up[i][j - 1]][j - 1];
        }
      }
    }
  }

  private dfs(u: number, p: number, d: number, adj: number[][]): void {
    this.depth[u] = d;
    this.up[u][0] = p;
    for (const v of adj[u]) {
      if (v !== p) this.dfs(v, u, d + 1, adj);
    }
  }

  getLCA(u: number, v: number): number {
    if (this.depth[u] < this.depth[v]) {
      const temp = u; u = v; v = temp;
    }

    const diff = this.depth[u] - this.depth[v];
    for (let j = 0; j < this.LOG; j++) {
      if ((diff >> j) & 1) u = this.up[u][j];
    }

    if (u === v) return u;

    for (let j = this.LOG - 1; j >= 0; j--) {
      if (this.up[u][j] !== this.up[v][j]) {
        u = this.up[u][j];
        v = this.up[v][j];
      }
    }
    return this.up[u][0];
  }
}`,
      go: `type TreeLCA struct {
    up    [][]int
    depth []int
    log   int
}

func NewTreeLCA(n int, adj [][]int, root int) *TreeLCA {
    const LOG = 20
    up := make([][]int, n)
    for i := range up {
        up[i] = make([]int, LOG)
        for j := range up[i] { up[i][j] = -1 }
    }
    depth := make([]int, n)

    var dfs func(u, p, d int)
    dfs = func(u, p, d int) {
        depth[u] = d
        up[u][0] = p
        for _, v := range adj[u] {
            if v != p { dfs(v, u, d+1) }
        }
    }
    dfs(root, -1, 0)

    for j := 1; j < LOG; j++ {
        for i := 0; i < n; i++ {
            if up[i][j-1] != -1 {
                up[i][j] = up[up[i][j-1]][j-1]
            }
        }
    }

    return &TreeLCA{up: up, depth: depth, log: LOG}
}

func (lca *TreeLCA) GetLCA(u, v int) int {
    if lca.depth[u] < lca.depth[v] {
        u, v = v, u
    }

    diff := lca.depth[u] - lca.depth[v]
    for j := 0; j < lca.log; j++ {
        if (diff>>j)&1 == 1 {
            u = lca.up[u][j]
        }
    }

    if u == v { return u }

    for j := lca.log - 1; j >= 0; j-- {
        if lca.up[u][j] != lca.up[v][j] {
            u = lca.up[u][j]
            v = lca.up[v][j]
        }
    }
    return lca.up[u][0]
}`
    }
  },
  {
    id: "trie-prefix-tree",
    title: "Trie / Prefix Tree (Insert, Search & StartsWith)",
    category: "Tree & Trie",
    tags: ["Tree", "Trie", "Prefix Tree", "Strings", "Search"],
    description: "Array-backed or map-backed Trie for fast O(L) prefix insertions, word lookups, and wildcard prefix search.",
    complexity: { time: "Insert/Search: O(L) where L is word length", space: "O(Total Chars * 26)" },
    isBuiltIn: true,
    code: {
      python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                curr.children[ch] = TrieNode()
            curr = curr.children[ch]
        curr.is_end = True

    def search(self, word: str) -> bool:
        curr = self._traverse(word)
        return curr is not None and curr.is_end

    def starts_with(self, prefix: str) -> bool:
        return self._traverse(prefix) is not None

    def _traverse(self, prefix: str) -> TrieNode:
        curr = self.root
        for ch in prefix:
            if ch not in curr.children:
                return None
            curr = curr.children[ch]
        return curr`,
      java: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEnd = false;
}

public class Trie {
    private final TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode curr = root;
        for (char ch : word.toCharArray()) {
            int idx = ch - 'a';
            if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
            curr = curr.children[idx];
        }
        curr.isEnd = true;
    }

    public boolean search(String word) {
        TrieNode node = traverse(word);
        return node != null && node.isEnd;
    }

    public boolean startsWith(String prefix) {
        return traverse(prefix) != null;
    }

    private TrieNode traverse(String str) {
        TrieNode curr = root;
        for (char ch : str.toCharArray()) {
            int idx = ch - 'a';
            if (curr.children[idx] == null) return null;
            curr = curr.children[idx];
        }
        return curr;
    }
}`,
      cpp: `class TrieNode {
public:
    TrieNode* children[26] = {nullptr};
    bool isEnd = false;
};

class Trie {
    TrieNode* root;

    TrieNode* traverse(const string& str) {
        TrieNode* curr = root;
        for (char ch : str) {
            int idx = ch - 'a';
            if (!curr->children[idx]) return nullptr;
            curr = curr->children[idx];
        }
        return curr;
    }

public:
    Trie() { root = new TrieNode(); }

    void insert(const string& word) {
        TrieNode* curr = root;
        for (char ch : word) {
            int idx = ch - 'a';
            if (!curr->children[idx]) curr->children[idx] = new TrieNode();
            curr = curr->children[idx];
        }
        curr->isEnd = true;
    }

    bool search(const string& word) {
        TrieNode* node = traverse(word);
        return node != nullptr && node->isEnd;
    }

    bool startsWith(const string& prefix) {
        return traverse(prefix) != nullptr;
    }
};`,
      typescript: `class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd = false;
}

class Trie {
  private root = new TrieNode();

  insert(word: string): void {
    let curr = this.root;
    for (const ch of word) {
      if (!curr.children.has(ch)) curr.children.set(ch, new TrieNode());
      curr = curr.children.get(ch)!;
    }
    curr.isEnd = true;
  }

  search(word: string): boolean {
    const node = this.traverse(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix: string): boolean {
    return this.traverse(prefix) !== null;
  }

  private traverse(str: string): TrieNode | null {
    let curr = this.root;
    for (const ch of str) {
      if (!curr.children.has(ch)) return null;
      curr = curr.children.get(ch)!;
    }
    return curr;
  }
}`,
      go: `type TrieNode struct {
    children [26]*TrieNode
    isEnd    bool
}

type Trie struct {
    root *TrieNode
}

func Constructor() Trie {
    return Trie{root: &TrieNode{}}
}

func (t *Trie) Insert(word string) {
    curr := t.root
    for _, ch := range word {
        idx := ch - 'a'
        if curr.children[idx] == nil { curr.children[idx] = &TrieNode{} }
        curr = curr.children[idx]
    }
    curr.isEnd = true
}

func (t *Trie) Search(word string) bool {
    node := t.traverse(word)
    return node != nil && node.isEnd
}

func (t *Trie) StartsWith(prefix string) bool {
    return t.traverse(prefix) != nil
}

func (t *Trie) traverse(str string) *TrieNode {
    curr := t.root
    for _, ch := range str {
        idx := ch - 'a'
        if curr.children[idx] == nil { return nil }
        curr = curr.children[idx]
    }
    return curr
}`
    }
  }
]
