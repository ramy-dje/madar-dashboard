import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Tender Update Page Protected Layout Component
export default async function TenderUpdateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["tender:update", "tender:read"], "/");

  return children;
}
