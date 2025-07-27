import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Tender Create Page Protected Layout Component
export default async function TenderCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["tender:read", "tender:create"], "/");

  return children;
}
