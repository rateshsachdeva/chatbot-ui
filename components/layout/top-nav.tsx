/* components/layout/top-nav.tsx
    --------------------------------------------------------------- */
"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetClose, // Import SheetClose for better UX
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// ================== UNIFIED NAVIGATION LINKS ==================
// We combine all links into one array for simplicity.
const NAV_LINKS = [
  { href: process.env.NEXT_PUBLIC_LEARN_URL ?? "#", label: "Learn" },
  { href: process.env.NEXT_PUBLIC_ANALYSIS_URL ?? "#", label: "Analysis" },
  { href: process.env.NEXT_PUBLIC_NEWS_URL ?? "#", label: "M&A News" },
  { href: process.env.NEXT_PUBLIC_PRICING_URL ?? "#", label: "Pricing", isButton: true },
];
// =============================================================

/* ---------- component ---------- */
export function TopNav() {
  // All previous logic for visibility, hover, and mobile detection has been removed.

  return (
    // The Sheet component is now the root of our navigation.
    <Sheet>
      {/* The SheetTrigger is a floating button, positioned fixed on the screen.
          You can change its position by editing the classes: "top-5 right-5".
          For example, "bottom-5 right-5" would place it at the bottom right.
      */}
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="fixed top-5 right-5 z-50 h-12 w-12 rounded-full shadow-lg"
        >
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>

      {/* The SheetContent is the menu that slides out.
          'side="right"' makes it slide from the right side of the screen.
      */}
      <SheetContent side="right" className="w-full max-w-xs space-y-8 bg-background p-8">
        <h2 className="text-2xl font-bold">Menu</h2>
        <div className="flex flex-col items-start gap-6">
          {NAV_LINKS.map(({ href, label, isButton }) =>
            isButton ? (
              // The "Pricing" link is styled as a button.
              <SheetClose asChild key={label}>
                <Button asChild className="w-full">
                  <Link href={href} prefetch={false}>
                    {label}
                  </Link>
                </Button>
              </SheetClose>
            ) : (
              // Regular text links
              <SheetClose asChild key={label}>
                <Link
                  href={href}
                  prefetch={false}
                  className="text-lg text-muted-foreground hover:text-foreground"
                >
                  {label}
                </Link>
              </SheetClose>
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
