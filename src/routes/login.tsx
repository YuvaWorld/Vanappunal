import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SplitHeading } from "@/components/motion/split-heading";
import { pageTitle } from "@/data/site";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: pageTitle("Desk") }] }),
});

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center px-5">
        <div className="h-10 w-48 animate-pulse rounded-md bg-bg-subtle" />
      </main>
    );
  }
  if (user) return <Navigate to="/" />;

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: email.split("@")[0] || "Walker",
          callbackURL: "/admin",
        });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/admin",
        });
        if (err) throw new Error(err.message);
      }
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't work.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="px-5 pb-24 pt-28 md:px-10 md:pt-36">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Field desk</p>
          <SplitHeading
            as="h1"
            text="Sign in to add a place."
            className="font-display mt-4 max-w-xl text-4xl leading-[1.05] md:text-6xl"
          />
          <p data-reveal="load" className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Sign in, then add a place name plus photos and video.
          </p>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          {authEnabled ? (
            <div className="space-y-3">
              {GROK_PROVIDERS.map((p) => (
                <button
                  key={p.providerId}
                  type="button"
                  onClick={() => signIn(p.providerId, { callbackURL: "/admin" })}
                  className="w-full rounded-sm border border-border bg-bg-elevated px-4 py-3 text-sm uppercase tracking-[0.16em] text-fg transition-colors hover:border-line"
                >
                  Continue with {p.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}

          <div className="my-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[10px] uppercase tracking-[0.18em] text-faint">or email</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onEmail} className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.16em] text-muted">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-md border border-border bg-bg-elevated px-4 py-3 text-fg"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.16em] text-muted">Password</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete={mode === "up" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md border border-border bg-bg-elevated px-4 py-3 text-fg"
              />
            </label>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "One moment…" : mode === "up" ? "Create the desk" : "Open the desk"}
            </Button>
          </form>
          <button
            type="button"
            className="mt-4 text-xs uppercase tracking-[0.16em] text-muted hover:text-fg"
            onClick={() => setMode((m) => (m === "in" ? "up" : "in"))}
          >
            {mode === "in" ? "Need an account? Create one." : "Already have a desk? Sign in."}
          </button>
        </div>
      </div>
    </main>
  );
}
