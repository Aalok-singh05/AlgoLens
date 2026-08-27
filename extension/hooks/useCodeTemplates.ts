import { useEffect, useState, useCallback } from "react"
import { Storage } from "@plasmohq/storage"
import { ALL_BUILTIN_TEMPLATES, type MultiLangTemplate, type SupportedLang } from "../lib/templates"

const storage = new Storage({ area: "local" })
export const TEMPLATES_STORAGE_KEY = "algovault.custom_code_templates"
export const MODIFIED_TEMPLATES_KEY = "algovault.modified_code_templates"
export const DELETED_TEMPLATES_KEY = "algovault.deleted_template_ids"
export const PREFERRED_LANG_KEY = "algovault.preferred_template_lang"

export type { SupportedLang, MultiLangTemplate }

export interface CustomTemplate {
  id: string
  title: string
  category: string
  tags: string[]
  description?: string
  complexity?: {
    time: string
    space: string
  }
  code: Partial<Record<SupportedLang, string>>
  createdAt: number
  isBuiltIn: boolean
  isModified?: boolean
}

export type EditableTemplate = MultiLangTemplate | CustomTemplate

export function useCodeTemplates() {
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([])
  const [modifiedTemplates, setModifiedTemplates] = useState<Record<string, Partial<MultiLangTemplate>>>({})
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())
  const [preferredLang, setPreferredLangState] = useState<SupportedLang>("python")
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [savedCustom, savedModified, savedDeleted, savedLang] = await Promise.all([
        storage.get<CustomTemplate[]>(TEMPLATES_STORAGE_KEY),
        storage.get<Record<string, Partial<MultiLangTemplate>>>(MODIFIED_TEMPLATES_KEY),
        storage.get<string[]>(DELETED_TEMPLATES_KEY),
        storage.get<SupportedLang>(PREFERRED_LANG_KEY)
      ])

      if (Array.isArray(savedCustom)) {
        setCustomTemplates(savedCustom)
      }
      if (savedModified && typeof savedModified === "object") {
        setModifiedTemplates(savedModified)
      }
      if (Array.isArray(savedDeleted)) {
        setDeletedIds(new Set(savedDeleted))
      }
      if (savedLang && ["cpp", "java", "python", "typescript", "go"].includes(savedLang)) {
        setPreferredLangState(savedLang)
      }
    } catch (err) {
      console.error("Failed to load code templates:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()

    const listener = (changes: Record<string, any>, areaName: string) => {
      if (areaName === "local") {
        if (
          changes[TEMPLATES_STORAGE_KEY] ||
          changes[MODIFIED_TEMPLATES_KEY] ||
          changes[DELETED_TEMPLATES_KEY] ||
          changes[PREFERRED_LANG_KEY]
        ) {
          loadData()
        }
      }
    }
    chrome.storage.onChanged.addListener(listener)
    return () => chrome.storage.onChanged.removeListener(listener)
  }, [loadData])

  const setPreferredLang = async (lang: SupportedLang) => {
    setPreferredLangState(lang)
    await storage.set(PREFERRED_LANG_KEY, lang)
  }

  // Create a brand new custom template
  const addCustomTemplate = async (template: Omit<CustomTemplate, "id" | "createdAt" | "isBuiltIn">) => {
    const newTemplate: CustomTemplate = {
      ...template,
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
      isBuiltIn: false
    }
    const next = [newTemplate, ...customTemplates]
    await storage.set(TEMPLATES_STORAGE_KEY, next)
    setCustomTemplates(next)
    return newTemplate
  }

  // Edit / Change ANY template (Custom or Built-In override)
  const updateTemplate = async (
    id: string,
    updates: Partial<Omit<CustomTemplate, "id">>
  ) => {
    const isCustom = customTemplates.some((t) => t.id === id)

    if (isCustom) {
      const next = customTemplates.map((t) => (t.id === id ? { ...t, ...updates } : t))
      await storage.set(TEMPLATES_STORAGE_KEY, next)
      setCustomTemplates(next)
    } else {
      // It's a built-in template: save user modification override
      const nextModified: Record<string, Partial<MultiLangTemplate>> = {
        ...modifiedTemplates,
        [id]: {
          ...(modifiedTemplates[id] || {}),
          ...updates,
          isModified: true
        } as Partial<MultiLangTemplate>
      }
      await storage.set(MODIFIED_TEMPLATES_KEY, nextModified)
      setModifiedTemplates(nextModified)
    }
  }

  // Delete ANY template
  const deleteTemplate = async (id: string) => {
    const isCustom = customTemplates.some((t) => t.id === id)

    if (isCustom) {
      const next = customTemplates.filter((t) => t.id !== id)
      await storage.set(TEMPLATES_STORAGE_KEY, next)
      setCustomTemplates(next)
    } else {
      // For built-ins, add to deleted set
      const next = new Set(deletedIds)
      next.add(id)
      setDeletedIds(next)
      await storage.set(DELETED_TEMPLATES_KEY, Array.from(next))
    }
  }

  // Reset a modified built-in template back to its default canonical code
  const resetTemplate = async (id: string) => {
    const nextModified = { ...modifiedTemplates }
    delete nextModified[id]
    await storage.set(MODIFIED_TEMPLATES_KEY, nextModified)
    setModifiedTemplates(nextModified)

    if (deletedIds.has(id)) {
      const nextDeleted = new Set(deletedIds)
      nextDeleted.delete(id)
      setDeletedIds(nextDeleted)
      await storage.set(DELETED_TEMPLATES_KEY, Array.from(nextDeleted))
    }
  }

  // Restore ALL deleted and modified built-in templates back to default factory state
  const restoreAllDefaults = async () => {
    await Promise.all([
      storage.set(MODIFIED_TEMPLATES_KEY, {}),
      storage.set(DELETED_TEMPLATES_KEY, [])
    ])
    setModifiedTemplates({})
    setDeletedIds(new Set())
  }

  // Merge built-ins + modifications, excluding deleted items
  const activeBuiltins: EditableTemplate[] = ALL_BUILTIN_TEMPLATES.filter(
    (t) => !deletedIds.has(t.id)
  ).map((t) => {
    if (modifiedTemplates[t.id]) {
      const override = modifiedTemplates[t.id]
      return {
        ...t,
        ...override,
        code: {
          ...t.code,
          ...(override.code || {})
        },
        isModified: true
      }
    }
    return t
  })

  // Combined all active templates
  const allTemplates: EditableTemplate[] = [
    ...customTemplates,
    ...activeBuiltins
  ]

  return {
    allTemplates,
    builtinTemplates: ALL_BUILTIN_TEMPLATES,
    customTemplates,
    modifiedCount: Object.keys(modifiedTemplates).length,
    deletedCount: deletedIds.size,
    preferredLang,
    setPreferredLang,
    loading,
    addCustomTemplate,
    updateTemplate,
    deleteTemplate,
    resetTemplate,
    restoreAllDefaults,
    reloadTemplates: loadData
  }
}
