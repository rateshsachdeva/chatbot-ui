/* components/layout/top-nav.tsx
    --------------------------------------------------------------- */
"use client";

import Link from "next/link";
// ================== NEW IMPORT ==================
// Import usePathname to get the current URL path
import { usePathname } from "next/navigation";
// ================================================
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChatbotUISVG } from "@/components/icons/chatbotui-svg";
import { cn } from "@/lib/utils";

/* ---------- helper ---------- */
const href = (env: string) => process.env[env] ?? "#";

const NAV = [
  { env: "NEXT_PUBLIC_LEARN_URL",   label: "Learn" },
  { env: "NEXT_PUBLIC_ANALYSIS_URL", label: "Analysis" },
  { env: "NEXT_PUBLIC_NEWS_URL",     label: "M&A News" },
];

/* ---------- component ---------- */
export function TopNav({ className = "" }: { className?: string }) {
  /* theme + mounted guard to avoid hydration mismatch */
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ================== NEW VISIBILITY LOGIC ==================
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  // This effect updates the nav's default visibility when the page changes.
  useEffect(() => {
    // We check if the current path ends with '/chat' to identify the chat page.
    const isChatPage = pathname.endsWith("/chat");

    // Hide the nav by default on the chat page, show it on all other pages.
    setIsVisible(!isChatPage);
  }, [pathname]);

  // These handlers will show/hide the nav on hover, but only on the chat page.
  const handleMouseEnter = () => {
    if (pathname.endsWith("/chat")) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (pathname.endsWith("/chat")) {
      setIsVisible(false);
    }
  };
  // ==========================================================

  /* desktop list */
  const Desktop = () => (
    <ul className="hidden items-center gap-6 text-sm font-medium sm:flex">
      {NAV.map(({ env, label }) => (
        <li key={env}>
          <Link href={href(env)} prefetch={false} className="hover:opacity-70">
            {label}
          </Link>
        </li>
      ))}
      <li>
        <Button asChild size="sm">
          <Link href={href("NEXT_PUBLIC_PRICING_URL")} prefetch={false}>
            Pricing
          </Link>
        </Button>
      </li>
    </ul>
  );

  /* mobile sheet */
  const Mobile = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-full w-full space-y-8 pt-20 text-center sm:hidden">
        <div className="flex flex-col items-center gap-6">
          {NAV.map(({ env, label }) => (
            <Link key={env} href={href(env)} prefetch={false} className="text-lg">
              {label}
            </Link>
          ))}
          <Button asChild className="w-40">
            <Link href={href("NEXT_PUBLIC_PRICING_URL")} prefetch={false}>
              Pricing
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <motion.nav
      // ================== UPDATED PROPS ==================
      initial={{ opacity: 0, y: -6 }}
      // Animate based on the isVisible state. Hide by sliding up, show by sliding down.
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: "-100%" }}
      transition={{ duration: 0.4 }}
      // Add the hover event handlers here
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // =====================================================
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between backdrop-blur",
        "supports-[backdrop-filter]:bg-background/70 border-b border-border/30",
        "pl-2 pr-4 py-5",
        className,
      )}
    >
      {/* logo flush-left, no word-mark */}
      <Link href="/" prefetch={false}>
        {mounted && (
          <ChatbotUISVG
            /* force remount when theme changes so img updates */
            key={resolvedTheme}
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            scale={0.45}
          />
        )}
      </Link>

      <Desktop />
      <Mobile />
    </motion.nav>
  );
}
