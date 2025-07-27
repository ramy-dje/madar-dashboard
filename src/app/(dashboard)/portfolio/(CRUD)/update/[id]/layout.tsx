import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Portfolio Update Page Protected Layout Component
export default async function PortfolioUpdateLayout({
                                                        children,
                                                    }: {
    children: React.ReactNode;
}) {
    // protect this page
    await ProtectServerPagePermissions(["portfolio:update", "portfolio:read"], "/");

    return children;
}
