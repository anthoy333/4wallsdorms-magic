"use client"

import { Check, X } from "lucide-react"

interface ProsAndConsSectionProps {
  dormName: string
  pros: string[]
  cons: string[]
  className?: string
}

export function ProsAndConsSection({ 
  dormName, 
  pros, 
  cons, 
  className = "" 
}: ProsAndConsSectionProps) {
  return (
    <section className={`py-10 px-4 sm:px-6 lg:px-8 bg-secondary/5 ${className}`}>
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Pros and Cons</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            An honest assessment of what students love about {dormName} and what they wish was different.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pros Column */}
          <div className="bg-background p-6 rounded-xl border border-green-200">
            <h3 className="text-xl font-bold mb-4 text-green-600 flex items-center">
              <Check className="mr-2 h-5 w-5" /> Pros
            </h3>
            <ul className="space-y-3">
              {pros.map((pro, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons Column */}
          <div className="bg-background p-6 rounded-xl border border-red-200">
            <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center">
              <X className="mr-2 h-5 w-5" /> Cons
            </h3>
            <ul className="space-y-3">
              {cons.map((con, index) => (
                <li key={index} className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
} 