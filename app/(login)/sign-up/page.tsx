import { getUser } from "@/queries/user";
import { redirect } from "next/navigation";
import { Login } from "../login";

export default async function SignUpPage() {
  const user = await getUser();
  if (user) {
    return redirect("/dashboard/" + user.id);
  }

  return <Login mode='signup' />;
}
