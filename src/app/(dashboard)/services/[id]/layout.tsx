import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Service Page Protected Layout Component
export default async function ServiceDetailsLayout({
                                                       children,
                                                   }: {
    children: React.ReactNode;
}) {
    // protect this page
    await ProtectServerPagePermissions(["service:read"], "/");

    return children;
}
