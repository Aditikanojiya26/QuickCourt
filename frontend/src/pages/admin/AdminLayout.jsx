import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AdminLayout() {
  return (
    <SidebarProvider style={{
      "--sidebar-width": "16rem", // increase from default (like 16rem)
    }}>
      <AppSidebar />
      <main className="flex flex-col flex-1">
        <SidebarTrigger />
        <div className="p-6 flex-1">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
