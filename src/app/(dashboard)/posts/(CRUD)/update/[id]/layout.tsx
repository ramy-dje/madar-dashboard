import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Posts Update Page Protected Layout Component
export default async function PostsUpdateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["post:read", "post:update"], "/");

  return children;
}
