import { Tables } from "@/supabase/types"
import { ContentType, DataListType } from "@/types"
import { FC, useState } from "react"
import { SidebarCreateButtons } from "./sidebar-create-buttons"
import { SidebarDataList } from "./sidebar-data-list"
import { SidebarSearch } from "./sidebar-search"
import { useProfile } from "../utility/profile-provider"

interface SidebarContentProps {
  contentType: ContentType
  data: DataListType
  folders: Tables<"folders">[]
}

export const SidebarContent: FC<SidebarContentProps> = ({
  contentType,
  data,
  folders
}) => {
  const [searchTerm, setSearchTerm] = useState("")

  const { profile } = useProfile()
  const isAdmin = profile?.role === "admin"

  const filteredData: any = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    // Subtract 50px for the height of the workspace settings
    <div className="flex max-h-[calc(100%-50px)] grow flex-col">
      {/* ================== CORRECTED CONDITIONAL RENDERING ================== */}
      {/* The create button is now visible if the user is an admin OR
          if the content type is 'chats' or 'files'. */}
      {(isAdmin || contentType === "chats" || contentType === "files") && (
        <div className="mt-2 flex items-center">
          <SidebarCreateButtons
            contentType={contentType}
            hasData={data.length > 0}
          />
        </div>
      )}
      {/* =================================================================== */}

      <div className="mt-2">
        <SidebarSearch
          contentType={contentType}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <SidebarDataList
        contentType={contentType}
        data={filteredData}
        folders={folders}
      />
    </div>
  )
}
