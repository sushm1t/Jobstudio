import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { BusyIndicator } from '@/jobstudio/components/BusyIndicator';

const App = lazy(() => import("@/jobstudio/App"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Job Studio — AI Job Evaluator & ATS Resume Builder" },
      { name: "description", content: "AI-powered job opportunity evaluator, ATS-tailored resume generator, and verified application studio." },
      { property: "og:title", content: "Job Studio" },
      { property: "og:description", content: "AI-powered job opportunity evaluator, ATS-tailored resume generator, and verified application studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      <Suspense fallback={<div className="min-h-screen bg-background p-6 flex items-center justify-center"><BusyIndicator label="Opening Job Studio" /></div>}>
        <App />
      </Suspense>
    </ClientOnly>
  );
}
