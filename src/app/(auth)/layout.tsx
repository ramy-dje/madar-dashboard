import { getServerAuth } from "@/server/auth";
import { redirect } from "next/navigation";

// The auth layout
interface Props {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: Props) {
  // check the auth of this user
  const user = await getServerAuth();

  // if the user does exist
  if (user) {
    // redirect to the home page
    return redirect("/");
  }

  return children;
}
