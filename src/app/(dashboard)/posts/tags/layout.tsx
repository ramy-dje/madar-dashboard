import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Posts Tags Page Protected Layout Component
export default async function PostsTagsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["tag:read"], "/");

  return children;
}
