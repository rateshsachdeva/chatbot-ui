import { Tables } from "@/supabase/types"

import { ContentType, DataListType } from "@/types"

import { FC, useState } from "react"

import { SidebarCreateButtons } from "./sidebar-create-buttons"

import { SidebarDataList } from "./sidebar-data-list"

import { SidebarSearch } from "./sidebar-search"



// ================== NEW IMPORT ==================

// Import our custom hook to get the user's profile and role

import { useProfile } from "../utility/profile-provider"

// ===============================================



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



  // ================== NEW ROLE CHECK ==================

  // Get the user's profile and determine if they are an admin

  const { profile } = useProfile()

  const isAdmin = profile?.role === "admin"

  // ====================================================



  const filteredData: any = data.filter(item =>

    item.name.toLowerCase().includes(searchTerm.toLowerCase())

  )



  return (

    // Subtract 50px for the height of the workspace settings

    <div className="flex max-h-[calc(100%-50px)] grow flex-col">

      {/* ================== CONDITIONAL RENDERING ================== */}

      {/* The entire "Create Buttons" div is now only rendered if the user is an admin. */}

      {isAdmin && (

        <div className="mt-2 flex items-center">

          <SidebarCreateButtons

            contentType={contentType}

            hasData={data.length > 0}

          />

        </div>

      )}

      {/* ========================================================= */}



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
