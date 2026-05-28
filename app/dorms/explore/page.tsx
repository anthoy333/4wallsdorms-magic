"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { GraduationCap, Building2, School } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { BackButton } from "@/app/components/BackButton"

export default function ExploreDormsPage() {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-6">
            <BackButton href="/dorms" text="Dorm Library" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Explore Campus Dorms</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover dorm rooms and residence halls across universities, colleges, and boarding schools.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Universities Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Card
            className={`border shadow-lg rounded-xl ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-blue-50"}`}
          >
            <CardHeader
              className={`border-b rounded-t-xl ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-blue-100"}`}
            >
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-primary mr-3" />
                <CardTitle className={`text-3xl md:text-4xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                  Universities
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Maine Universities */}
              <div className="mb-8">
                <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`}>Maine</h3>
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant="ghost"
                      className={`w-auto text-xl h-auto py-4 px-4 ${
                        isDarkMode
                          ? "text-white hover:bg-slate-700 hover:text-blue-400"
                          : "text-black hover:bg-blue-100 hover:text-blue-600"
                      }`}
                      asChild
                    >
                      <Link href="/coming-soon">Husson University</Link>
                    </Button>
                  </li>
                </ul>
              </div>

              {/* Massachusetts Universities */}
              <div>
                <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`}>
                  Massachusetts
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant="ghost"
                      className={`w-auto text-xl h-auto py-4 px-4 ${
                        isDarkMode
                          ? "text-white hover:bg-slate-700 hover:text-blue-400"
                          : "text-black hover:bg-blue-100 hover:text-blue-600"
                      }`}
                      asChild
                    >
                      <Link href="/dorms/suffolk-university">Suffolk University</Link>
                    </Button>
                  </li>
                </ul>
              </div>
              <div className={`mt-8 pt-6 border-t ${isDarkMode ? "border-slate-600" : "border-blue-200"}`}>
                <Button
                  className={`w-auto text-2xl py-4 px-8 bg-gradient-to-r from-blue-400 to-blue-600 text-black font-semibold rounded-full hover:from-blue-500 hover:to-blue-700 hover:text-white transition-all duration-300 ${
                    isDarkMode ? "shadow-lg" : "shadow-md"
                  }`}
                  asChild
                >
                  <Link href="/upload-dorm">Help Students By Sending Your Dorm Room</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Colleges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card
            className={`border shadow-lg rounded-xl ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-blue-50"}`}
          >
            <CardHeader
              className={`border-b rounded-t-xl ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-blue-100"}`}
            >
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-primary mr-3" />
                <CardTitle className={`text-3xl md:text-4xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                  Colleges
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Massachusetts Colleges */}
              <div>
                <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`}>
                  Massachusetts
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant="ghost"
                      className={`w-auto text-xl h-auto py-4 px-4 ${
                        isDarkMode
                          ? "text-white hover:bg-slate-700 hover:text-blue-400"
                          : "text-black hover:bg-blue-100 hover:text-blue-600"
                      }`}
                      asChild
                    >
                      <Link href="/coming-soon">Dean College</Link>
                    </Button>
                  </li>
                </ul>
              </div>
              <div className={`mt-8 pt-6 border-t ${isDarkMode ? "border-slate-600" : "border-blue-200"}`}>
                <Button
                  className={`w-auto text-2xl py-4 px-8 bg-gradient-to-r from-blue-400 to-blue-600 text-black font-semibold rounded-full hover:from-blue-500 hover:to-blue-700 hover:text-white transition-all duration-300 ${
                    isDarkMode ? "shadow-lg" : "shadow-md"
                  }`}
                  asChild
                >
                  <Link href="/upload-dorm">Help Students By Sending Your Dorm Room</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Boarding Schools Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card
            className={`border shadow-lg rounded-xl ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-blue-50"}`}
          >
            <CardHeader
              className={`border-b rounded-t-xl ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-blue-100"}`}
            >
              <div className="flex items-center">
                <School className="h-8 w-8 text-primary mr-3" />
                <CardTitle className={`text-3xl md:text-4xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                  Boarding Schools
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Connecticut Boarding Schools */}
              <div>
                <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`}>
                  Connecticut
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant="ghost"
                      className={`w-auto text-xl h-auto py-4 px-4 ${
                        isDarkMode
                          ? "text-white hover:bg-slate-700 hover:text-blue-400"
                          : "text-black hover:bg-blue-100 hover:text-blue-600"
                      }`}
                      asChild
                    >
                      <Link href="/coming-soon">Gunery School</Link>
                    </Button>
                  </li>
                </ul>
              </div>
              <div className={`mt-8 pt-6 border-t ${isDarkMode ? "border-slate-600" : "border-blue-200"}`}>
                <Button
                  className={`w-auto text-2xl py-4 px-8 bg-gradient-to-r from-blue-400 to-blue-600 text-black font-semibold rounded-full hover:from-blue-500 hover:to-blue-700 hover:text-white transition-all duration-300 ${
                    isDarkMode ? "shadow-lg" : "shadow-md"
                  }`}
                  asChild
                >
                  <Link href="/upload-dorm">Help Students By Sending Your Dorm Room</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
