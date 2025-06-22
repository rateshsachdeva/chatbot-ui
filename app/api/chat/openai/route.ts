import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export const runtime: ServerRuntime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    // ================== NEW ROLE-BASED LOGIC ==================

    let apiKey = ""
    const organizationId =
      profile.openai_organization_id || process.env.OPENAI_ORGANIZATION_ID

    // Check the user's role to determine which API key to use
    if (profile.role === "admin") {
      // Admins use their personal key from their profile
      checkApiKey(profile.openai_api_key, "OpenAI")
      apiKey = profile.openai_api_key!
    } else {
      // Regular users use the system-wide key
      checkApiKey(process.env.SYSTEM_OPENAI_API_KEY, "System OpenAI")
      apiKey = process.env.SYSTEM_OPENAI_API_KEY!
    }

    // ==========================================================

    const openai = new OpenAI({
      apiKey: apiKey, // Use the determined API key
      organization: organizationId
    })

    const response = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      temperature: chatSettings.temperature,
      max_tokens:
        chatSettings.model === "gpt-4-vision-preview" ||
        chatSettings.model === "gpt-4o"
          ? 4096
          : null, // TODO: Fix
      stream: true
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenAI API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "OpenAI API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
