import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Posts Page Protected Layout Component
export default async function PostDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["post:read"], "/");

  return children;
}
