// components/icons/chatbotui-svg.tsx
"use client";

import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface ChatbotUISVGProps {
  /** Optional override; otherwise auto-detects the current site theme */
  theme?: "dark" | "light";
  /** Scale factor relative to the original 189 × 194 SVG */
  scale?: number;
}

const ChatbotUISVG: FC<ChatbotUISVGProps> = ({ theme, scale = 1 }) => {
  /* Detect runtime theme when prop not provided */
  const { resolvedTheme } = useTheme();
  const activeTheme = theme ?? (resolvedTheme === "dark" ? "dark" : "light");

  /* Avoid hydration mismatch on first paint */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  /* Maintain original aspect ratio (189 × 194) */
  const width  = 189 * scale;
  const height = 194 * scale;

  return (
    <Image
      src={activeTheme === "dark" ? "/Darkmode.svg" : "/Normal.svg"}
      alt="App logo"
      width={width}
      height={height}
      priority
      className="select-none"
    />
  );
};

export { ChatbotUISVG };   // ← named export required by all importers
