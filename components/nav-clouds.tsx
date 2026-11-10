"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function NavClouds({
  items,
}: {
  items: {
    title: string
    icon: React.ReactNode
    isActive?: boolean
    url: string
    items: {
      title: string
      url: string
    }[]
  }[]
}) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    Documents: true // Default to open
  })

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-bold text-md" >
        
        Documents
        
        </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isOpen = openItems[item.title] ?? item.isActive
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => setOpenItems((prev) => ({ ...prev, [item.title]: !isOpen }))}
                className="flex items-center gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              >
                {item.icon}
                <span>{item.title}</span>
                <ChevronRight 
                  className={`ml-auto size-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} 
                />
              </SidebarMenuButton>
              {isOpen && item.items && (
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <Link href={subItem.url} className="block">
                        <SidebarMenuSubButton className="cursor-pointer w-full">
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
