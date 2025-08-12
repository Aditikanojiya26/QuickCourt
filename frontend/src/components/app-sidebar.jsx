import React from "react";
import { Home, Inbox, Calendar, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";

const items = [
  { title: "Home", icon: Home, href: "/" },
  { title: "Venue Approval", icon: Inbox, href: "/admin/venues/pending" },
  { title: "Approved and Rejected Venues", icon: Calendar, href: "/admin/venues/approve-rejected" },
  { title: "Search", icon: Search, href: "/search" },
  { title: "Settings", icon: Settings, href: "/settings" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ title, icon: Icon, href }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild>
                   <NavLink to={href} className="flex items-center gap-2">
                       <Icon className="w-8 h-8" />
                      <span >{title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
