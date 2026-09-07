"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function AdminGuestFilters({
  query,
  status,
}: {
  query: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(query);
  const [isPending, startTransition] = useTransition();

  function push(nextQuery: string, nextStatus: string) {
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextStatus !== "all") params.set("status", nextStatus);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/admin/guests?${qs}` : "/admin/guests");
    });
  }

  return (
    <div className="mt-8 space-y-4" data-testid="admin-guest-filters">
      <label className="block">
        <span className="sr-only">Buscar familia</span>
        <input
          type="search"
          value={value}
          placeholder="Buscar familia"
          enterKeyHint="search"
          data-testid="admin-guest-search"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              push(value, status);
            }
          }}
          className="w-full border border-taupe/50 bg-warm-white px-4 py-3.5 font-sans text-[1rem] text-ink placeholder:text-ink-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-taupe"
        />
      </label>
      <div
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="toolbar"
        aria-label="Filtros de estado"
      >
        {(
          [
            ["all", "Todos"],
            ["pending", "Pendientes"],
            ["confirmed", "Confirmados"],
            ["declined", "No asistirán"],
            ["inactive", "Inactivos"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            data-testid={`admin-filter-${key}`}
            aria-pressed={status === key}
            disabled={isPending}
            onClick={() => push(value, key)}
            className={`min-h-11 shrink-0 px-4 py-2.5 font-sans text-[0.7rem] font-medium uppercase tracking-[0.16em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-taupe ${
              status === key
                ? "border border-ink bg-ink text-warm-white"
                : "border border-taupe/50 text-ink-muted hover:border-taupe hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
