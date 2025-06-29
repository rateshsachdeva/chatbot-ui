"use client"

import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
import { IconArrowRight } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { ThemeSwitcher } from "@/components/utility/theme-switcher"

export default function HomePage() {
  const { theme } = useTheme()

  return (
 <div className="relative flex size-full flex-col items-center justify-center">
  {/* floating light / dark toggle */}
  <div className="fixed bottom-4 left-4 z-20">
    <ThemeSwitcher />
  </div>
    <div>
        <ChatbotUISVG theme={theme === "dark" ? "dark" : "light"} scale={1} />
      </div>

      <div className="mt-2 text-4xl font-bold">Veritas Due Diligence</div>

      <Link
        className="mt-4 flex w-[200px] items-center justify-center rounded-md bg-blue-500 p-2 font-semibold"
        href="/login"
      >
        Start Chatting
        <IconArrowRight className="ml-1" size={20} />
      </Link>
    </div>
  )
}
