'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AgendaView from '../components/AgendaView';
import EventDetailsModal from '../components/EventDetailsModal';
import { DormRoomsAtSuffolk } from '../components/DormRoomsAtSuffolk';
import { CampusEvent } from '../types/campus-events';

export default function SuffolkCampusEventCalendarPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'club-pages'>('calendar');
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Convert current month to academic year index (Sep=0, Oct=1, ..., Aug=11)
  const getAcademicMonthIndex = (month: number) => {
    // September (8) -> 0, October (9) -> 1, ..., August (7) -> 11
    return month >= 8 ? month - 8 : month + 4;
  };
  
  // Initialize with current date
  const today = new Date();
  const currentYearValue = today.getFullYear();
  const currentMonthIndex = today.getMonth();
  const currentDate = today.getDate();
  
  const [currentYear, setCurrentYear] = useState(currentYearValue);
  const [currentMonth, setCurrentMonth] = useState(getAcademicMonthIndex(currentMonthIndex));
  const [currentDay, setCurrentDay] = useState(currentDate);

  // Handle URL date parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    
    if (dateParam) {
      // Parse date parameter (format: YYYY-MM-DD)
      const [year, month, day] = dateParam.split('-').map(Number);
      
      if (year && month && day) {
        // Convert to academic year format
        const academicMonth = getAcademicMonthIndex(month - 1); // month is 1-based, convert to 0-based
        setCurrentYear(year);
        setCurrentMonth(academicMonth);
        setCurrentDay(day);
      }
    }
    // If no date parameter, keep the initial state (today's date)
  }, []);

  // Scroll to current day on mobile when component mounts
  useEffect(() => {
    const scrollToCurrentDay = () => {
      const daySelector = document.querySelector('.day-selector-scroll');
      if (daySelector) {
        const currentDayButton = daySelector.querySelector(`[data-day="${currentDay}"]`);
        if (currentDayButton) {
          currentDayButton.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      }
    };

    // Small delay to ensure DOM is rendered
    const timeoutId = setTimeout(scrollToCurrentDay, 100);
    return () => clearTimeout(timeoutId);
  }, [currentDay]);

  // Get current date for highlighting
  const isToday = (day: number) => {
    // Always check if this is the current day, regardless of selected month or year
    return day === currentDate;
  };

  // Get dynamic months array with current month first
  const getDynamicMonths = () => {
    const allMonths = [
      'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'
    ];
    
    return allMonths;
  };

  const months = getDynamicMonths();

  // Get days in current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const navigateYear = (direction: 'prev' | 'next') => {
    // For school year, we navigate by academic year, not calendar year
    if (direction === 'prev') {
      // Go to previous academic year (e.g., 2025 -> 2024)
      setCurrentYear(currentYearValue - 1);
    } else {
      // Go to next academic year (e.g., 2025 -> 2026)
      setCurrentYear(currentYearValue + 1);
    }
  };

  const isCurrentMonth = (monthIndex: number) => {
    // Check if this is the currently selected month in the calendar
    return monthIndex === currentMonth;
  };

  const isCurrentMonthToday = (monthIndex: number) => {
    // Check if this is the current month (today's month) but not selected
    // The first month in the dynamic array is always the current month
    return monthIndex === 0 && monthIndex !== currentMonth;
  };

  const isCurrentDay = (day: number) => {
    return day === currentDay;
  };

  // Handle month tab click
  const handleMonthClick = (monthIndex: number) => {
    // Convert dynamic month index back to academic year index
    const currentAcademicMonth = getAcademicMonthIndex(currentMonthIndex);
    const academicMonthIndex = (currentAcademicMonth + monthIndex) % 12;
    
    // Handle school year transitions
    let newYear = currentYear;
    if (academicMonthIndex >= 4) { // Jan, Feb, Mar, Apr, May, Jun, Jul, Aug (index 4-11)
      // These months belong to the next calendar year
      newYear = currentYearValue + 1;
    } else { // Sep, Oct, Nov, Dec (index 0-3)
      // These months belong to the current calendar year
      newYear = currentYearValue;
    }
    
    setCurrentYear(newYear);
    setCurrentMonth(academicMonthIndex);
    // Keep the current day selected when switching months
  };

  // Handle day tab click
  const handleDayClick = (day: number) => {
    setCurrentDay(day);
  };

  // Handle today button click
  const handleTodayClick = () => {
    setCurrentYear(currentYearValue);
    setCurrentMonth(getAcademicMonthIndex(currentMonthIndex));
    setCurrentDay(currentDate);
  };

  // Sample event data - in a real app, this would come from an API
  const sampleEvents: CampusEvent[] = [
    // Events for January 15, 2024
    {
      id: '1',
      title: 'Student Government Meeting',
      clubName: 'Student Government Association',
      room: 'Room 201',
      building: 'Sawyer Building',
      eventType: 'General Meeting',
      startTime: '14:30',
      endTime: '15:30',
      date: '2024-01-15',
      description: 'Monthly SGA meeting to discuss campus initiatives',
      clubAccentColor: '#3B82F6'
    },
    {
      id: '2',
      title: 'Debate Club Practice',
      clubName: 'Suffolk Debate Society',
      room: 'Room 105',
      building: 'Miller Hall',
      eventType: 'Club Event',
      startTime: '16:00',
      endTime: '17:30',
      date: '2024-01-15',
      description: 'Weekly debate practice session',
      clubAccentColor: '#EF4444'
    },
    {
      id: '3',
      title: 'Alpha Phi Alpha Meeting',
      clubName: 'Alpha Phi Alpha Fraternity',
      room: 'Room 301',
      building: 'Sawyer Building',
      eventType: 'Fraternity',
      startTime: '18:00',
      endTime: '19:00',
      date: '2024-01-15',
      description: 'Chapter meeting and planning session',
      clubAccentColor: '#10B981'
    },
    {
      id: '4',
      title: 'Women in Business',
      clubName: 'Women in Business Society',
      room: 'Room 150',
      building: 'Miller Hall',
      eventType: 'General Meeting',
      startTime: '19:30',
      endTime: '20:30',
      date: '2024-01-15',
      description: 'Networking and professional development',
      clubAccentColor: '#8B5CF6'
    },
    // Events for January 16, 2024
    {
      id: '5',
      title: 'Environmental Club Meeting',
      clubName: 'Green Suffolk',
      room: 'Room 205',
      building: 'Sawyer Building',
      eventType: 'Club Event',
      startTime: '15:00',
      endTime: '16:00',
      date: '2024-01-16',
      description: 'Planning sustainability initiatives',
      clubAccentColor: '#22C55E'
    },
    {
      id: '6',
      title: 'Delta Sigma Theta Meeting',
      clubName: 'Delta Sigma Theta Sorority',
      room: 'Room 120',
      building: 'Miller Hall',
      eventType: 'Sorority',
      startTime: '17:00',
      endTime: '18:30',
      date: '2024-01-16',
      description: 'Chapter meeting and community service planning',
      clubAccentColor: '#F59E0B'
    },
    // Events for January 17, 2024
    {
      id: '7',
      title: 'Mandatory Orientation',
      clubName: 'First Year Experience',
      room: 'Auditorium',
      building: 'Sawyer Building',
      eventType: 'Mandatory Meeting',
      startTime: '10:00',
      endTime: '12:00',
      date: '2024-01-17',
      description: 'Required orientation for new students',
      clubAccentColor: '#DC2626'
    },
    {
      id: '8',
      title: 'Cultural Night Planning',
      clubName: 'International Students Association',
      room: 'Room 300',
      building: 'Miller Hall',
      eventType: 'Cultural Event',
      startTime: '19:00',
      endTime: '20:30',
      date: '2024-01-17',
      description: 'Planning for annual cultural showcase',
      clubAccentColor: '#7C3AED'
    },
    // SASA Events - Biweekly Thursdays starting September 11, 2025
    {
      id: '9',
      title: 'SASA General Meeting',
      clubName: 'South Asian Student Association (SASA)',
      room: 'Room 115',
      building: 'Samia Building',
      eventType: 'First General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-09-11',
      description: 'The club leaders will update soon',
      clubAccentColor: '#75d1a8'
    },
    {
      id: '10',
      title: 'SASA General Meeting',
      clubName: 'South Asian Student Association (SASA)',
      room: 'Room 115',
      building: 'Samia Building',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-09-25',
      description: 'The club leaders will update soon',
      clubAccentColor: '#75d1a8'
    },
    {
      id: '11',
      title: 'SASA General Meeting',
      clubName: 'South Asian Student Association (SASA)',
      room: 'Room 115',
      building: 'Samia Building',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-10-09',
      description: 'The club leaders will update soon',
      clubAccentColor: '#75d1a8'
    },
    {
      id: '12',
      title: 'SASA General Meeting',
      clubName: 'South Asian Student Association (SASA)',
      room: 'Room 115',
      building: 'Samia Building',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-10-23',
      description: 'The club leaders will update soon',
      clubAccentColor: '#75d1a8'
    },
    {
      id: '13',
      title: 'SASA General Meeting',
      clubName: 'South Asian Student Association (SASA)',
      room: 'Room 115',
      building: 'Samia Building',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-11-06',
      description: 'The club leaders will update soon',
      clubAccentColor: '#75d1a8'
    },
    {
      id: '14',
      title: 'SASA General Meeting',
      clubName: 'South Asian Student Association (SASA)',
      room: 'Room 115',
      building: 'Samia Building',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-11-20',
      description: 'The club leaders will update soon',
      clubAccentColor: '#75d1a8'
    },
    // Additional SASA events for more Thursdays
    {
      id: '15',
      title: 'SASA General Meeting',
      clubName: 'South Asian Student Association (SASA)',
      room: 'Room 115',
      building: 'Samia Building',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-09-12',
      description: 'The club leaders will update soon',
      clubAccentColor: '#75d1a8'
    },
    {
      id: '16',
      title: 'SASA General Meeting',
      clubName: 'South Asian Student Association (SASA)',
      room: 'Room 115',
      building: 'Samia Building',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-10-10',
      description: 'The club leaders will update soon',
      clubAccentColor: '#75d1a8'
    },
    // The Suffolk Journal Events - Weekly Tuesdays starting September 9, 2025
    {
      id: '17',
      title: 'Suffolk Journal Meeting',
      clubName: 'The Suffolk Journal',
      room: 'Room TBD',
      building: '9th floor of Sawyer',
      eventType: 'First General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-09-09',
      description: 'The club leaders will update soon',
      clubAccentColor: '#163254'
    },
    {
      id: '18',
      title: 'Suffolk Journal Meeting',
      clubName: 'The Suffolk Journal',
      room: 'Room TBD',
      building: '9th floor of Sawyer',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-09-16',
      description: 'The club leaders will update soon',
      clubAccentColor: '#163254'
    },
    {
      id: '18b',
      title: 'Suffolk Journal Meeting',
      clubName: 'The Suffolk Journal',
      room: 'Room TBD',
      building: '9th floor of Sawyer',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-09-23',
      description: 'The club leaders will update soon',
      clubAccentColor: '#163254'
    },
    {
      id: '19',
      title: 'Suffolk Journal Meeting',
      clubName: 'The Suffolk Journal',
      room: 'Room TBD',
      building: '9th floor of Sawyer',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-09-30',
      description: 'The club leaders will update soon',
      clubAccentColor: '#163254'
    },
    {
      id: '19b',
      title: 'Suffolk Journal Meeting',
      clubName: 'The Suffolk Journal',
      room: 'Room TBD',
      building: '9th floor of Sawyer',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-10-07',
      description: 'The club leaders will update soon',
      clubAccentColor: '#163254'
    },
    {
      id: '19c',
      title: 'Suffolk Journal Meeting',
      clubName: 'The Suffolk Journal',
      room: 'Room TBD',
      building: '9th floor of Sawyer',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-10-14',
      description: 'The club leaders will update soon',
      clubAccentColor: '#163254'
    },
    {
      id: '20',
      title: 'Suffolk Journal Meeting',
      clubName: 'The Suffolk Journal',
      room: 'Room TBD',
      building: '9th floor of Sawyer',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-10-21',
      description: 'The club leaders will update soon',
      clubAccentColor: '#163254'
    },
    {
      id: '20b',
      title: 'Suffolk Journal Meeting',
      clubName: 'The Suffolk Journal',
      room: 'Room TBD',
      building: '9th floor of Sawyer',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-10-28',
      description: 'The club leaders will update soon',
      clubAccentColor: '#163254'
    },
    {
      id: '21',
      title: 'Suffolk Journal Meeting',
      clubName: 'The Suffolk Journal',
      room: 'Room TBD',
      building: '9th floor of Sawyer',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-11-04',
      description: 'The club leaders will update soon',
      clubAccentColor: '#163254'
    },
    {
      id: '21b',
      title: 'Suffolk Journal Meeting',
      clubName: 'The Suffolk Journal',
      room: 'Room TBD',
      building: '9th floor of Sawyer',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-11-11',
      description: 'The club leaders will update soon',
      clubAccentColor: '#163254'
    },
    {
      id: '22',
      title: 'Suffolk Journal Meeting',
      clubName: 'The Suffolk Journal',
      room: 'Room TBD',
      building: '9th floor of Sawyer',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-11-18',
      description: 'The club leaders will update soon',
      clubAccentColor: '#163254'
    },
    {
      id: '22b',
      title: 'Suffolk Journal Meeting',
      clubName: 'The Suffolk Journal',
      room: 'Room TBD',
      building: '9th floor of Sawyer',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-11-25',
      description: 'The club leaders will update soon',
      clubAccentColor: '#163254'
    },
    {
      id: '22c',
      title: 'Suffolk Journal Meeting',
      clubName: 'The Suffolk Journal',
      room: 'Room TBD',
      building: '9th floor of Sawyer',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-12-02',
      description: 'The club leaders will update soon',
      clubAccentColor: '#163254'
    },
    {
      id: '22d',
      title: 'Suffolk Journal Meeting',
      clubName: 'The Suffolk Journal',
      room: 'Room TBD',
      building: '9th floor of Sawyer',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-12-09',
      description: 'The club leaders will update soon',
      clubAccentColor: '#163254'
    },
    // Entrepreneurship Club Events - Weekly Tuesdays starting September 9, 2025
    {
      id: '23',
      title: 'Entrepreneurship Club Meeting',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'First General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-09-09',
      description: 'The club leaders will update soon',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '24',
      title: 'Entrepreneurship Club Meeting',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-09-16',
      description: 'The club leaders will update soon',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '24b',
      title: 'Entrepreneurship Club Meeting',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-09-23',
      description: 'The club leaders will update soon',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '25',
      title: 'Entrepreneurship Club Meeting',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-09-30',
      description: 'The club leaders will update soon',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '25b',
      title: 'Entrepreneurship Club Meeting',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-10-07',
      description: 'The club leaders will update soon',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '25c',
      title: 'Entrepreneurship Club Meeting',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-10-14',
      description: 'The club leaders will update soon',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26',
      title: 'Entrepreneurship Club Meeting',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-10-21',
      description: 'The club leaders will update soon',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26b',
      title: 'Small Business Fair Workshop',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'Workshop',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-10-28',
      description: 'Small Business Fair Workshop - learn about starting your own business',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26c',
      title: 'Entrepreneurship Club Meeting',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-11-04',
      description: 'The club leaders will update soon',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26d',
      title: 'Entrepreneurship Club Meeting',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-11-11',
      description: 'The club leaders will update soon',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26e',
      title: 'Entrepreneurship Club Meeting',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-11-18',
      description: 'The club leaders will update soon',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26f',
      title: 'Entrepreneurship Club Meeting',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-11-25',
      description: 'The club leaders will update soon',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26g',
      title: 'Entrepreneurship Club Meeting',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-12-02',
      description: 'The club leaders will update soon',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26h',
      title: 'Entrepreneurship Club Meeting',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-12-09',
      description: 'The club leaders will update soon',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '27',
      title: 'Entrepreneurship Club Meeting',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'General Meeting',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-11-04',
      description: 'The club leaders will update soon',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26g',
      title: 'IP Pitch Competition',
      clubName: 'Entrepreneurship Club',
      room: 'Room Smith common',
      building: 'Sargent Hall 5 floor',
      eventType: 'Competition',
      startTime: '18:00',
      endTime: '20:00',
      date: '2025-11-18',
      description: 'IP Pitch Competition - showcase your innovative ideas',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26h',
      title: 'Networking Night',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'Networking',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-09-16',
      description: 'Networking Night - connect with fellow entrepreneurs',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26i',
      title: 'Social Event',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'Social',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-09-30',
      description: 'Social Event - build connections and have fun',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26ia',
      title: 'AI Pitch Competition',
      clubName: 'Entrepreneurship Club',
      room: 'Smith Commons',
      building: 'Sargent Hall 5 floor',
      eventType: 'Competition',
      startTime: '17:00',
      endTime: '20:00',
      date: '2025-09-28',
      description: 'AI Pitch Competition - showcase your AI-powered business ideas',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26j',
      title: 'Networking Night',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'Networking',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-11-04',
      description: 'Networking Night - connect with fellow entrepreneurs',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26k',
      title: 'Guest Speaker',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'Guest Speaker',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-11-11',
      description: 'Guest Speaker - learn from industry experts',
      clubAccentColor: '#c3a14a'
    },
    {
      id: '26l',
      title: 'Goal Setting for Spring and Celebration',
      clubName: 'Entrepreneurship Club',
      room: 'Room 103',
      building: '1 Beacon',
      eventType: 'Planning Session',
      startTime: '12:30',
      endTime: '13:45',
      date: '2025-11-18',
      description: 'goal setting for spring and celebration',
      clubAccentColor: '#c3a14a'
    }
  ];

  // Get selected date in YYYY-MM-DD format
  const getSelectedDate = (): string => {
    // Convert academic year month index to actual month number
    // months array: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
    // Index 0 = Sep (9), Index 1 = Oct (10), etc.
    const actualMonth = currentMonth < 4 ? currentMonth + 9 : currentMonth - 3;
    const year = currentYear;
    const month = actualMonth;
    const day = currentDay;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  // Get day of week for selected date
  const getDayOfWeek = (): string => {
    const actualMonth = currentMonth < 4 ? currentMonth + 9 : currentMonth - 3;
    const date = new Date(currentYear, actualMonth - 1, currentDay);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Get full month name
  const getFullMonthName = (): string => {
    const actualMonth = currentMonth < 4 ? currentMonth + 9 : currentMonth - 3;
    const date = new Date(currentYear, actualMonth - 1, currentDay);
    return date.toLocaleDateString('en-US', { month: 'long' });
  };

  // Get events for selected date
  const getEventsForSelectedDate = (): CampusEvent[] => {
    const selectedDate = getSelectedDate();
    const eventsForDate = sampleEvents.filter(event => event.date === selectedDate);
    
    // Apply override rule: remove general meetings if there's a special event at the same time
    const filteredEvents = eventsForDate.filter(event => {
      // Check if this is a general meeting
      const isGeneralMeeting = event.title.toLowerCase().includes('general meeting') || 
                              event.title.toLowerCase().includes('meeting');
      
      if (!isGeneralMeeting) {
        // If it's not a general meeting, keep it
        return true;
      }
      
      // If it's a general meeting, check if there's a special event for the same club at the same time
      const hasSpecialEventAtSameTime = eventsForDate.some(otherEvent => 
        otherEvent.clubName === event.clubName &&
        otherEvent.startTime === event.startTime &&
        otherEvent.id !== event.id &&
        !otherEvent.title.toLowerCase().includes('general meeting') &&
        !otherEvent.title.toLowerCase().includes('meeting')
      );
      
      // Keep the general meeting only if there's no special event at the same time
      return !hasSpecialEventAtSameTime;
    });
    
    return filteredEvents;
  };

  const handleEventClick = (event: CampusEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            Suffolk Campus Events Calendar
          </h1>
        </div>
      </div>

        {/* Main Container */}
        <div className="bg-gray-50">
         <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="flex items-center gap-8 mb-4">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`text-lg font-medium transition-colors ${
                  activeTab === 'calendar' 
                    ? 'text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveTab('club-pages')}
                className={`text-lg font-medium transition-colors ${
                  activeTab === 'club-pages' 
                    ? 'text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Club Pages
              </button>
            </div>
            
            {/* Tab Line */}
            <div className="relative">
              <div className="w-full h-px bg-gray-300"></div>
              <div 
                className={`absolute top-0 h-1 bg-blue-600 rounded-full transition-all duration-200 ${
                  activeTab === 'calendar' 
                    ? 'left-0 w-20' 
                    : 'left-24 w-24'
                }`}
              ></div>
            </div>
          </div>

            {/* Calendar Content */}
            {activeTab === 'calendar' && (
              <div className="space-y-6 pb-2">
               {/* Year and Month Selector */}
               <div className="space-y-4">
                {/* Today Button and Year Selector - Desktop */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTodayClick}
                      className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                    >
                      Today
                    </button>
                    <span className="text-lg font-medium text-gray-900">
                      {currentMonth >= 4 ? currentYearValue + 1 : currentYearValue}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => navigateYear('prev')}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => navigateYear('next')}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Vertical Separator */}
                  <div className="w-px h-8 bg-gray-300"></div>

                  {/* Month Selector - Desktop */}
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 pb-2 min-w-max">
                      {months.map((month, index) => {
                        const isActive = isCurrentMonth(index);
                        const isCurrentMonthTodayValue = isCurrentMonthToday(index);
                        return (
                          <button
                            key={month}
                            onClick={() => handleMonthClick(index)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                              isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : isCurrentMonthTodayValue
                                ? 'bg-blue-300 text-blue-900 shadow-sm border border-blue-400'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                            }`}
                            title={isCurrentMonthTodayValue ? 'Current Month' : `Month ${month}`}
                          >
                            {month}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-4">
                  {/* Today Button and Year Selector - Mobile */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleTodayClick}
                        className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                      >
                        Today
                      </button>
                      <span className="text-lg font-medium text-gray-900">
                        {currentMonth >= 4 ? currentYearValue + 1 : currentYearValue}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => navigateYear('prev')}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => navigateYear('next')}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Month Selector - Mobile */}
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 pb-2 min-w-max">
                      {months.map((month, index) => {
                        const isActive = isCurrentMonth(index);
                        const isCurrentMonthTodayValue = isCurrentMonthToday(index);
                        return (
                          <button
                            key={month}
                            onClick={() => handleMonthClick(index)}
                            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                              isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : isCurrentMonthTodayValue
                                ? 'bg-blue-300 text-blue-900 shadow-sm border border-blue-400'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                            }`}
                            title={isCurrentMonthTodayValue ? 'Current Month' : `Month ${month}`}
                          >
                            {month}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal Line */}
              <div className="w-full h-px bg-gray-300"></div>

              {/* Day Selector */}
              <div className="overflow-x-auto scrollbar-hide day-selector-scroll">
                <div className="flex gap-3 pb-2 min-w-max">
                  {days.map((day) => {
                    const isActive = isCurrentDay(day);
                    const isTodayDate = isToday(day);
                    return (
                      <button
                        key={day}
                        data-day={day}
                        onClick={() => handleDayClick(day)}
                         className={`w-12 h-12 rounded-lg font-medium transition-colors flex items-center justify-center ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md'
                            : isTodayDate
                            ? 'bg-blue-300 text-blue-900 shadow-sm border border-blue-400'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                        }`}
                        title={isTodayDate ? 'Today' : `Day ${day}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

               {/* Horizontal Line */}
               <div className="w-full h-px bg-gray-300"></div>

               {/* Date Header and Events */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                 {/* Date Header */}
                   <div className="mb-6">
                     <h2 className="text-2xl font-bold text-gray-900">
                       {getDayOfWeek()}, {getFullMonthName()} {currentDay}, {currentMonth >= 4 ? currentYearValue + 1 : currentYearValue}
                     </h2>
                   </div>

                 {/* Events or Empty State */}
                 {getEventsForSelectedDate().length > 0 ? (
                   <AgendaView
                     events={getEventsForSelectedDate()}
                     selectedDate={getSelectedDate()}
                     onEventClick={handleEventClick}
                   />
                 ) : (
                   <div className="text-center py-12">
                     <div className="mb-6">
                       <h3 className="text-2xl font-bold text-gray-900 mb-2">
                         No Events Yet
                       </h3>
                       <p className="text-lg text-gray-600">
                         If you want to add an event
                       </p>
                     </div>
                     
                     {/* Contact Icons */}
                     <div className="flex justify-center gap-3">
                       {/* Instagram */}
                       <a
                         href="https://www.instagram.com/4wallsdorms/"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:shadow-lg"
                         title="DM us on Instagram to add more info"
                       >
                         <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c0 .796-.651 1.44-1.44 1.44-.796 0-1.44-.651-1.44-1.44 0-.796.651-1.44 1.44-1.44.796 0 1.44.651 1.44 1.44z"/>
                         </svg>
                       </a>

                       {/* Email */}
                       <a
                         href="mailto:4WallsDormsCalendar@gmail.com"
                         className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md bg-gray-600 hover:bg-gray-700 hover:shadow-lg"
                         title="Email us to add more info"
                       >
                         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                         </svg>
                       </a>
                     </div>
                   </div>
                 )}

                 {/* Call-to-Action Section - Always visible below events */}
                 <div className="mt-6">
                   <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 hover:shadow-md transition-shadow">
                     {/* Content */}
                     <div className="flex-1 min-w-0">
                       <h3 className="text-lg font-bold text-gray-900">
                         Want to add your event?
                       </h3>
                       <p className="text-sm text-gray-600 mt-1">
                         Or advertise your <strong>business</strong>? Or show off your <strong>music or media</strong>? Please send me an email.
                       </p>
                     </div>

                     {/* Email Button */}
                     <div className="flex-shrink-0">
                       <a
                         href="mailto:4WallsDormsCalendar@gmail.com"
                         className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                         title="Email us to add your event"
                       >
                         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                         </svg>
                       </a>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {/* Club Pages Content (Placeholder) */}
          {activeTab === 'club-pages' && (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium text-gray-900 mb-2">Club Pages</h2>
              <p className="text-gray-600">This section will be implemented in a future update.</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Dorm Rooms Section */}
      <div>
        <DormRoomsAtSuffolk rooms={[
        {
          id: 1,
          type: "Room 1005",
          description: "Double Room • 10th Floor • Miller Hall",
          image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+10/1005+%2B+1006/1005millersuffolk(1).jpg",
          link: "/dorms/miller-hall/room/1005"
        },
        {
          id: 2,
          type: "Room 504",
          description: "Double Room • 5th Floor • Miller Hall",
          image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+5/503+%2B+504/504millersuffolk(3).jpg",
          link: "/dorms/miller-hall/room/504"
        },
        {
          id: 3,
          type: "Room 610",
          description: "Single Room • 6th Floor • Miller Hall",
          image: "https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University+Dorms/Miller/Floor+6/609+%2B+610/sumiller610-bedroom-imp-empty-2.jpg",
          link: "/dorms/miller-hall/room/610"
        }
      ]} />
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
