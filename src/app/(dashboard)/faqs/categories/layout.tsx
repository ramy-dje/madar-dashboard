import ProtectServerPagePermissions from "@/server/protect-server-page";

// The FAQ Categories Page Protected Layout Component
export default async function FAQCategoriesLayout({
                                                      children,
                                                  }: {
    children: React.ReactNode;
}) {
    // protect this page
    await ProtectServerPagePermissions(["category:read"], "/");

    return children;
}
