/* components/layout/top-nav.tsx
   --------------------------------------------------------------- */
"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* --- helper: URLs come from env --- */
const url = (env: string) => process.env[env] ?? "#"

const navLinks = [
  { env: "NEXT_PUBLIC_LEARN_URL", label: "Learn" },
  { env: "NEXT_PUBLIC_ANALYSIS_URL", label: "Analysis" },
  { env: "NEXT_PUBLIC_NEWS_URL", label: "M&A News" }
]

export function TopNav({ className = "" }: { className?: string }) {
  const { resolvedTheme } = useTheme() // swap light/dark logo

  return (
    <motion.nav
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "supports-[backdrop-filter]:bg-background/70 sticky top-0 z-30 backdrop-blur",
        "border-border/30 border-b",
        className
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-2 px-4 py-4">
        {/* ------------ Brand: Logo + Wordmark ------------ */}
        <Link href="/" prefetch={false} className="flex items-center gap-2">
          <ChatbotUISVG
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            scale={0.35} /* ~48 px wide */
          />
          {/* hide word-mark on very small screens */}
          <span className="hidden text-base font-semibold tracking-tight sm:inline">
            Veritas
          </span>
        </Link>

        {/* ------------ Nav Links ------------ */}
        <ul className="flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ env, label }) => (
            <li key={env}>
              <Link
                href={url(env)}
                prefetch={false}
                className="transition-opacity hover:opacity-70"
              >
                {label}
              </Link>
            </li>
          ))}

          {/* Pricing – uses brand primary colour */}
          <li>
            <Button asChild size="sm" className="font-semibold">
              <Link href={url("NEXT_PUBLIC_PRICING_URL")} prefetch={false}>
                Pricing
              </Link>
            </Button>
          </li>
        </ul>
      </div>
    </motion.nav>
  )
}
