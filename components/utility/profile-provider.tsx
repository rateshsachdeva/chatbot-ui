"use client"

import { ProfileContext } from "@/lib/context/ProfileContext"
import { Tables } from "@/supabase/types"
import { useContext } from "react"

interface ProfileProviderProps {
  profile: Tables<"profiles"> | null
  children: React.ReactNode
}

export const ProfileProvider = ({
  profile,
  children
}: ProfileProviderProps) => {
  return (
    <ProfileContext.Provider
      value={{
        profile
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

// Create a custom hook for easy access to the profile context
export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
