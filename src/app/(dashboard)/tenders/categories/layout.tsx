import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Tenders Categories Page Protected Layout Component
export default async function TendersCategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["category:read"], "/");

  return children;
}
