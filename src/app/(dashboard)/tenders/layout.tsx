import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Tender Page Protected Layout Component
export default async function TendersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["tender:read"], "/");

  return children;
}
