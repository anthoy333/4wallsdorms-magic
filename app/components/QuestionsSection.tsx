"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

/**
 * Flexible QuestionsSection Component
 * 
 * A reusable component for displaying contact/help sections across different universities and dorms.
 * 
 * @example
 * // Basic usage (default styling and text)
 * <QuestionsSection
 *   dormName="Miller Hall"
 *   dormHref="/dorms/miller-hall"
 *   contactEmail="4wallsdorms@gmail.com"
 *   universityName="Suffolk University"
 * />
 * 
 * @example
 * // Customized for different university
 * <QuestionsSection
 *   dormName="Smith Hall"
 *   dormHref="/dorms/smith-hall"
 *   contactEmail="housing@bostonu.edu"
 *   universityName="Boston University"
 *   title="Need Help with Smith Hall?"
 *   description="Our housing team can answer all your questions about Smith Hall and other BU residence options."
 *   primaryButtonText="View Smith Hall Details"
 *   secondaryButtonText="Contact Housing Office"
 * />
 * 
 * @example
 * // Minimal version (only one button)
 * <QuestionsSection
 *   dormName="10 West"
 *   dormHref="/dorms/10-west"
 *   contactEmail="reslife@suffolk.edu"
 *   universityName="Suffolk University"
 *   showAskQuestionsButton={false}
 *   primaryButtonText="Explore 10 West"
 * />
 */
interface QuestionsSectionProps {
  // Required props
  dormName: string
  dormHref: string
  contactEmail: string
  universityName: string
  
  // Optional customization props
  title?: string
  description?: string
  primaryButtonText?: string
  secondaryButtonText?: string
  className?: string
  showDormPageButton?: boolean
  showAskQuestionsButton?: boolean
  customPrimaryButtonHref?: string
  customSecondaryButtonHref?: string
}

export function QuestionsSection({ 
  dormName, 
  dormHref, 
  contactEmail, 
  universityName,
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  className = "",
  showDormPageButton = true,
  showAskQuestionsButton = true,
  customPrimaryButtonHref,
  customSecondaryButtonHref
}: QuestionsSectionProps) {
  
  // Default values with dynamic content
  const defaultTitle = `Have Questions About ${dormName}?`
  const defaultDescription = `Our team is here to help you with any questions about living in ${dormName} or other residence options at ${universityName}.`
  const defaultPrimaryButtonText = `${dormName} Dorm Page`
  const defaultSecondaryButtonText = "Ask Questions"
  
  // Use custom values or defaults
  const displayTitle = title || defaultTitle
  const displayDescription = description || defaultDescription
  const displayPrimaryButtonText = primaryButtonText || defaultPrimaryButtonText
  const displaySecondaryButtonText = secondaryButtonText || defaultSecondaryButtonText
  
  // Button hrefs
  const primaryButtonHref = customPrimaryButtonHref || dormHref
  const secondaryButtonHref = customSecondaryButtonHref || `mailto:${contactEmail}`

  return (
    <section className={`py-10 px-4 sm:px-6 lg:px-8 bg-primary/5 ${className}`}>
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-2xl font-bold mb-4">{displayTitle}</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          {displayDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {showDormPageButton && (
            <Button size="lg" asChild>
              <Link href={primaryButtonHref}>{displayPrimaryButtonText}</Link>
            </Button>
          )}
          {showAskQuestionsButton && (
            <Button size="lg" variant="outline" asChild>
              <Link href={secondaryButtonHref}>{displaySecondaryButtonText}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
} 