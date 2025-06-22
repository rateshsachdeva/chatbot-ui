"use client"

import { ChatHelp } from "@/components/chat/chat-help"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSettings } from "@/components/chat/chat-settings"
import { ChatUI } from "@/components/chat/chat-ui"
// ================== REMOVED IMPORT ==================
// QuickSettings is no longer used, so we remove its import.
// import { QuickSettings } from "@/components/chat/quick-settings"
// ====================================================
import { Brand } from "@/components/ui/brand"
import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useTheme } from "next-themes"
import { useContext } from "react"

// ================== NEW IMPORT ==================
// Import our custom hook to get the user's profile and role
import { useProfile } from "@/components/utility/profile-provider"
// ===============================================

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { chatMessages } = useContext(ChatbotUIContext)

  // ================== NEW ROLE CHECK ==================
  const { profile } = useProfile()
  const isAdmin = profile?.role === "admin"
  // ====================================================

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  const { theme } = useTheme()

  return (
    <>
      {chatMessages.length === 0 ? (
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="top-50% left-50% -translate-x-50% -translate-y-50% absolute mb-20">
            <Brand theme={theme === "dark" ? "dark" : "light"} />
          </div>

          {/* ================== COMPONENT REMOVED ================== */}
          {/* The div containing QuickSettings has been deleted. */}
          {/* ======================================================= */}

          {/* ================== CONDITIONAL RENDERING ================== */}
          {/* This ChatSettings component will now only appear if the user is an admin. */}
          {isAdmin && (
            <div className="absolute right-2 top-2">
              <ChatSettings />
            </div>
          )}
          {/* ========================================================= */}

          <div className="flex grow flex-col items-center justify-center" />

          <div className="w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
            <ChatInput />
          </div>

          <div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
            <ChatHelp />
          </div>
        </div>
      ) : (
        <ChatUI />
      )}
    </>
  )
}
