import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Service Page Protected Layout Component
export default async function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["service:read"], "/");

  return children;
}
