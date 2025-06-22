"use client"

import Link from "next/link"
import { useProfile } from "@/components/utility/profile-provider" // Import our custom hook

export const AdminDashboardLink = () => {
  // Use the hook to get profile data
  const { profile } = useProfile()

  // Check if the user is an admin
  const isAdmin = profile?.role === "admin"

  // If the user is not an admin, render nothing
  if (!isAdmin) {
    return null
  }

  // If the user IS an admin, render the link
  return (
    <Link
      href="/admin/dashboard" // You can create this page later
      className="flex w-full items-center justify-center rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      Admin Panel
    </Link>
  )
}
