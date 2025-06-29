"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChatbotUISVG } from "@/components/icons/chatbotui-svg";
import { cn } from "@/lib/utils";

/* env-driven links */
const url = (e: string) => process.env[e] ?? "#";
const nav = [
  { env: "NEXT_PUBLIC_LEARN_URL",    label: "Learn" },
  { env: "NEXT_PUBLIC_ANALYSIS_URL", label: "Analysis" },
  { env: "NEXT_PUBLIC_NEWS_URL",     label: "M&A News" },
];

export function TopNav({ className = "" }: { className?: string }) {
  /* desktop list */
  const Desktop = () => (
    <ul className="hidden items-center gap-6 text-sm font-medium sm:flex">
      {nav.map(({ env, label }) => (
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
  const Mobile = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-full w-full space-y-8 pt-20 text-center">
        <div className="flex flex-col items-center gap-6">
          {nav.map(({ env, label }) => (
            <Link key={env} href={url(env)} prefetch={false} className="text-lg">
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
        "pl-2 pr-4 py-5",          /* flush-left logo, right-aligned menu */
        className
      )}
    >
      {/* logo only – no text, scales at 0.45 */}
      <Link href="/" prefetch={false}>
        <ChatbotUISVG scale={0.45} />
      </Link>

      <Desktop />
      <Mobile />
    </motion.nav>
  );
}
