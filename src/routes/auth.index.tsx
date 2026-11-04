import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const App = lazy(() => import("@/jobstudio/App"));

export const Route = createFileRoute("/auth/")({
  head: () => ({
    meta: [
      { title: "Sign In & Create Account — Job Studio" },
      { name: "description", content: "Sign in to access your Master Profile, tailored resumes, and live ATS applications." },
    ],
  }),
  component: AuthRoute,
});

function AuthRoute() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <App initialTab="auth" />
      </Suspense>
    </ClientOnly>
  );
}
