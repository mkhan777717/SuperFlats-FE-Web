import Image from "next/image";
import type { ReactNode } from "react";
import { Logo } from "@/components/common/logo";
import { cn } from "@/lib/cn";
import hero from "../../../public/images/hero-building.jpg";

/** Split screen from the Lovable design: photo panel with copy on the left, form on the right. */
export function AuthShell({ aside, tint = "brand", children }: { aside: ReactNode; tint?: "brand" | "warm"; children: ReactNode }) {
  return (
    <div className="grid min-h-dvh flex-1 grid-cols-1 lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden lg:block">
        <Image src={hero} alt="" fill priority placeholder="blur" sizes="50vw" className="object-cover" />
        <div
          className={cn(
            "absolute inset-0",
            tint === "brand"
              ? "bg-gradient-to-br from-brand-500/80 via-brand-600/70 to-brand-800/85"
              : "bg-gradient-to-t from-black/85 via-black/45 to-black/10",
          )}
        />
        <div className="relative flex h-full flex-col justify-between p-12 text-white xl:p-16">
          <Logo className="text-white" />
          <div className="max-w-lg pb-6">{aside}</div>
        </div>
      </aside>
      <main className="flex min-w-0 flex-col px-5 py-8 sm:px-10 lg:px-16">
        <Logo className="lg:hidden" />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">{children}</div>
      </main>
    </div>
  );
}

export function AsideTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-5xl font-bold leading-[1.05] xl:text-6xl">{children}</h1>;
}

export function AsideText({ children }: { children: ReactNode }) {
  return <p className="mt-5 text-lg leading-relaxed text-white/85 xl:text-xl">{children}</p>;
}

export function FormHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-8">
      <h2 className="text-4xl font-bold">{title}</h2>
      <p className="mt-2 text-lg text-ink-soft">{subtitle}</p>
    </header>
  );
}

export function FormAlert({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "info" }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-2xl px-4 py-3 text-sm",
        tone === "error" ? "bg-red-50 text-red-700" : "bg-brand-50 text-brand-800",
      )}
    >
      {children}
    </div>
  );
}
