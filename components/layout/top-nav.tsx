/* components/layout/top-nav.tsx
   --------------------------------------------------------------- */
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChatbotUISVG } from "@/components/icons/chatbotui-svg";
import { cn } from "@/lib/utils";

/* ---------- helper ---------- */
const url = (env: string) => process.env[env] ?? "#";

const navLinks = [
  { env: "NEXT_PUBLIC_LEARN_URL",    label: "Learn" },
  { env: "NEXT_PUBLIC_ANALYSIS_URL", label: "Analysis" },
  { env: "NEXT_PUBLIC_NEWS_URL",     label: "M&A News" },
];

/* ---------- component ---------- */
export function TopNav({ className = "" }: { className?: string }) {
  /* theme + mounted guard */
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* desktop inline list */
  const DesktopLinks = () => (
    <ul className="hidden items-center gap-6 text-sm font-medium sm:flex">
      {navLinks.map(({ env, label }) => (
        <li key={env}>
          <Link href={url(env)} prefetch={false} className="hover:opacity-70">
            {label}
          </Link>
        </li>
      ))}
      <li>
        <Button asChild size="sm">
          <Link href={url("NEXT_PUBLIC_PRICING_URL")} prefetch={false}>
            Pricing
          </Link>
        </Button>
      </li>
    </ul>
  );

  /* mobile sheet */
  const MobileSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      {/* full-width slide-down */}
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
              className="text-lg"
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
        "sticky top-0 z-30 flex items-center justify-between backdrop-blur",
        "supports-[backdrop-filter]:bg-background/70 border-b border-border/30",
        "pl-2 pr-4 py-5",
        className
      )}
    >
      {/* flush-left logo, no word-mark */}
      <Link href="/" prefetch={false}>
        {mounted && (
          <ChatbotUISVG
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            scale={0.45}
          />
        )}
      </Link>

      <DesktopLinks />
      <MobileSheet />
    </motion.nav>
  );
}
