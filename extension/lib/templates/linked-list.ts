import type { MultiLangTemplate } from "./types"

export const LINKED_LIST_TEMPLATES: MultiLangTemplate[] = [
  {
    id: "linked-list-reverse",
    title: "Reverse Linked List (Iterative & Range [Left, Right])",
    category: "Linked List",
    tags: ["Linked List", "Reverse", "Pointers", "In-Place"],
    description: "Reverses a singly linked list in O(N) time and O(1) space, and reverses between position left and right.",
    complexity: { time: "O(N)", space: "O(1)" },
    isBuiltIn: true,
    code: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    """Iteratively reverses singly linked list."""
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

def reverse_between(head: ListNode, left: int, right: int) -> ListNode:
    """Reverses linked list from position left to right (1-indexed)."""
    dummy = ListNode(0, head)
    prev = dummy
    for _ in range(left - 1):
        prev = prev.next

    curr = prev.next
    for _ in range(right - left):
        nxt = curr.next
        curr.next = nxt.next
        nxt.next = prev.next
        prev.next = nxt

    return dummy.next`,
      java: `public class LinkedListUtils {
    public static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    public static ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode nxt = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nxt;
        }
        return prev;
    }

    public static ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy;
        for (int i = 0; i < left - 1; i++) prev = prev.next;

        ListNode curr = prev.next;
        for (int i = 0; i < right - left; i++) {
            ListNode nxt = curr.next;
            curr.next = nxt.next;
            nxt.next = prev.next;
            prev.next = nxt;
        }
        return dummy.next;
    }
}`,
      cpp: `struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while (curr) {
        ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}

ListNode* reverseBetween(ListNode* head, int left, int right) {
    ListNode dummy(0, head);
    ListNode* prev = &dummy;
    for (int i = 0; i < left - 1; i++) prev = prev->next;

    ListNode* curr = prev->next;
    for (int i = 0; i < right - left; i++) {
        ListNode* nxt = curr->next;
        curr->next = nxt->next;
        nxt->next = prev->next;
        prev->next = nxt;
    }
    return dummy.next;
}`,
      typescript: `class ListNode {
  val: number;
  next: ListNode | null = null;
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  while (curr !== null) {
    const nxt: ListNode | null = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nxt;
  }
  return prev;
}

function reverseBetween(head: ListNode | null, left: number, right: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  for (let i = 0; i < left - 1; i++) prev = prev.next!;

  const curr = prev.next!;
  for (let i = 0; i < right - left; i++) {
    const nxt = curr.next!;
    curr.next = nxt.next;
    nxt.next = prev.next;
    prev.next = nxt;
  }
  return dummy.next;
}`,
      go: `type ListNode struct {
    Val  int
    Next *ListNode
}

func ReverseList(head *ListNode) *ListNode {
    var prev *ListNode
    curr := head
    for curr != nil {
        nxt := curr.Next
        curr.Next = prev
        prev = curr
        curr = nxt
    }
    return prev
}

func ReverseBetween(head *ListNode, left, right int) *ListNode {
    dummy := &ListNode{Val: 0, Next: head}
    prev := dummy
    for i := 0; i < left-1; i++ {
        prev = prev.Next
    }

    curr := prev.Next
    for i := 0; i < right-left; i++ {
        nxt := curr.Next
        curr.Next = nxt.Next
        nxt.Next = prev.Next
        prev.Next = nxt
    }
    return dummy.Next
}`
    }
  },
  {
    id: "linked-list-slow-fast",
    title: "Slow & Fast Pointers (Cycle Detection & Middle Node)",
    category: "Linked List",
    tags: ["Linked List", "Fast Slow Pointers", "Floyd Cycle", "Middle Node"],
    description: "Floyd's Tortoise and Hare algorithm for cycle detection, cycle start finding, and middle node retrieval in O(N) and O(1) space.",
    complexity: { time: "O(N)", space: "O(1)" },
    isBuiltIn: true,
    code: {
      python: `def has_cycle(head: ListNode) -> bool:
    """Floyd's cycle detection."""
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False

