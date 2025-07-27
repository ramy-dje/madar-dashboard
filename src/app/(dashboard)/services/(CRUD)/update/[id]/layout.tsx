import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Service Update Page Protected Layout Component
export default async function ServiceUpdateLayout({
                                                      children,
                                                  }: {
    children: React.ReactNode;
}) {
    // protect this page
    await ProtectServerPagePermissions(["service:update", "service:read"], "/");

    return children;
}
