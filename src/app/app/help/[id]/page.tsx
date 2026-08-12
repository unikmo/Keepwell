import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cancelDispatchRequest } from "../actions";

export default async function DispatchStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: request }, { data: match }] = await Promise.all([
    supabase.from("dispatch_requests").select("*").eq("id", id).eq("member_id", user!.id).maybeSingle(),
    supabase.from("public_provider_matches").select("business_name,eta_minutes,accepted_at").eq("request_type", "member_dispatch").eq("request_id", id).maybeSingle(),
  ]);
  if (!request) notFound();

  const matched = Boolean(match?.business_name);
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mt-4 grid h-16 w-16 place-items-center rounded-2xl border border-brass/30 bg-brass/10 font-display text-2xl text-brass">K</div>
      <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-verdigris">{matched ? "Provider matched" : "Request submitted"}</div>
      <h1 className="mt-2 font-display text-3xl font-medium text-parchment">{matched ? `${match!.business_name} accepted the request` : "Keepwell is waiting for a real provider match"}</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-parchment-dim">{matched ? "The provider name and ETA below come from an accepted marketplace offer." : "Provider identity and ETA remain hidden until an independent provider actually accepts."}</p>

      <div className="mt-7 w-full max-w-md rounded-2xl border border-line bg-surface p-5 text-left">
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-dim">Request</div>
        <div className="mt-2 text-sm font-medium text-parchment">{request.issue}</div>
        <div className="mt-5 border-t border-line/70 pt-4">
          <div className="flex justify-between gap-4 text-sm"><span className="text-parchment-dim">Provider</span><span className="text-right text-parchment">{matched ? match!.business_name : "Not matched yet"}</span></div>
          <div className="mt-2 flex justify-between gap-4 text-sm"><span className="text-parchment-dim">ETA</span><span className="text-right text-parchment">{matched && match?.eta_minutes ? `${match.eta_minutes} min` : "Shown after acceptance"}</span></div>
        </div>
      </div>

      <p className="mt-5 max-w-md text-xs leading-5 text-parchment-dim">Keepwell operates the platform. Field service is performed by the independent provider who accepts the request.</p>
      {!matched && <form action={cancelDispatchRequest} className="mt-6"><input type="hidden" name="id" value={request.id} /><button type="submit" className="text-sm text-parchment-dim underline underline-offset-4">Cancel request</button></form>}
    </div>
  );
}
