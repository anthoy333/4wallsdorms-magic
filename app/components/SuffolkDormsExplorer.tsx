"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"

/**
 * Suffolk residence halls — same tabbed layout as the homepage “Explore 5 Boston Dorms” block,
 * with a responsive tab row (2 columns on small screens, 5 across on larger breakpoints).
 */
export function SuffolkDormsExplorer() {
  return (
    <Tabs defaultValue="miller" className="w-full">
      <TabsList className="mb-8 flex h-auto w-full flex-nowrap gap-1 overflow-x-auto p-1 sm:grid sm:grid-cols-5 sm:gap-2 sm:overflow-visible">
        <TabsTrigger value="miller" className="shrink-0 px-2 text-xs whitespace-nowrap sm:px-3">
          Miller Hall
        </TabsTrigger>
        <TabsTrigger value="10west" className="shrink-0 px-2 text-xs whitespace-nowrap sm:px-3">
          10 West
        </TabsTrigger>
        <TabsTrigger value="smith" className="shrink-0 px-2 text-xs whitespace-nowrap sm:px-3">
          Smith Hall
        </TabsTrigger>
        <TabsTrigger value="1court" className="shrink-0 px-2 text-xs whitespace-nowrap sm:px-3">
          1 Court Street
        </TabsTrigger>
        <TabsTrigger value="theatre" className="shrink-0 px-2 text-xs whitespace-nowrap sm:px-3">
          Modern Theatre
        </TabsTrigger>
      </TabsList>
      <TabsContent value="miller" className="space-y-4">
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:items-center md:gap-8">
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src="/miller-hall-suffolk.png"
              alt="Miller Hall"
              width={600}
              height={300}
              className="h-[300px] w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold md:text-2xl">Miller Hall</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              Miller primarily houses first or second-year students in Jack and Jill accommodations with private
              bathrooms.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>2-4 students per Jack and Jill rooms</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>Right next to every academic building</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>Common spaces on every other floor</span>
              </li>
            </ul>
            <Button className="mt-2" asChild>
              <Link href="/dorms/miller-hall">View Dorm Rooms</Link>
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="10west" className="space-y-4">
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:items-center md:gap-8">
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src="/10-west-residence-hall-suffolk-university.png"
              alt="10 West Residence Hall"
              width={600}
              height={300}
              className="h-[300px] w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold md:text-2xl">10 West Residence Hall</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              10 West primarily houses second-year students in apartment-style and Jack and Jill accommodations, all
              with private bathrooms.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>4-8 students per suite or apartment</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>4 Elevators</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>Study lounges and common spaces on multiple floors.</span>
              </li>
            </ul>
            <Button className="mt-2" asChild>
              <Link href="/dorms/10-west">View Dorm Rooms</Link>
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="smith" className="space-y-4">
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:items-center md:gap-8">
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src="/placeholder.svg?key=lu3n7"
              alt="Smith Hall"
              width={600}
              height={300}
              className="h-[300px] w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold md:text-2xl">Smith Hall</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              Smith provides traditional corridor-style living for first-year students with shared common spaces and
              amenities.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>Every type of layout but apartment</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>Communal bathrooms on each floor</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>Community kitchen and lounge areas</span>
              </li>
            </ul>
            <Button className="mt-2" asChild>
              <Link href="/dorms/smith-hall">View Dorm Rooms</Link>
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="1court" className="space-y-4">
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:items-center md:gap-8">
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src="/1-court-street-residence-suffolk-university.png"
              alt="1 Court Street"
              width={600}
              height={300}
              className="h-[300px] w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold md:text-2xl">1 Court Street</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              1 Court Street is a renovated hotel and provides traditional corridor-style living for first-year students.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>Every type of layout but apartments</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>Modern furnishings and fixtures</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>Right next to the green and orange lines</span>
              </li>
            </ul>
            <Button className="mt-2" asChild>
              <Link href="/dorms/1-court-street">View Dorm Rooms</Link>
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="theatre" className="space-y-4">
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:items-center md:gap-8">
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src="/suffolk-theatre-residence.png"
              alt="Modern Theatre Residence"
              width={600}
              height={300}
              className="h-[300px] w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold md:text-2xl">Modern Theatre</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              Modern Theatre residence hall houses second-year students in Jack and Jill/Adjoining rooms accommodations,
              all with private bathrooms.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>2-4 students per Adjoining rooms</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>In the heart of the theater district</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>A walk away from the Smith cafeteria</span>
              </li>
            </ul>
            <Button className="mt-2" asChild>
              <Link href="/dorms/modern-theatre">View Dorm Rooms</Link>
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
