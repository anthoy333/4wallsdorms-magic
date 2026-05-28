"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send } from "lucide-react"

interface NotificationSignupFormProps {
  className?: string
  showTitle?: boolean
  title?: string
  description?: string
}

export function NotificationSignupForm({ 
  className = "",
  showTitle = true,
  title = "Stay Updated",
  description = "Want to know when we add your university? Sign up for email or text notifications and be the first to know when your campus joins the 4WallsDorms community."
}: NotificationSignupFormProps) {
  return (
    <div className={`bg-background rounded-xl p-8 shadow-sm border-2 border-[hsl(var(--accent))] ${className}`}>
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      )}
      
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 bg-secondary">
          <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Email Updates</TabsTrigger>
          <TabsTrigger value="text" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Text Updates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="space-y-4">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="university" className="text-sm font-medium">
                Your University/School
              </label>
              <Input id="university" placeholder="Boston University" />
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Subscribe for Updates <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="text" className="space-y-4">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="text-name" className="text-sm font-medium">
                  Your Name
                </label>
                <Input id="text-name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input id="phone" type="tel" placeholder="(123) 456-7890" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="text-university" className="text-sm font-medium">
                Your University/School
              </label>
              <Input id="text-university" placeholder="Boston University" />
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Subscribe for Text Updates <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        By signing up, you agree to receive updates from 4WallsDorms. We respect your privacy and will never share
        your information with third parties. Message and data rates may apply for text notifications.
      </p>
    </div>
  )
} 