import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FacilityOwnerSidebar } from "@/components/FacilityOwnerSidebar";

export default function FacilityOwnerLayout() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "18rem", // slightly wider sidebar for facility owner
      }}
    >
      <div className="flex min-h-screen">
        <FacilityOwnerSidebar />
        <main className="flex flex-col flex-1">
          <SidebarTrigger />
          <div className="p-6 flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
