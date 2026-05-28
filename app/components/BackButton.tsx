import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BackButtonProps {
  href: string
  text: string
}

export function BackButton({ href, text }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      className="text-muted-foreground hover:text-foreground p-0 h-auto font-normal text-base"
      asChild
    >
      <Link href={href} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to {text}
      </Link>
    </Button>
  )
}
