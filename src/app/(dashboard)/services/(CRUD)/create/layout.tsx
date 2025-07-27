import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Service Create Page Protected Layout Component
export default async function ServiceCreateLayout({
                                                      children,
                                                  }: {
    children: React.ReactNode;
}) {
    // protect this page
    await ProtectServerPagePermissions(
        ["service:read", "service:create"],
        "/"
    );

    return children;
}
