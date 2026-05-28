'use client';

import React from 'react';
import { CampusEvent, AgendaViewProps } from '../types/campus-events';

// Helper function to format time from 24-hour to 12-hour format
const formatTime = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Helper function to format time range
const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${formatTime(startTime)} – ${formatTime(endTime)}`;
};

// Event Card Component
const EventCard: React.FC<{
  event: CampusEvent;
  onEventClick?: (event: CampusEvent) => void;
}> = ({ event, onEventClick }) => {
  return (
    <div 
      className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border-2 border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onEventClick?.(event)}
      style={{
        borderColor: event.clubAccentColor,
        borderTopColor: event.clubAccentColor,
        borderRightColor: event.clubAccentColor,
        borderBottomColor: event.clubAccentColor
      }}
    >
      {/* Event Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {event.eventType.toLowerCase().includes('meeting') ? event.clubName : `${event.clubName} Event`}
        </h3>
        <div className="mt-1">
          <span 
            className="inline-block px-2 py-1 text-sm font-semibold text-white rounded-md"
            style={{ backgroundColor: event.clubAccentColor }}
          >
            {event.eventType}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {event.room} • {event.building}
        </p>
      </div>

      {/* Right-side icon */}
      <div className="flex-shrink-0">
        <div 
          className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors"
          style={{
            backgroundColor: `${event.clubAccentColor}20`,
            borderColor: event.clubAccentColor,
            borderWidth: '2px'
          }}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: event.clubAccentColor }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="text-center text-neutral-600 text-lg font-medium">
        No events yet
      </div>
      <div className="text-center text-neutral-500 text-sm mt-1">
        If you want to add an event
      </div>
      <div className="flex justify-center gap-3 mt-3">
        <a 
          href="mailto:events@suffolk.edu" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Email Us
        </a>
        <a 
          href="https://instagram.com/suffolkuniversity" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition"
        >
          Instagram DM
        </a>
      </div>
    </div>
  );
};

// Main Agenda View Component
const AgendaView: React.FC<AgendaViewProps> = ({ 
  events, 
  selectedDate, 
  onEventClick 
}) => {
  // Filter events for the selected date
  const dayEvents = events.filter(event => event.date === selectedDate);

  // Sort events by start time
  const sortedEvents = dayEvents.sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  // Group events by time slots (events that start at the same time)
  const groupedEvents = sortedEvents.reduce((groups, event) => {
    const timeKey = event.startTime;
    if (!groups[timeKey]) {
      groups[timeKey] = [];
    }
    groups[timeKey].push(event);
    return groups;
  }, {} as Record<string, CampusEvent[]>);

  if (sortedEvents.length === 0) {
    return <EmptyState />;
  }

  // Rule: Always show time bubbles for all events
  const shouldShowTimeBubbles = true;

  return (
    <div className="space-y-4">
      {Object.entries(groupedEvents).map(([timeSlot, timeEvents]) => {
        const firstEvent = timeEvents[0];
        const timeRange = formatTimeRange(firstEvent.startTime, firstEvent.endTime);
        
        return (
          <div key={timeSlot} className="space-y-3">
            {/* Time Label - Always show if there are multiple events on the day */}
            {shouldShowTimeBubbles && (
              <div className="flex items-center">
                <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  {timeRange}
                </div>
              </div>
            )}

            {/* Event Cards */}
            <div className="space-y-3">
              {timeEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEventClick={onEventClick}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AgendaView;
