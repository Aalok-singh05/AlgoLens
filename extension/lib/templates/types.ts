export type SupportedLang = "cpp" | "java" | "python" | "typescript" | "go"

export interface MultiLangTemplate {
  id: string
  title: string
  category:
    | "Binary Search"
    | "Two Pointers"
    | "Backtracking"
    | "Monotonic Stack"
    | "Graph"
    | "Tree & Trie"
    | "Disjoint Set"
    | "Dynamic Programming"
    | "Data Structures"
    | "Math & Number Theory"
    | "Bit Manipulation"
    | "Strings"
    | "Intervals"
    | "Linked List"
    | "Custom"
  tags: string[]
  description: string
  complexity: {
    time: string
    space: string
  }
  code: Record<SupportedLang, string>
  isBuiltIn: boolean
  isModified?: boolean
  createdAt?: number
}
