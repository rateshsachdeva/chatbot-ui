"use client"

import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
import { IconArrowRight } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { ThemeSwitcher } from "@/components/utility/theme-switcher"

export default function HomePage() {
  const { theme } = useTheme()

  return (
 <div className="relative flex size-full flex-col items-center justify-center">
  {/* floating light / dark toggle */}
  <div className="fixed bottom-4 left-4 z-20">
    <ThemeSwitcher />
  </div>
    <div>
        <ChatbotUISVG theme={theme === "dark" ? "dark" : "light"} scale={1} />
      </div>

      <div className="mt-2 text-4xl font-bold">Veritas Due Diligence</div>

        <Button asChild className="mt-4 w-[200px]">
           <Link href="/login" prefetch={false}>
             Start&nbsp;Chatting&nbsp;
             <IconArrowRight className="ml-1" size={20} />
           </Link>
        </Button>
        
        
      </Link>
    </div>
  )
}
