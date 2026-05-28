'use client';

import React, { useState } from 'react';

interface Event {
  id: string;
  name: string;
  category: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  location?: string;
  description?: string;
  color: string;     // Tailwind color class
}

interface Category {
  name: string;
  events: Event[];
  isCollapsed: boolean;
}

const EVENTS_DATA: Category[] = [
  {
    name: "Club Meetings",
    isCollapsed: false,
    events: [
      {
        id: "chess-1",
        name: "Chess Club Meeting",
        category: "Club Meetings",
        startTime: "09:00",
        endTime: "10:30",
        location: "Student Center Room 201",
        description: "Weekly strategy session and practice games",
        color: "bg-blue-600"
      },
      {
        id: "baking-1",
        name: "Baking Club Workshop",
        category: "Club Meetings",
        startTime: "12:00",
        endTime: "14:00",
        location: "Culinary Arts Kitchen",
        description: "Learn to make artisan breads and pastries",
        color: "bg-pink-600"
      },
      {
        id: "women-business-1",
        name: "Women in Business Club",
        category: "Club Meetings",
        startTime: "18:00",
        endTime: "19:30",
        location: "Business School Room 105",
        description: "Networking and professional development",
        color: "bg-indigo-600"
      }
    ]
  },
  {
    name: "Campus Run Events",
    isCollapsed: false,
    events: [
      {
        id: "rha-1",
        name: "Residence Hall Association",
        category: "Campus Run Events",
        startTime: "10:00",
        endTime: "11:00",
        location: "Miller Hall Conference Room",
        description: "Monthly meeting for dormitory representatives",
        color: "bg-green-600"
      },
      {
        id: "sg-1",
        name: "Student Government Meeting",
        category: "Campus Run Events",
        startTime: "15:00",
        endTime: "16:30",
        location: "Student Government Office",
        description: "Weekly student government session",
        color: "bg-emerald-600"
      },
      {
        id: "campus-ministry-1",
        name: "Campus Ministry Service",
        category: "Campus Run Events",
        startTime: "19:00",
        endTime: "20:00",
        location: "Chapel",
        description: "Evening worship and fellowship",
        color: "bg-teal-600"
      }
    ]
  },
  {
    name: "Greek Life",
    isCollapsed: false,
    events: [
      {
        id: "delta-gamma-1",
        name: "Delta Gamma Chapter Meeting",
        category: "Greek Life",
        startTime: "17:00",
        endTime: "18:00",
        location: "Delta Gamma House",
        description: "Monthly chapter business meeting",
        color: "bg-purple-600"
      },
      {
        id: "alpha-phi-1",
        name: "Alpha Phi Social Event",
        category: "Greek Life",
        startTime: "19:30",
        endTime: "21:00",
        location: "Alpha Phi House",
        description: "Mixer and social gathering",
        color: "bg-violet-600"
      },
      {
        id: "sigma-chi-1",
        name: "Sigma Chi Brotherhood",
        category: "Greek Life",
        startTime: "20:00",
        endTime: "22:00",
        location: "Sigma Chi House",
        description: "Brotherhood bonding and activities",
        color: "bg-fuchsia-600"
      }
    ]
  },
  {
    name: "Cultural & Service Organizations",
    isCollapsed: false,
    events: [
      {
        id: "blood-drive-1",
        name: "Blood Drive",
        category: "Cultural & Service Organizations",
        startTime: "09:00",
        endTime: "16:00",
        location: "Student Center Main Hall",
        description: "Annual campus blood donation drive",
        color: "bg-red-600"
      },
      {
        id: "habitat-1",
        name: "Habitat for Humanity",
        category: "Cultural & Service Organizations",
        startTime: "13:00",
        endTime: "15:00",
        location: "Off-campus build site",
        description: "Community service construction project",
        color: "bg-orange-600"
      },
      {
        id: "latin-union-1",
        name: "Latin Student Union",
        category: "Cultural & Service Organizations",
        startTime: "16:00",
        endTime: "17:30",
        location: "Cultural Center Room 2",
        description: "Cultural celebration and planning meeting",
        color: "bg-amber-600"
      },
      {
        id: "asian-cultural-1",
        name: "Asian Cultural Association",
        category: "Cultural & Service Organizations",
        startTime: "18:30",
        endTime: "20:00",
        location: "Cultural Center Main Room",
        description: "Cultural exchange and community building",
        color: "bg-yellow-600"
      }
    ]
  }
];

