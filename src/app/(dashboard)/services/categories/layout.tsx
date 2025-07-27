import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Services Categories Page Protected Layout Component
export default async function ServicesCategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["category:read"], "/");

  return children;
}
