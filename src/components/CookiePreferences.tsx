"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ds-cookie-preferences";

type Prefs = { analytics: boolean };

export function CookiePreferences() {
  const [prefs, setPrefs] = useState<Prefs>({ analytics: true });
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs(JSON.parse(raw));
    } catch {
      // ignore malformed/unavailable storage
    }
    setLoaded(true);
  }, []);

  function save() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <div className="flex items-start justify-between gap-4 border-b border-line/70 pb-5">
        <div>
          <div className="text-sm font-medium text-parchment">Essential cookies</div>
          <p className="mt-1 text-xs text-parchment-dim">
            Required to keep you signed in and the site working. These can&rsquo;t be turned off.
          </p>
        </div>
        <div className="mt-1 h-6 w-11 flex-shrink-0 rounded-full bg-brass/40">
          <div className="mt-1 ml-1 h-4 w-4 rounded-full bg-brass" />
        </div>
      </div>

      <div className="flex items-start justify-between gap-4 pt-5">
        <div>
          <div className="text-sm font-medium text-parchment">Analytics cookies</div>
          <p className="mt-1 text-xs text-parchment-dim">
            Helps us understand product usage so we can improve the app. Optional.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={prefs.analytics}
          onClick={() => setPrefs((p) => ({ analytics: !p.analytics }))}
          className={`mt-1 h-6 w-11 flex-shrink-0 rounded-full transition ${
            prefs.analytics ? "bg-brass" : "bg-line"
          }`}
        >
          <div
            className={`h-4 w-4 rounded-full bg-ink transition ${
              prefs.analytics ? "ml-6" : "ml-1"
            }`}
          />
        </button>
      </div>

      <button
        type="button"
        onClick={save}
        className="mt-6 rounded-full bg-brass px-5 py-2 text-sm font-medium text-ink transition hover:bg-[#dab668]"
      >
        Save preferences
      </button>
      {saved && <span className="ml-3 text-xs text-verdigris">Saved.</span>}
      {!loaded && <span className="sr-only">Loading saved preferences…</span>}
    </div>
  );
}
