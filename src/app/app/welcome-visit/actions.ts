"use server";

import { redirect } from "next/navigation";

// Legacy route retained only so old links cannot consume or fabricate an
// obsolete free welcome visit. Household+ now uses the 3-year Lock & Access
// Audit workflow after the 14-day waiting period.
export async function scheduleWelcomeVisit() {
  redirect("/app/audit");
}
