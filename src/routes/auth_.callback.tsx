import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth_/callback")({
  head: () => ({
    meta: [{ title: "Authenticating — Job Studio" }],
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      <CallbackContent />
    </ClientOnly>
  );
}

function CallbackContent() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processSession() {
      try {
        const { data, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;

        if (data?.session?.user) {
          const user = data.session.user;
          const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "User";
          localStorage.setItem("jobstudio_logged_in", "true");
          localStorage.setItem("jobstudio_user_name", name);
          if (user.email) {
            localStorage.setItem("jobstudio_user_email", user.email.toLowerCase().trim());
          }
          window.location.replace("/?tab=evaluator");
          return;
        }

        const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            const user = session.user;
            const name =
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email?.split("@")[0] ||
              "User";
            localStorage.setItem("jobstudio_logged_in", "true");
            localStorage.setItem("jobstudio_user_name", name);
            if (user.email) {
              localStorage.setItem("jobstudio_user_email", user.email.toLowerCase().trim());
            }
            window.location.replace("/?tab=evaluator");
          }
        });

        const timer = setTimeout(() => {
          window.location.replace("/");
        }, 4000);

        return () => {
          sub.subscription.unsubscribe();
          clearTimeout(timer);
        };
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err?.message || "Failed to complete sign in.");
        setTimeout(() => window.location.replace("/"), 2500);
      }
    }

    processSession();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-4">
        {error ? (
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-sm">
            {error}
            <div className="mt-2 text-xs text-muted-foreground">Redirecting to home...</div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-foreground">Completing sign-in to Job Studio...</p>
            <p className="text-xs text-muted-foreground">Preparing your career workspace</p>
          </div>
        )}
      </div>
    </div>
  );
}
