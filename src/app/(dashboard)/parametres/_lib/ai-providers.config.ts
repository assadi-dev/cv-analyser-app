import type { AIProvider } from "@/types"

export interface AIProviderConfig {
  id: AIProvider
  label: string
  models: string[]
  color: string
  local?: boolean
}

export const AI_PROVIDERS: AIProviderConfig[] = [
  { id: "openai", label: "OpenAI", models: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"], color: "#10B981" },
  { id: "anthropic", label: "Anthropic", models: ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"], color: "#CC785C" },
  { id: "groq", label: "Groq", models: ["llama-3.1-70b-versatile", "mixtral-8x7b-32768"], color: "#F97316" },
  { id: "mistral", label: "Mistral", models: ["mistral-large-latest", "mistral-small-latest"], color: "#FF7000" },
  { id: "openrouter", label: "OpenRouter", models: ["openai/gpt-4o", "anthropic/claude-3.5-sonnet"], color: "#6366F1" },
  { id: "ollama", label: "Ollama", models: ["llama3.2", "mistral", "codellama"], color: "#1E293B", local: true },
]
