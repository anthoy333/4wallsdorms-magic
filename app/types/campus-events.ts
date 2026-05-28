export interface CampusEvent {
  id: string;
  title: string;
  clubName: string;
  room: string;
  building: string;
  eventType: EventType;
  startTime: string; // Format: "14:30" (24-hour)
  endTime: string;   // Format: "15:30" (24-hour)
  date: string;      // Format: "2024-01-15"
  description?: string;
  clubAccentColor: string; // Hex color for club-specific styling
}

export type EventType = 
  | 'General Meeting'
  | 'Club Event'
  | 'Sorority'
  | 'Fraternity'
  | 'Resource Meeting'
  | 'Mandatory Meeting'
  | 'Social Event'
  | 'Academic Event'
  | 'Sports Event'
  | 'Cultural Event';

export interface AgendaViewProps {
  events: CampusEvent[];
  selectedDate: string; // Format: "2024-01-15"
  onEventClick?: (event: CampusEvent) => void;
}
