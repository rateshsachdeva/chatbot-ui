// components/icons/chatbotui-svg.tsx
"use client"

import Image from "next/image"
import { FC } from "react"

interface ChatbotUISVGProps {
  theme: "dark" | "light"
  /** Keeps backward-compat with calls that pass scale */
  scale?: number
}

export const ChatbotUISVG: FC<ChatbotUISVGProps> = ({ theme, scale = 1 }) => {
  // original inline SVG was 189 × 194; keep the same aspect ratio
  const size = 189 * scale

  return (
    <Image
      src={theme === "dark" ? "/Darkmode.svg" : "/Normal.svg"}
      alt="App logo"
      width={size}
      height={size}
      priority /* avoids blurry placeholder on first paint */
      className="select-none"
    />
  )
}
