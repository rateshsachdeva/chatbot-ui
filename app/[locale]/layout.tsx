import { Toaster } from "@/components/ui/sonner"
import { GlobalState } from "@/components/utility/global-state"
import { Providers } from "@/components/utility/providers"
import TranslationsProvider from "@/components/utility/translations-provider"
import initTranslations from "@/lib/i18n"
import { Database } from "@/supabase/types"
import { createServerClient } from "@supabase/ssr"
import { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import { ReactNode } from "react"
import { TopNav } from "@/components/layout/top-nav"

// ================== NEW IMPORT ==================
// Import the ProfileProvider we created earlier
import { ProfileProvider } from "@/components/utility/profile-provider"
// ===============================================

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const APP_NAME = "VeriTAS"
const APP_DEFAULT_TITLE = "VeriTAS"
const APP_TITLE_TEMPLATE = "%s - VeriTAS"
const APP_DESCRIPTION = "Chabot UI PWA!"

interface RootLayoutProps {
  children: ReactNode
  params: {
    locale: string
  }
}

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: APP_DEFAULT_TITLE
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  }
}

export const viewport: Viewport = {
  themeColor: "#000000"
}

const i18nNamespaces = ["translation"]

export default async function RootLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )
  const session = (await supabase.auth.getSession()).data.session

  // ================== NEW CODE BLOCK ==================
  // This block fetches the user's profile from your 'profiles' table
  // if they are logged in.
  let profile = null
  if (session) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id) // Using user_id to match your schema
      .single()
    profile = data
  }
  // ======================================================

  const { t, resources } = await initTranslations(locale, i18nNamespaces)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <TopNav />
        {/* ================== WRAP WITH PROFILE PROVIDER ================== */}
        {/* We wrap your existing Providers with our new ProfileProvider,
            passing the fetched profile data to it. */}
        <ProfileProvider profile={profile}>
          <Providers attribute="class" defaultTheme="dark">
            <TranslationsProvider
              namespaces={i18nNamespaces}
              locale={locale}
              resources={resources}
            >
              <Toaster richColors position="top-center" duration={3000} />
              <div className="bg-background text-foreground flex h-dvh flex-col items-center overflow-x-auto">
                {session ? <GlobalState>{children}</GlobalState> : children}
              </div>
            </TranslationsProvider>
          </Providers>
        </ProfileProvider>
        {/* ================================================================ */}
      </body>
    </html>
  )
}
