import { redirect } from "next/navigation";
import { Login } from "../login";
import { getUser } from "@/queries/user";

export default async function SignInPage() {
  const user = await getUser();

  // Check if the user is already logged in
  // redirect to its admin dashboard.
  if (user) {
    return redirect("/");
  }

  // else render the sign-in page.
  return <Login  mode="signin"/>;
}
