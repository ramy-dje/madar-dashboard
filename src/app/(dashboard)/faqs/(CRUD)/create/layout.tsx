import ProtectServerPagePermissions from "@/server/protect-server-page";

// The FAQ Create Page Protected Layout Component
export default async function FAQCreateLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    // protect this page
    await ProtectServerPagePermissions(
        ["faq:create", "faq:read"],
        "/"
    );

    return children;
}
