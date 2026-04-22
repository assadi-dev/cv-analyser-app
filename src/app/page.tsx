import { redirect } from "next/navigation"

/** Root redirect — send to login or analyser depending on auth state. */
export default function HomePage() {
  redirect("/login")
}
