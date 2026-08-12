import { redirect } from "next/navigation";

export default function LegacyWelcomeVisitPage() {
  redirect("/app/audit");
}
