"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function TenantError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="mx-auto max-w-xl pt-10">
      <EmptyState
        icon={TriangleAlert}
        title="Something went wrong"
        action={
          <Button onClick={() => retry()} icon={<RefreshCw className="size-4" aria-hidden />}>
            Try again
          </Button>
        }
      >
        {process.env.NODE_ENV === "development" ? error.message : "We couldn't load this page. Please try again in a moment."}
      </EmptyState>
    </div>
  );
}
