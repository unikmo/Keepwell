import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cancelDispatchRequest } from "../actions";

export default async function DispatchStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: request } = await supabase
    .from("dispatch_requests")
    .select("*")
    .eq("id", id)
    .eq("member_id", user!.id)
    .maybeSingle();

  if (!request) notFound();

  const firstName = request.tech_name.split(" ")[0];

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="mt-4 h-20 w-16 bg-brass"
        style={{
          maskImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 130'%3E%3Ccircle cx='50' cy='38' r='34'/%3E%3Cpolygon points='30,60 70,60 58,110 42,110'/%3E%3C/svg%3E\")",
          WebkitMaskImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 130'%3E%3Ccircle cx='50' cy='38' r='34'/%3E%3Cpolygon points='30,60 70,60 58,110 42,110'/%3E%3C/svg%3E\")",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
        }}
      />
      <div className="mt-3 font-mono text-xs uppercase tracking-wide text-verdigris">
        Help is on the way
      </div>
      <h1 className="mt-2 font-display text-2xl font-medium text-parchment">
        {firstName} is coming to you
      </h1>
      <p className="mt-1 text-sm text-parchment-dim">This uses 1 of your covered events.</p>

      <div className="mt-6 flex w-full max-w-sm items-center justify-between rounded-xl bg-surface-raised px-5 py-4">
        <div>
          <div className="font-mono text-xl text-brass">{request.eta_minutes} min</div>
          <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wide text-parchment-dim">
            Estimated arrival
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-verdigris/35 bg-verdigris/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-verdigris">
          <span className="h-1.5 w-1.5 rounded-full bg-verdigris" />
          Verified ID
        </span>
      </div>

      <div className="mt-4 flex w-full max-w-sm items-center gap-3 rounded-xl border border-line bg-surface p-4 text-left">
        <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-br from-brass to-brass-dim" />
        <div>
          <div className="text-sm font-semibold text-parchment">{request.tech_name}</div>
          <div className="mt-0.5 text-xs text-parchment-dim">412 jobs · Background checked</div>
          <div className="mt-0.5 text-xs text-brass">★★★★★ 4.9</div>
        </div>
      </div>

      <p className="mt-4 max-w-sm text-xs leading-relaxed text-parchment-dim">
        This visit costs you <strong className="font-mono text-parchment">$0</strong>. Any
        suggested upgrades will always show a fixed price before {firstName} touches anything.
      </p>

      <form action={cancelDispatchRequest} className="mt-6">
        <input type="hidden" name="id" value={request.id} />
        <button type="submit" className="text-sm text-parchment-dim underline underline-offset-4">
          Cancel request
        </button>
      </form>
    </div>
  );
}
