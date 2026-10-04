"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Horizontal, swipeable row of cards with arrow buttons on desktop. */
export function ListingRail({ children, label }: { children: ReactNode; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.85, behavior: "smooth" });

  return (
    <div className="relative">
      <ul
        ref={track}
        aria-label={label}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pt-1 pb-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {children}
      </ul>
      <div className="pointer-events-none absolute inset-y-0 -right-2 -left-2 hidden items-center justify-between lg:flex">
        <Button variant="outline" size="icon" className="pointer-events-auto rounded-full shadow-lift" onClick={() => scroll(-1)} aria-label="Scroll left">
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon" className="pointer-events-auto rounded-full shadow-lift" onClick={() => scroll(1)} aria-label="Scroll right">
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
