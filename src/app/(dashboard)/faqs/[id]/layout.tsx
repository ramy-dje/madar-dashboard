import ProtectServerPagePermissions from "@/server/protect-server-page";

// The FAQ Page Protected Layout Component
export default async function FAQDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["faq:read"], "/");

  return children;
}
