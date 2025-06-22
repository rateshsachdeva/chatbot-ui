"use client"

import { createContext } from "react"
import { Tables } from "@/supabase/types"

// Define the type for our context's value
interface ProfileContextType {
  profile: Tables<"profiles"> | null
}

// Create the context with a default value of null
export const ProfileContext = createContext<ProfileContextType>({
  profile: null
})
