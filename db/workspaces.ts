import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const getHomeWorkspaceByUserId = async (userId: string) => {
  const { data: homeWorkspace, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", userId)
    .eq("is_home", true)
    .single()

  if (!homeWorkspace) {
    throw new Error(error.message)
  }

  return homeWorkspace.id
}

export const getWorkspaceById = async (workspaceId: string) => {
  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .single()

  if (!workspace) {
    throw new Error(error.message)
  }

  return workspace
}

export const getWorkspacesByUserId = async (userId: string) => {
  const { data: workspaces, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (!workspaces) {
    throw new Error(error.message)
  }

  return workspaces
}

export const createWorkspace = async (
  workspace: TablesInsert<"workspaces">
) => {
  const { data: createdWorkspace, error } = await supabase
    .from("workspaces")
    .insert([workspace])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdWorkspace
}

export const updateWorkspace = async (
  workspaceId: string,
  workspace: TablesUpdate<"workspaces">
) => {
  const { data: updatedWorkspace, error } = await supabase
    .from("workspaces")
    .update(workspace)
    .eq("id", workspaceId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedWorkspace
}

export const deleteWorkspace = async (workspaceId: string) => {
  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

// ================== NEW FUNCTION ==================
// This function fetches all workspaces created by any user with the 'admin' role.
export const getWorkspacesByAdmin = async () => {
  // First, find all admin user IDs from the profiles table
  const { data: adminProfiles, error: profileError } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("role", "admin")

  if (profileError) {
    console.error("Error fetching admin profiles:", profileError.message)
    return [] // Return an empty array on error
  }

  if (!adminProfiles || adminProfiles.length === 0) {
    console.log("No admin users found.")
    return [] // Return an empty array if no admins exist
  }

  const adminUserIds = adminProfiles.map(p => p.user_id)

  // Then, fetch all workspaces where the user_id is one of the admin IDs
  const { data: workspaces, error: workspaceError } = await supabase
    .from("workspaces")
    .select("*")
    .in("user_id", adminUserIds)
    .order("created_at", { ascending: false })

  if (workspaceError) {
    console.error("Error fetching workspaces by admin:", workspaceError.message)
    return [] // Return an empty array on error
  }

  return workspaces || []
}
// =================================================
