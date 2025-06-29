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

/* URLs pulled from env so you can change them without code */
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

  /* ---------- Desktop inline links ---------- */
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

  /* ---------- Mobile full-width sheet ---------- */
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

      {/* side='top' + w-full h-full ⇒ covers whole viewport */}
      <SheetContent
        side="top"
        className="h-full w-full space-y-8 pt-20 text-center sm:hidden"
      >
        <div className="flex flex-col items-center gap-6">
          {navLinks.map(({ env, label }) => (
            <Link
              key={env}
              href={url(env)}
              prefetch={false}
              className="text-lg font-medium"
            >
              {label}
            </Link>
          ))}

          <Button asChild className="w-40">
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
        {/* Logo + word-mark */}
        <Link href="/" prefetch={false} className="flex items-center gap-2">
          {mounted && (
            <ChatbotUISVG
              theme={resolvedTheme === "dark" ? "dark" : "light"}
              scale={0.45}          /* bigger logo */
            />
          )}
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">
            Veritas
          </span>
        </Link>

        {/* Nav controls */}
        <DesktopLinks />
        <MobileSheet />
      </div>
    </motion.nav>
  );
}
