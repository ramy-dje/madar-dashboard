import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Portfolio Page Protected Layout Component
export default async function PortfolioDetailsLayout({
                                                         children,
                                                     }: {
    children: React.ReactNode;
}) {
    // protect this page
    await ProtectServerPagePermissions(["portfolio:read"], "/");

    return children;
}
