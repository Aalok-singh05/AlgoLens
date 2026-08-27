import type { MultiLangTemplate, SupportedLang } from "./types"
import { MATH_TEMPLATES } from "./math"
import { BIT_TEMPLATES } from "./bit-manipulation"
import { STRING_TEMPLATES } from "./strings"
import { DP_TEMPLATES } from "./dynamic-programming"
import { BINARY_SEARCH_TEMPLATES } from "./binary-search"
import { SLIDING_WINDOW_TEMPLATES } from "./sliding-window"
import { GRAPH_TEMPLATES } from "./graphs"
import { TREE_TEMPLATES } from "./trees"
import { DATA_STRUCTURE_TEMPLATES } from "./data-structures"
import { BACKTRACKING_TEMPLATES } from "./backtracking"
import { LINKED_LIST_TEMPLATES } from "./linked-list"

export * from "./types"

export const ALL_BUILTIN_TEMPLATES: MultiLangTemplate[] = [
  ...MATH_TEMPLATES,
  ...BIT_TEMPLATES,
  ...STRING_TEMPLATES,
  ...BINARY_SEARCH_TEMPLATES,
  ...SLIDING_WINDOW_TEMPLATES,
  ...BACKTRACKING_TEMPLATES,
  ...LINKED_LIST_TEMPLATES,
  ...GRAPH_TEMPLATES,
  ...TREE_TEMPLATES,
  ...DATA_STRUCTURE_TEMPLATES,
  ...DP_TEMPLATES
]
