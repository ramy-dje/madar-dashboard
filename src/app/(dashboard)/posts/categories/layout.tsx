import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Posts Categories Page Protected Layout Component
export default async function PostsCategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["category:read"], "/");

  return children;
}
