"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Building2, GraduationCap, School } from "lucide-react"
import { useTheme } from "next-themes"

// Campus data structure
const campusData = {
  suffolk: {
    name: "Suffolk University",
    color: "#13284C",
    icon: GraduationCap,
    state: "MA",
    dorms: [
      { name: "10 West", slug: "10-west" },
      { name: "Smith Hall", slug: "smith-hall" },
      { name: "Miller Hall", slug: "miller-hall" },
      { name: "1 Court Street", slug: "1-court-street" },
      { name: "Modern Theatre", slug: "modern-theatre" }
    ]
  },
  dean: {
    name: "Dean College",
    color: "#862633",
    icon: School,
    state: "MA",
    dorms: [
      { name: "Dorm A", slug: "dorm-a" },
      { name: "Dorm B", slug: "dorm-b" },
      { name: "Dorm C", slug: "dorm-c" }
    ]
  },
  husson: {
    name: "Husson University",
    color: "#044D43",
    icon: Building2,
    state: "ME",
    dorms: [
      { name: "Dorm A", slug: "dorm-a" },
    ]
  }
}

type CampusKey = keyof typeof campusData
type ViewType = 'campus' | 'dorms' | 'dorm'

export default function FilingCabinetNav() {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"
  const router = useRouter()
  
  const [openCampus, setOpenCampus] = useState<CampusKey | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>('campus')
  const [selectedDorm, setSelectedDorm] = useState<string | null>(null)

  const handleCampusClick = (campusKey: CampusKey) => {
    if (openCampus === campusKey) {
      setOpenCampus(null)
      setCurrentView('campus')
      setSelectedDorm(null)
    } else {
      setOpenCampus(campusKey)
      setCurrentView('dorms')
      setSelectedDorm(null)
    }
  }

  const handleDormsClick = () => {
    setCurrentView('dorms')
    setSelectedDorm(null)
  }

  const handleDormClick = (dormSlug: string) => {
    // Navigate to the dorm page
    router.push(`/dorms/${dormSlug}`)
  }

  const renderContent = () => {
    if (!openCampus) {
      return (
        <div className="flex items-center justify-center h-full p-4 lg:p-8">
          <div className="text-center">
            <h2 className="text-xl lg:text-2xl font-bold mb-4">Select a Campus</h2>
            <p className="text-sm lg:text-base text-muted-foreground">Choose a campus from the filing cabinet to explore dorms</p>
          </div>
        </div>
      )
    }

    const campus = campusData[openCampus]
    const IconComponent = campus.icon

    switch (currentView) {
      case 'dorms':
        return (
          <div className="p-4 lg:p-8">
            <div className="flex items-center mb-6">
              <IconComponent className="h-8 w-8 mr-3" style={{ color: campus.color }} />
              <h2 className="text-2xl lg:text-3xl font-bold">{campus.name} Dorms</h2>
            </div>
            <p className="text-base lg:text-lg text-muted-foreground mb-8">
              Explore residence halls and dormitory options at {campus.name} in {campus.state}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {campus.dorms.map((dorm) => (
                <motion.div
                  key={dorm.slug}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleDormClick(dorm.slug)}
                >
                  <h3 className="text-xl font-semibold mb-2">{dorm.name}</h3>
                  <p className="text-muted-foreground">Click to view dorm details and room layouts</p>
                </motion.div>
              ))}
            </div>
          </div>
        )

      case 'dorm':
        const selectedDormData = campus.dorms.find(d => d.slug === selectedDorm)
        return (
          <div className="p-4 lg:p-8">
            <div className="flex items-center mb-6">
              <IconComponent className="h-8 w-8 mr-3" style={{ color: campus.color }} />
              <h2 className="text-2xl lg:text-3xl font-bold">{selectedDormData?.name}</h2>
            </div>
            <p className="text-base lg:text-lg text-muted-foreground mb-8">
              Detailed information about {selectedDormData?.name} at {campus.name}.
            </p>
            <div className="bg-muted/50 p-4 lg:p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Dorm Information</h3>
              <p className="text-muted-foreground">
                This is where detailed dorm information, room layouts, amenities, and photos would be displayed.
                The content would be dynamically loaded based on the selected dorm.
              </p>
            </div>
          </div>
        )

      default:
        return (
          <div className="p-4 lg:p-8">
            <div className="flex items-center mb-6">
              <IconComponent className="h-8 w-8 mr-3" style={{ color: campus.color }} />
              <h2 className="text-2xl lg:text-3xl font-bold">{campus.name}</h2>
            </div>
            <p className="text-base lg:text-lg text-muted-foreground mb-8">
              Welcome to {campus.name} in {campus.state}. Click on "Dorms" to explore residence halls.
            </p>
            <div className="bg-muted/50 p-4 lg:p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Campus Overview</h3>
              <p className="text-muted-foreground">
                This is where campus overview information would be displayed, including general information
                about the university, location, and available housing options.
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full min-h-[600px] flex flex-col lg:flex-row border rounded-lg overflow-hidden">
      {/* Left Drawer - Filing Cabinet */}
      <div className="w-full lg:w-80 bg-muted/30 border-b lg:border-b-0 lg:border-r flex flex-col max-h-96 lg:max-h-none overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Campus Navigation</h2>
        </div>
        
        <div className="flex-1 p-4 space-y-2">
          {Object.entries(campusData).map(([key, campus]) => {
            const isOpen = openCampus === key
            const IconComponent = campus.icon
            
            return (
              <div key={key}>
                {/* Campus Tab */}
                <motion.div
                  className={`relative cursor-pointer mb-2 ${
                    isOpen ? 'z-10' : 'z-0'
                  }`}
                  onClick={() => handleCampusClick(key as CampusKey)}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div
                    className={`relative p-4 rounded-tr-lg border-l-4 transition-all duration-300 ${
                      isOpen
                        ? 'bg-background shadow-lg border-l-8'
                        : 'bg-muted/50 hover:bg-muted/70'
                    }`}
                    style={{
                      borderLeftColor: campus.color,
                      clipPath: isOpen 
                        ? 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)'
                        : 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <IconComponent 
                          className="h-5 w-5 mr-3" 
                          style={{ color: campus.color }} 
                        />
                        <div>
                          <div className="font-semibold" style={{ color: campus.color }}>
                            {campus.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {campus.state}
                          </div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Dorms Sub-tab */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, x: 20 }}
                      animate={{ opacity: 1, height: "auto", x: 0 }}
                      exit={{ opacity: 0, height: 0, x: 20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="ml-4 mb-2"
                    >
                      <motion.div
                        className={`p-3 rounded-tr-lg border-l-4 cursor-pointer transition-all duration-200 ${
                          currentView === 'dorms' && !selectedDorm
                            ? 'bg-background shadow-md border-l-6'
                            : 'bg-muted/30 hover:bg-muted/50'
                        }`}
                        style={{
                          borderLeftColor: campus.color,
                          clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)'
                        }}
                        onClick={handleDormsClick}
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">Dorms</span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </motion.div>

                      {/* Individual Dorm Tabs */}
                      <AnimatePresence>
                        {currentView === 'dorms' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="ml-4 space-y-1"
                          >
                            {campus.dorms.map((dorm) => (
                              <motion.div
                                key={dorm.slug}
                                className={`p-2 rounded-tr-lg border-l-2 cursor-pointer transition-all duration-200 ${
                                  selectedDorm === dorm.slug
                                    ? 'bg-background shadow-sm border-l-4'
                                    : 'bg-muted/20 hover:bg-muted/40'
                                }`}
                                style={{
                                  borderLeftColor: campus.color,
                                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)'
                                }}
                                onClick={() => handleDormClick(dorm.slug)}
                                whileHover={{ x: 2 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              >
                                <span className="text-xs font-medium">{dorm.name}</span>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 bg-background min-h-[400px] lg:min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${openCampus}-${currentView}-${selectedDorm}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
