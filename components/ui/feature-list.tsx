"use client"

interface FeatureListProps {
  features: string[]
  className?: string
  bulletColor?: string
}

export function FeatureList({ 
  features, 
  className = "",
  bulletColor = "bg-primary"
}: FeatureListProps) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <span className={`h-2 w-2 rounded-full ${bulletColor} mr-2`}></span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  )
} 