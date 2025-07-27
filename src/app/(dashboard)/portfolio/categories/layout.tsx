import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Portfolio Categories Page Protected Layout Component
export default async function PortfolioCategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["category:read"], "/");

  return children;
}
