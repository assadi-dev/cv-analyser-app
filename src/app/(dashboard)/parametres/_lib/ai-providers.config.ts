import type { AIProvider } from "@/types"

export interface AIProviderConfig {
  id: AIProvider
  label: string
  models: string[]
  color: string
  local?: boolean
  /** Only Ollama's base URL is actually honored server-side — every other provider ignores it. */
  defaultBaseUrl?: string
}

export const AI_PROVIDERS: AIProviderConfig[] = [
  { id: "openai", label: "OpenAI", models: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"], color: "#10B981" },
  { id: "anthropic", label: "Anthropic", models: ["claude-fable-5-1", "claude-opus-5", "claude-3.5-sonnet", "claude-3-haiku"], color: "#CC785C" },
  { id: "groq", label: "Groq", models: ["llama-3.1-70b-versatile", "mixtral-8x7b-32768"], color: "#F97316" },
  { id: "mistral", label: "Mistral", models: ["ministral-8-b-latest", "ministral-14b-latest", "mistral-small-latest", "mistral-large-latest"], color: "#FF7000" },
  {
    id: "openrouter", label: "OpenRouter", color: "#6366F1",
    // Cheap, tool-calling-capable models — excludes OpenAI/Anthropic/Amazon and Google's
    // proprietary Gemini, but keeps Gemma (open-weight) as a deliberate exception.
    models: [
      "meta-llama/llama-3.1-8b-instruct",
      "meta-llama/llama-3.3-70b-instruct",
      "meta-llama/llama-4-scout",
      "meta-llama/llama-4-maverick",
      "mistralai/mistral-nemo",
      "mistralai/mistral-small-2603",
      "mistralai/mistral-small-3.2-24b-instruct",
      "mistralai/mistral-medium-3.1",
      "mistralai/mistral-large-2512",
      "mistralai/codestral-2508",
      "qwen/qwen3-30b-a3b-instruct-2507",
      "qwen/qwen-2.5-72b-instruct",
      "qwen/qwen3-32b",
      "qwen/qwen3-coder",
      "deepseek/deepseek-chat",
      "deepseek/deepseek-v3.2",
      "deepseek/deepseek-r1-0528",
      "x-ai/grok-4.3",
      "z-ai/glm-4.5-air",
      "z-ai/glm-4.6",
      "moonshotai/kimi-k2",
      "moonshotai/kimi-k3",
      "google/gemma-4-31b-it",
      "nvidia/nemotron-3-nano-30b-a3b",
      "cohere/command-r-08-2024",
    ],
  },
  { id: "ollama", label: "Ollama", models: ["llama3.2:latest", "llama3.2:1b", "mistral:7b", "mistral-small3.2:latest", "mistral-large-3:675b-cloud", "gemma4:latest", "gemma4:e4b", "gemma4:cloud", "deepseek-r1:latest", "glm-5.3:cloud", "kimi-k3:cloud", "codellama:latest"], color: "#1E293B", local: true, defaultBaseUrl: "http://localhost:11434" },
]

export function getAIProvider(id: AIProvider): AIProviderConfig {
  return AI_PROVIDERS.find((p) => p.id === id) ?? AI_PROVIDERS[0]
}
