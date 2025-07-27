import { getServerAuth } from "@/server/auth";
import AccessPermissionsProvider from "@/providers/access-permissions.provider";
import { cachedGetServerPermissions } from "@/utils/permissions-utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardHeader from "@/components/header";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// the dashboard layout

interface Props {
  children: React.ReactNode;
}

// The Dashboard layout
export default async function DashboardLayout({ children }: Props) {
  // check the auth of this user
  const user = await getServerAuth();

  // if the user doesn't exist
  if (!user) {
    // redirect to the login page
    return redirect("/login");
  }

  // check the user permissions
  const access_info = await cachedGetServerPermissions();

  if (!access_info) {
    // redirect to the login page
    return redirect("/login");
  }

  // check if the user's account is active
  if (!access_info.active) {
    // if the user's account isn't active
    return redirect("/https://hotelralf.com");
  }

  // check if the user has the required permission to access the dashboard
  const have_access = access_info.permissions.includes("panel:access");

  // if the user hasn't the required permission to access the dashboard redirect him to the website
  if (!have_access) {
    return redirect("/https://hotelralf.com");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AccessPermissionsProvider access_info={access_info}>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="w-full flex grow flex-col p-8 xl:px-6 xl:py-4 2xl:px-8 2x:py-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </AccessPermissionsProvider>
    </SidebarProvider>
  );
}
