import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Portfolio Tags Page Protected Layout Component
export default async function PortfolioTagsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["tag:read"], "/");

  return children;
}
