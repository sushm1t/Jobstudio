import { createFileRoute } from "@tanstack/react-router";

const handle = async ({ request }: { request: Request }) => {
  const { handleApi } = await import("@/server/jobstudio-api");
  return handleApi(request);
};

export const Route = createFileRoute("/api/$")({
  server: { handlers: { GET: handle, POST: handle } },
});