export default function CampusEventsCalendar() {
  const [categories, setCategories] = useState<Category[]>(EVENTS_DATA);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Generate time slots from 6 AM to 11 PM
  const timeSlots = Array.from({ length: 18 }, (_, i) => i + 6);

  const toggleCategory = (categoryName: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.name === categoryName 
          ? { ...cat, isCollapsed: !cat.isCollapsed }
          : cat
      )
    );
  };

  const getEventPosition = (startTime: string, endTime: string) => {
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    const endMinute = parseInt(endTime.split(':')[1]);
    
    // Calculate grid position (offset from 6 AM)
    const gridStart = (startHour - 6) + 1;
    const gridEnd = (endHour - 6) + 1;
    
    // Handle minute precision (simplified for this example)
    const duration = Math.max(1, gridEnd - gridStart);
    
    return {
      gridColumnStart: gridStart,
      gridColumnEnd: gridStart + duration,
      width: `${(duration / 18) * 100}%`
    };
  };

  const formatTime = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const allEvents = categories.flatMap(cat => cat.events);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Campus Events - September 9, 2024
          </h1>
          <p className="text-gray-600">
            Daily calendar view of campus activities and events
          </p>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {sidebarOpen ? 'Hide' : 'Show'} Event List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Event Sidebar */}
          <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Event Categories</h2>
              
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.name} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800">{category.name}</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          category.isCollapsed ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {!category.isCollapsed && (
                      <div className="px-3 pb-3 space-y-2">
                        {category.events.map((event) => (
                          <div
                            key={event.id}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                              selectedEvent === event.id 
                                ? 'bg-green-50 border border-green-200' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedEvent(
                              selectedEvent === event.id ? null : event.id
                            )}
                          >
                            <div className={`w-3 h-3 rounded-sm ${event.color}`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-700 truncate">
                                {event.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {event.startTime} - {event.endTime}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Timeline View</h2>
            
            {/* Time Header */}
            <div className="grid grid-cols-18 gap-0 mb-4">
              {timeSlots.map((hour) => (
                <div key={hour} className="text-center">
                  <div className="text-xs text-gray-500 font-medium">
                    {formatTime(hour)}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline Grid */}
            <div className="relative">
              {/* Grid Lines */}
              <div className="grid grid-cols-18 gap-0 h-96">
                {timeSlots.map((hour, index) => (
                  <div
                    key={hour}
                    className={`border-r border-gray-200 ${
                      index === timeSlots.length - 1 ? 'border-r-0' : ''
                    }`}
                  ></div>
                ))}
              </div>

              {/* Event Bars */}
              <div className="absolute top-0 left-0 w-full h-96">
                {allEvents.map((event) => {
                  const position = getEventPosition(event.startTime, event.endTime);
                  const isSelected = selectedEvent === event.id;
                  
                  return (
                    <div
                      key={event.id}
                      className={`absolute top-2 h-8 ${event.color} rounded-md shadow-sm cursor-pointer transition-all duration-200 ${
                        isSelected ? 'ring-2 ring-green-400 ring-opacity-50' : 'hover:shadow-md'
                      }`}
                      style={{
                        left: `${((position.gridColumnStart - 1) / 18) * 100}%`,
                        width: position.width,
                        zIndex: isSelected ? 10 : 1
                      }}
                      title={`${event.name} (${event.startTime} - ${event.endTime})${event.location ? ` - ${event.location}` : ''}`}
                    >
                      <div className="px-2 py-1 h-full flex items-center">
                        <span className="text-white text-xs font-medium truncate">
                          {event.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Event Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {allEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm ${event.color}`}></div>
                    <span className="text-xs text-gray-600 truncate">{event.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


