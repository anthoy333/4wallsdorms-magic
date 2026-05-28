"use client"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { SuffolkDormsExplorer } from "./SuffolkDormsExplorer"

const OTHER_BOSTON_UNIVERSITIES = [
  "Simmons University",
  "Emerson College",
  "Northeastern University",
  "Fisher College",
  "Tufts University",
  "Lesley University",
  "Harvard University",
  "Boston University",
  "Massachusetts College of Art and Design",
  "Emmanuel College",
] as const

export function BostonUniversitiesSection() {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      <Collapsible defaultOpen className="group rounded-xl border bg-card shadow-sm">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-t-xl px-4 py-4 text-left transition-colors",
              "bg-primary/10 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <span className="text-lg font-semibold sm:text-xl">Suffolk University</span>
            <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </button>
        </CollapsibleTrigger>
        <div className="space-y-3 border-t bg-card px-4 py-3 text-sm text-muted-foreground">
          <p>
            I started at my school. To add your campus, just{" "}
            <Link href="/upload-dorm" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
              send us a photo
            </Link>
            .
          </p>
        </div>
        <CollapsibleContent>
          <div className="border-t px-4 py-6 sm:px-6">
            <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">Explore 5 Boston Dorms</h2>
            <p className="mb-8 text-center text-muted-foreground">
              We&apos;ve mapped 5 residence halls / dorms for you to explore.
            </p>
            <SuffolkDormsExplorer />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div
        className="rounded-2xl border-2 border-dashed border-muted-foreground/40 bg-muted/40 px-6 py-10 text-center sm:px-10 sm:py-12"
        aria-label="Suffolk University coming soon"
      >
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground sm:text-base">
          Coming soon
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg md:text-xl">
          Want to see more dorms, room walkthroughs, and more? We need your help. Send in photos and videos, and let
          more people know.
        </p>
      </div>

      {OTHER_BOSTON_UNIVERSITIES.map((name) => (
        <Button
          key={name}
          variant="outline"
          className="h-auto min-h-12 w-full justify-center whitespace-normal px-4 py-3 text-center text-base font-medium"
          asChild
        >
          <Link href={`/upload-dorm?school=${encodeURIComponent(name)}`}>{name}</Link>
        </Button>
      ))}
    </div>
  )
}
