/* components/layout/top-nav.tsx
   --------------------------------------------------------------- */
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

import { ChatbotUISVG } from "@/components/icons/chatbotui-svg";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/* helper – URLs from env */
const url = (env: string) => process.env[env] ?? "#";

const navLinks = [
  { env: "NEXT_PUBLIC_LEARN_URL",    label: "Learn" },
  { env: "NEXT_PUBLIC_ANALYSIS_URL", label: "Analysis" },
  { env: "NEXT_PUBLIC_NEWS_URL",     label: "M&A News" },
];

export function TopNav({ className = "" }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* ---- desktop nav list ---- */
  const DesktopLinks = () => (
    <ul className="hidden items-center gap-6 text-sm font-medium sm:flex">
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
      <li>
        <Button asChild size="sm" className="font-semibold">
          <Link href={url("NEXT_PUBLIC_PRICING_URL")} prefetch={false}>
            Pricing
          </Link>
        </Button>
      </li>
    </ul>
  );

  /* ---- mobile sheet nav ---- */
  const MobileSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 space-y-6">
        <div className="mt-4 flex flex-col gap-4">
          {navLinks.map(({ env, label }) => (
            <Link
              key={env}
              href={url(env)}
              prefetch={false}
              className="text-base font-medium"
            >
              {label}
            </Link>
          ))}

          <Button asChild>
            <Link href={url("NEXT_PUBLIC_PRICING_URL")} prefetch={false}>
              Pricing
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <motion.nav
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70",
        "border-b border-border/30",
        className
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        {/* Logo + wordmark */}
        <Link href="/" prefetch={false} className="flex items-center gap-2">
          {mounted && (
            <ChatbotUISVG
              theme={resolvedTheme === "dark" ? "dark" : "light"}
              scale={0.45}
            />
          )}
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">
            Veritas
          </span>
        </Link>

        {/* Desktop or Mobile controls */}
        <DesktopLinks />
        <MobileSheet />
      </div>
    </motion.nav>
  );
}
