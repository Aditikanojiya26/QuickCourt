import React from "react";
import { Home, Calendar, CreditCard, BarChart2, Users } from "lucide-react";
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
import { useAuth } from "../context/AuthContext";

const items = [
  { title: "Home", icon: Home, href: "/facility-owner/dashboard" },
  { title: "Add Venue", icon: Users, href: "/facility-owner/bookings" },
  { title: "Active Courts", icon: BarChart2, href: "/facility-owner/courts" },
  { title: "Earnings", icon: CreditCard, href: "/facility-owner/earnings" },
  { title: "Booking Calendar", icon: Calendar, href: "/facility-owner/calendar" },
];
export function FacilityOwnerSidebar() {
  const { user, isLoading, isError } = useAuth();
  console.log("👤 user:", user); // Should log user object directly
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{user.fullName}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ title, icon: Icon, href }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={href}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md ${
                          isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-200"
                        }`
                      }
                    >
                      <Icon className="w-7 h-7" />
                      <span className="text-lg font-medium">{title}</span>
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
