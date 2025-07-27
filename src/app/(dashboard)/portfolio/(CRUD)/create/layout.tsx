import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Portfolios Create Page Protected Layout Component
export default async function PortfoliosCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(
    ["portfolio:read", "portfolio:create"],
    "/"
  );

  return children;
}
