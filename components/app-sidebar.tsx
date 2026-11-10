"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { NavClouds } from "@/components/nav-clouds"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SquaresFourIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, GearIcon, QuestionIcon, MagnifyingGlassIcon, DatabaseIcon, ChartLineIcon, FileIcon, CommandIcon, LayoutIcon, ChatCircleIcon, ClipboardTextIcon, NotePencilIcon, PaletteIcon, CurrencyDollarIcon, InvoiceIcon } from "@phosphor-icons/react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: (
        <SquaresFourIcon
        />
      ),
    },

    {
      title: "Page Builder",
      url: "/admin/pages",
      icon: (
        <LayoutIcon
        />
      ),
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: (
        <UsersIcon
        />
      ),
    },
    {
      title: "Form Builder",
      url: "/admin/form-builder",
      icon: (
        <NotePencilIcon
        />
      ),
    },
    {
      title: "Form Submissions",
      url: "/admin/forms",
      icon: (
        <ClipboardTextIcon
        />
      ),
    },
    {
      title: "Collections",
      url: "/admin/collections",
      icon: (
        <DatabaseIcon
        />
      ),
    },
    {
      title: "Blog",
      url: "/admin/blog",
      icon: (
        <FileTextIcon
        />
      ),
    },
    {
      title: "Chat",
      url: "/admin/chat",
      icon: (
        <ChatCircleIcon
        />
      ),
    },
    {
      title: "Organization",
      url: "/admin/organization",
      icon: (
        <GearIcon
        />
      ),
    },

  ],
  navClouds: [
    {
      title: "Documents",
      icon: (
        <FileTextIcon
        />
      ),
      isActive: true,
      url: "#",
      items: [
        {
          title: "Services",
          url: "/admin/services",
        },
        {
          title: "Clients",
          url: "/admin/clients",
        },
        {
          title: "Quotations",
          url: "/admin/quotations",
        },
        {
          title: "Invoices",
          url: "/admin/invoices",
        },
      ],
    },

  ],

}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5! cursor-pointer"
              render={<a href="#" />}
            >
              <CommandIcon className="size-5! text-secondary" />
              <span className="text-base font-black text-primary dark:text-white">Ubuntu Admin</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex flex-col flex-1 overflow-y-auto">
        
           <NavClouds items={data.navClouds} />
        <NavMain items={data.navMain} />
     
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
