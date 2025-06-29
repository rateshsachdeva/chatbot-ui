// components/icons/chatbotui-svg.tsx
"use client";

import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface ChatbotUISVGProps {
  /** Optional: let callers force dark / light; otherwise auto-detect */
  theme?: "dark" | "light";
  /** Scale factor relative to the original 189 × 194 SVG */
  scale?: number;
}

export const ChatbotUISVG: FC<ChatbotUISVGProps> = ({
  theme,
  scale = 1,
}) => {
  /* pick current site theme if caller doesn’t override */
  const { resolvedTheme } = useTheme();
  const activeTheme = theme ?? (resolvedTheme === "dark" ? "dark" : "light");

  /* prevent hydration mismatch by rendering only on the client */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  /* maintain original aspect ratio */
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