def detect_cycle_start(head: ListNode) -> ListNode:
    """Finds node where the cycle begins."""
    slow, fast = head, head
    has_cycle = False

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            has_cycle = True
            break

    if not has_cycle:
        return None

    # Reset one pointer to head and move both 1 step at a time
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next

    return slow`,
      java: `public static boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}

public static ListNode detectCycleStart(ListNode head) {
    ListNode slow = head, fast = head;
    boolean hasCycle = false;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            hasCycle = true;
            break;
        }
    }
    if (!hasCycle) return null;

    slow = head;
    while (slow != fast) {
        slow = slow.next;
        fast = fast.next;
    }
    return slow;
}`,
      cpp: `bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}

ListNode* detectCycleStart(ListNode* head) {
    ListNode *slow = head, *fast = head;
    bool hasCycle = false;

    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            hasCycle = true;
            break;
        }
    }
    if (!hasCycle) return nullptr;

    slow = head;
    while (slow != fast) {
        slow = slow->next;
        fast = fast->next;
    }
    return slow;
}`,
      typescript: `function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

function detectCycleStart(head: ListNode | null): ListNode | null {
  let slow = head, fast = head;
  let hasCycle = false;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      hasCycle = true;
      break;
    }
  }
  if (!hasCycle) return null;

  slow = head;
  while (slow !== fast) {
    slow = slow!.next;
    fast = fast!.next;
  }
  return slow;
}`,
      go: `func HasCycle(head *ListNode) bool {
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
        if slow == fast { return true }
    }
    return false
}

