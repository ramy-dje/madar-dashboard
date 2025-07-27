import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Posts Create Page Protected Layout Component
export default async function PostsCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["post:read", "post:create"], "/");

  return children;
}