func DetectCycleStart(head *ListNode) *ListNode {
    slow, fast := head, head
    hasCycle := false

    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
        if slow == fast {
            hasCycle = true
            break
        }
    }
    if !hasCycle { return nil }

    slow = head
    for slow != fast {
        slow = slow.Next
        fast = fast.Next
    }
    return slow
}`
    }
  },
  {
    id: "lru-cache",
    title: "LRU Cache (Doubly Linked List + Hash Map)",
    category: "Linked List",
    tags: ["Linked List", "LRU Cache", "Doubly Linked List", "Hash Map", "Design"],
    description: "Least Recently Used (LRU) Cache supporting O(1) get and O(1) put operations using sentinel head/tail pointers and a hash map.",
    complexity: { time: "Get: O(1), Put: O(1)", space: "O(Capacity)" },
    isBuiltIn: true,
    code: {
      python: `class DNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}  # key -> DNode
        self.head = DNode()
        self.tail = DNode()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: DNode) -> None:
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_front(self, node: DNode) -> None:
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._add_to_front(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._remove(node)
            self._add_to_front(node)
        else:
            if len(self.cache) >= self.cap:
                lru = self.tail.prev
                self._remove(lru)
                del self.cache[lru.key]
            new_node = DNode(key, value)
            self.cache[key] = new_node
            self._add_to_front(new_node)`,
      java: `public class LRUCache {
    static class DNode {
        int key, val;
        DNode prev, next;
        DNode(int k, int v) { key = k; val = v; }
    }

    private final int capacity;
    private final Map<Integer, DNode> cache = new HashMap<>();
    private final DNode head = new DNode(0, 0);
    private final DNode tail = new DNode(0, 0);

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    private void remove(DNode node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void addToFront(DNode node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }

    public int get(int key) {
        if (!cache.containsKey(key)) return -1;
        DNode node = cache.get(key);
        remove(node);
        addToFront(node);
        return node.val;
    }

    public void put(int key, int value) {
        if (cache.containsKey(key)) {
            DNode node = cache.get(key);
            node.val = value;
            remove(node);
            addToFront(node);
        } else {
            if (cache.size() >= capacity) {
                DNode lru = tail.prev;
                remove(lru);
                cache.remove(lru.key);
            }
            DNode newNode = new DNode(key, value);
            cache.put(key, newNode);
            addToFront(newNode);
        }
    }
}`,
      cpp: `class LRUCache {
    struct DNode {
        int key, val;
        DNode *prev, *next;
        DNode(int k, int v) : key(k), val(v), prev(nullptr), next(nullptr) {}
    };

    int cap;
    unordered_map<int, DNode*> cache;
    DNode *head, *tail;

    void remove(DNode* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }

    void addToFront(DNode* node) {
        node->next = head->next;
        node->prev = head;
        head->next->prev = node;
        head->next = node;
    }

public:
    LRUCache(int capacity) : cap(capacity) {
        head = new DNode(0, 0);
        tail = new DNode(0, 0);
        head->next = tail;
        tail->prev = head;
    }

    int get(int key) {
        if (cache.find(key) == cache.end()) return -1;
        DNode* node = cache[key];
        remove(node);
        addToFront(node);
        return node->val;
    }

    void put(int key, int value) {
        if (cache.find(key) != cache.end()) {
            DNode* node = cache[key];
            node->val = value;
            remove(node);
            addToFront(node);
        } else {
            if ((int)cache.size() >= cap) {
                DNode* lru = tail->prev;
                remove(lru);
                cache.erase(lru->key);
                delete lru;
            }
            DNode* newNode = new DNode(key, value);
            cache[key] = newNode;
            addToFront(newNode);
        }
    }
};`,
      typescript: `class DNode {
  key: number;
  val: number;
  prev: DNode | null = null;
  next: DNode | null = null;
  constructor(key = 0, val = 0) {
    this.key = key;
    this.val = val;
  }
}

class LRUCache {
  private cap: number;
  private cache = new Map<number, DNode>();
  private head = new DNode();
  private tail = new DNode();

  constructor(capacity: number) {
    this.cap = capacity;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private remove(node: DNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private addToFront(node: DNode): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key)!;
    this.remove(node);
    this.addToFront(node);
    return node.val;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      node.val = value;
      this.remove(node);
      this.addToFront(node);
    } else {
      if (this.cache.size >= this.cap) {
        const lru = this.tail.prev!;
        this.remove(lru);
        this.cache.delete(lru.key);
      }
      const newNode = new DNode(key, value);
      this.cache.set(key, newNode);
      this.addToFront(newNode);
    }
  }
}`,
      go: `type DNode struct {
    key, val   int
    prev, next *DNode
}

type LRUCache struct {
    cap        int
    cache      map[int]*DNode
    head, tail *DNode
}

func Constructor(capacity int) LRUCache {
    head, tail := &DNode{}, &DNode{}
    head.next = tail
    tail.prev = head
    return LRUCache{
        cap:   capacity,
        cache: make(map[int]*DNode),
        head:  head,
        tail:  tail,
    }
}

func (c *LRUCache) remove(node *DNode) {
    node.prev.next = node.next
    node.next.prev = node.prev
}

func (c *LRUCache) addToFront(node *DNode) {
    node.next = c.head.next
    node.prev = c.head
    c.head.next.prev = node
    c.head.next = node
}

func (c *LRUCache) Get(key int) int {
    if node, ok := c.cache[key]; ok {
        c.remove(node)
        c.addToFront(node)
        return node.val
    }
    return -1
}

func (c *LRUCache) Put(key, value int) {
    if node, ok := c.cache[key]; ok {
        node.val = value
        c.remove(node)
        c.addToFront(node)
    } else {
        if len(c.cache) >= c.cap {
            lru := c.tail.prev
            c.remove(lru)
            delete(c.cache, lru.key)
        }
        newNode := &DNode{key: key, val: value}
        c.cache[key] = newNode
        c.addToFront(newNode)
    }
}`
    }
  }
]
