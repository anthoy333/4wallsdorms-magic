'use client';

import React, { useEffect, useState, useRef } from 'react';
import { CampusEvent } from '../types/campus-events';

interface EventDetailsModalProps {
  event: CampusEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, isOpen, onClose }) => {
  // Tab state management - always start with Updates when modal opens
  const [activeTab, setActiveTab] = useState('Updates');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Meetings pagination state
  const [futureMeetingsVisible, setFutureMeetingsVisible] = useState(4);
  const [pastMeetingsVisible, setPastMeetingsVisible] = useState(4);
  
  // Events pagination state
  const [futureEventsVisible, setFutureEventsVisible] = useState(4);
  const [pastEventsVisible, setPastEventsVisible] = useState(4);

  // Reset to Updates tab whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('Updates');
      // Reset pagination when modal opens
      setFutureMeetingsVisible(4);
      setPastMeetingsVisible(4);
      setFutureEventsVisible(4);
      setPastEventsVisible(4);
    }
  }, [isOpen]);

  // Get updates for the club - in a real app, this would come from props or API
  const getUpdates = (clubName: string) => {
    const updates: Record<string, any[]> = {
      'South Asian Student Association (SASA)': [
        {
          id: 1,
          date: 'September 14, 2025',
          time: null,
          content: 'Joined the 4WallsDorms Community'
        }
      ],
      'The Suffolk Journal': [
        {
          id: 1,
          date: 'September 14, 2025',
          time: null,
          content: 'Joined the 4WallsDorms Community'
        }
      ],
      'Entrepreneurship Club': [
        {
          id: 1,
          date: 'September 14, 2025',
          time: null,
          content: 'Entrepreneurship Club (ENT) Joined the 4WallsDorms Community'
        }
      ]
    };
    
    return updates[clubName] || [];
  };

  // Get overview content for the club - in a real app, this would come from props or API
  const getOverview = (clubName: string) => {
    const overviews: Record<string, any> = {
      'South Asian Student Association (SASA)': {
        content: 'We are focused on bringing awareness of South Asian culture and creating a community for those who identify with or want to support!',
        source: 'copied from Instagram'
      },
      'The Suffolk Journal': {
        content: 'Contact us to add overview content',
        source: null
      },
      'Entrepreneurship Club': {
        content: 'Student Lead Organization. Encourages all students to let their ideas lead the way and network to become successful leaders in the business world.',
        source: null
      }
    };
    
    return overviews[clubName] || { content: 'Contact us to add overview content', source: null };
  };

  // Get events for the club - in a real app, this would come from props or API
  const getEvents = (clubName: string) => {
    const events: Record<string, any[]> = {
      'Entrepreneurship Club': [
        { id: 1, type: 'Guest Speaker', date: 'September 9, 2025', time: '2:30 PM - 3:30 PM', title: 'Fetch Guest Speaker', description: '**Club leaders will update soon**', location: 'Sargent Hall Ketches room 1 floor' },
        { id: 6, type: 'Networking', date: 'September 16, 2025', time: '12:30 PM - 1:45 PM', title: 'Networking Night', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 2, type: 'Competition', date: 'September 28, 2025', time: '5:00 PM - 8:00 PM', title: 'AI Pitch Competition', description: '**Club leaders will update soon**', location: 'Sargent Hall 5 floor' },
        { id: 7, type: 'Social', date: 'September 30, 2025', time: '12:30 PM - 1:45 PM', title: 'Social Event', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 3, type: 'Workshop', date: 'October 7, 2025', time: '12:30 PM - 1:45 PM', title: 'Small Business Fair Workshop', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 4, type: 'Workshop', date: 'October 28, 2025', time: '12:30 PM - 1:45 PM', title: 'Small Business Fair Workshop', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 8, type: 'Networking', date: 'November 4, 2025', time: '12:30 PM - 1:45 PM', title: 'Networking Night', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 9, type: 'Guest Speaker', date: 'November 11, 2025', time: '12:30 PM - 1:45 PM', title: 'Guest Speaker', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 10, type: 'Planning Session', date: 'November 18, 2025', time: '12:30 PM - 1:45 PM', title: 'Goal Setting for Spring and Celebration', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 5, type: 'Competition', date: 'November 18, 2025', time: '6:00 PM - 8:00 PM', title: 'IP Pitch Competition', description: '**Club leaders will update soon**', location: 'Sargent Hall 5 floor Room Smith common' }
      ],
      'South Asian Student Association (SASA)': [
        // SASA doesn't have special events, only general meetings
      ],
      'The Suffolk Journal': [
        // Suffolk Journal doesn't have special events, only general meetings
      ]
    };
    
    // Sort events chronologically by date and time
    const clubEvents = events[clubName] || [];
    return clubEvents.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      // If same date, sort by time
      return a.time.localeCompare(b.time);
    });
  };

  // Get meetings for the club - in a real app, this would come from props or API
  const getMeetings = (clubName: string) => {
    const meetings: Record<string, any[]> = {
      'Entrepreneurship Club': [
        // September 2025
        { id: 1, type: 'General Meeting', date: 'September 9, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 16, type: 'Networking', date: 'September 16, 2025', time: '12:30 PM - 1:45 PM', title: 'Networking Night', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 2, type: 'General Meeting', date: 'September 23, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 17, type: 'Social', date: 'September 30, 2025', time: '12:30 PM - 1:45 PM', title: 'Social Event', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        // October 2025
        { id: 5, type: 'General Meeting', date: 'October 7, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 6, type: 'General Meeting', date: 'October 14, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 7, type: 'General Meeting', date: 'October 21, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 8, type: 'General Meeting', date: 'October 28, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        // November 2025
        { id: 18, type: 'Networking', date: 'November 4, 2025', time: '12:30 PM - 1:45 PM', title: 'Networking Night', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 19, type: 'Guest Speaker', date: 'November 11, 2025', time: '12:30 PM - 1:45 PM', title: 'Guest Speaker', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 20, type: 'Planning Session', date: 'November 18, 2025', time: '12:30 PM - 1:45 PM', title: 'Goal Setting for Spring and Celebration', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 12, type: 'General Meeting', date: 'November 25, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        // December 2025
        { id: 13, type: 'General Meeting', date: 'December 2, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 14, type: 'General Meeting', date: 'December 9, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '1 Beacon room 103' },
        { id: 15, type: 'General Meeting', date: 'December 12, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '1 Beacon room 103' }
      ],
      'South Asian Student Association (SASA)': [
        // September 2025
        { id: 1, type: 'General Meeting', date: 'September 11, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: 'Samia Building Room 115' },
        { id: 2, type: 'General Meeting', date: 'September 25, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: 'Samia Building Room 115' },
        // October 2025
        { id: 3, type: 'General Meeting', date: 'October 9, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: 'Samia Building Room 115' },
        { id: 4, type: 'General Meeting', date: 'October 23, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: 'Samia Building Room 115' },
        // November 2025
        { id: 5, type: 'General Meeting', date: 'November 6, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: 'Samia Building Room 115' },
        { id: 6, type: 'General Meeting', date: 'November 20, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: 'Samia Building Room 115' },
        // December 2025
        { id: 7, type: 'General Meeting', date: 'December 4, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: 'Samia Building Room 115' },
        { id: 8, type: 'General Meeting', date: 'December 18, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: 'Samia Building Room 115' }
      ],
      'The Suffolk Journal': [
        // September 2025
        { id: 1, type: 'General Meeting', date: 'September 9, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '9th floor of Sawyer Room 927' },
        { id: 2, type: 'General Meeting', date: 'September 16, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '9th floor of Sawyer Room 927' },
        { id: 3, type: 'General Meeting', date: 'September 23, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '9th floor of Sawyer Room 927' },
        { id: 4, type: 'General Meeting', date: 'September 30, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '9th floor of Sawyer Room 927' },
        // October 2025
        { id: 5, type: 'General Meeting', date: 'October 7, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '9th floor of Sawyer Room 927' },
        { id: 6, type: 'General Meeting', date: 'October 14, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '9th floor of Sawyer Room 927' },
        { id: 7, type: 'General Meeting', date: 'October 21, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '9th floor of Sawyer Room 927' },
        { id: 8, type: 'General Meeting', date: 'October 28, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '9th floor of Sawyer Room 927' },
        // November 2025
        { id: 9, type: 'General Meeting', date: 'November 4, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '9th floor of Sawyer Room 927' },
        { id: 10, type: 'General Meeting', date: 'November 11, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '9th floor of Sawyer Room 927' },
        { id: 11, type: 'General Meeting', date: 'November 18, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '9th floor of Sawyer Room 927' },
        { id: 12, type: 'General Meeting', date: 'November 25, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '9th floor of Sawyer Room 927' },
        // December 2025
        { id: 13, type: 'General Meeting', date: 'December 2, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '9th floor of Sawyer Room 927' },
        { id: 14, type: 'General Meeting', date: 'December 9, 2025', time: '12:30 PM - 1:45 PM', title: 'General Meeting', description: '**Club leaders will update soon**', location: '9th floor of Sawyer Room 927' }
      ]
    };
    
    // Sort meetings chronologically by date and time
    const clubMeetings = meetings[clubName] || [];
    return clubMeetings.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      // If same date, sort by time
      return a.time.localeCompare(b.time);
    });
  };

  // Mock job applications data - in a real app, this would come from props or API
  const getJobApplications = (clubName: string) => {
    // Mock data - you can replace this with actual data
    const jobApplications: Record<string, any[]> = {
      'South Asian Student Association (SASA)': [
        { id: 1, title: 'Marketing Coordinator', company: 'SASA' },
        { id: 2, title: 'Event Planner', company: 'SASA' }
      ],
      'The Suffolk Journal': [
        { id: 1, title: 'Staff Writer', company: 'Suffolk Journal' }
      ],
      'Entrepreneurship Club': [
        { id: 1, title: 'Marketing Intern', company: 'Entrepreneurship Club' },
        { id: 2, title: 'Event Coordinator', company: 'Entrepreneurship Club' },
        { id: 3, title: 'Social Media Manager', company: 'Entrepreneurship Club' }
      ]
    };
    
    return jobApplications[clubName] || [];
  };

  // Calculate job tab title and tabs array
  const jobApplications = event ? getJobApplications(event.clubName) : [];
  const jobTabTitle = jobApplications.length > 1 ? 'Job applications' : 'Job application';
  
  // Get social media links for clubs
  const getSocialMediaLinks = (clubName: string) => {
    const socialLinks: Record<string, any[]> = {
      'South Asian Student Association (SASA)': [
        {
          name: 'Instagram',
          url: 'https://www.instagram.com/suffolkusasa/?hl=en',
          icon: 'instagram'
        },
        {
          name: 'LinkedIn',
          url: 'https://www.linkedin.com/company/suffolkusasa',
          icon: 'linkedin'
        },
        {
          name: 'Email',
          url: 'mailto:sasa@suffolk.edu',
          icon: 'email'
        }
      ],
      'The Suffolk Journal': [
        {
          name: 'Website',
          url: 'https://thesuffolkjournal.com/',
          icon: 'website'
        },
        {
          name: 'Instagram',
          url: 'https://www.instagram.com/thesuffolkjournal/',
          icon: 'instagram'
        },
        {
          name: 'Email',
          url: 'mailto:TheSuffolkJournal@gmail.com',
          icon: 'email'
        }
      ],
      'Entrepreneurship Club': [
        {
          name: 'Instagram',
          url: 'https://www.instagram.com/su__entrepreneurshipclub/?hl=en',
          icon: 'instagram'
        },
        {
          name: 'Email',
          url: 'mailto:Entclub@studentorgs.suffolk.edu',
          icon: 'email'
        }
      ]
    };

    return socialLinks[clubName] || [];
  };

  const socialMediaLinks = event ? getSocialMediaLinks(event.clubName) : [];
  
  // Get eboard members for clubs
  const getEboard = (clubName: string) => {
    const eboardData: Record<string, any[]> = {
      'South Asian Student Association (SASA)': [
        {
          id: 1,
          name: 'Vansh Khanna',
          position: 'President',
          image: 'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University/Clubs/endorsed/South+Asian+Student+Association/by_year/2025_2026/eboard/people/su_boston_south_asian_student_association_eboard_president_vansh_khanna_2025_09_20_src_linkedin_v01.png',
          linkedin: 'https://www.linkedin.com/in/vansh-khanna-profile',
          email: 'vansh.khanna@suffolk.edu'
        }
      ],
      'The Suffolk Journal': [],
      'Entrepreneurship Club': [
        {
          id: 1,
          name: 'Aman Patel',
          position: 'President',
          image: 'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University/Clubs/endorsed/Entrepreneurship+Club/by_year/2025_2026/eboard/people/su_boston_entrepreneurship_club_eboard_president_aman_patel_2025_09_20_src_ig_v01.png'
        },
        {
          id: 2,
          name: 'Peter Chareas',
          position: 'Vice President',
          image: 'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University/Clubs/endorsed/Entrepreneurship+Club/by_year/2025_2026/eboard/people/su_boston_entrepreneurship_club_eboard_vice_president_peter_chareas_2025_09_20_src_ig_v01.png'
        },
        {
          id: 3,
          name: 'Kroren Abdusalam',
          position: 'Treasurer',
          image: 'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University/Clubs/endorsed/Entrepreneurship+Club/by_year/2025_2026/eboard/people/su_boston_entrepreneurship_club_eboard_treasurer_kroren_abdusalam_2025_09_20_src_ig_v01.png'
        },
        {
          id: 4,
          name: 'Andy Dong',
          position: 'Secretary',
          image: 'https://f005.backblazeb2.com/file/4wallsdorms/Suffolk+University/Clubs/endorsed/Entrepreneurship+Club/by_year/2025_2026/eboard/people/su_boston_entrepreneurship_club_eboard_secretary_andy_dong_2025_09_20_src_ig_v01.png'
        }
      ]
    };

    return eboardData[clubName] || [];
  };

  const eboardMembers = event ? getEboard(event.clubName) : [];
  
  // Tab configuration
  const tabs = [
    { id: 'Updates', label: 'Updates' },
    { id: 'Overview', label: 'Overview' },
    { id: 'Meetings', label: 'Meetings' },
    { id: 'Events', label: 'Events' },
    { id: 'Eboard', label: 'Eboard' },
    { id: 'Job application', label: jobTabTitle }
  ];

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Update indicator position when activeTab changes
  useEffect(() => {
    if (isOpen && event) {
      // Use setTimeout to ensure DOM is rendered
      setTimeout(() => {
        const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
        const activeTabRef = tabRefs.current[activeIndex];
        
        if (activeTabRef) {
          const container = activeTabRef.parentElement;
          if (container) {
            const containerRect = container.getBoundingClientRect();
            const tabRect = activeTabRef.getBoundingClientRect();
            
            setIndicatorStyle({
              left: tabRect.left - containerRect.left,
              width: tabRect.width
            });
          }
        }
      }, 0);
    }
  }, [activeTab, isOpen, event]);

  // Load Instagram embed script
  useEffect(() => {
    if (isOpen && event) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup script when component unmounts
        const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  // Helper function to format time
  const formatTime = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const formatTimeRange = (startTime: string, endTime: string): string => {
    return `${formatTime(startTime)} – ${formatTime(endTime)}`;
  };

  // Helper function to ensure AA contrast
  const ensureContrast = (color: string): string => {
    // Simple contrast check - if color is too light, darken it
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // If too light (luminance > 0.7), darken the color
    if (luminance > 0.7) {
      const darkenFactor = 0.6;
      const newR = Math.round(r * darkenFactor);
      const newG = Math.round(g * darkenFactor);
      const newB = Math.round(b * darkenFactor);
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    return color;
  };

  // Get profile image URL based on club
  const getProfileImage = (clubName: string): string => {
    const profileImages: Record<string, string> = {
      'The Suffolk Journal': 'https://f005.backblazeb2.com/file/4wallsdorms/clubs/suffolk+journal/suffolkjournalinstprofile.png',
      'South Asian Student Association (SASA)': 'https://f005.backblazeb2.com/file/4wallsdorms/clubs/South+Asian+Student+Association/SouthAsianStudentAssociationprofile.png',
      'Entrepreneurship Club': 'https://f005.backblazeb2.com/file/4wallsdorms/clubs/entrepreneurship+club/entprofile.png'
    };
    
    return profileImages[clubName] || 'https://f005.backblazeb2.com/file/4wallsdorms/clubs/default/default-club-profile.png';
  };

  // Get meeting frequency text
  const getMeetingFrequency = (clubName: string): string => {
    if (clubName.includes('SASA')) return 'Thursdays · Bi-Weekly';
    if (clubName.includes('Suffolk Journal') || clubName.includes('Entrepreneurship')) return 'Tuesdays · Weekly';
    return 'Weekly'; // default
  };

  // Mock data for demonstration - in a real app, this would come from the event or API
  const getClubDetails = (clubName: string) => {
    const clubDetails: Record<string, any> = {
      'South Asian Student Association (SASA)': {
        description: 'A vibrant community celebrating South Asian culture through events, discussions, and cultural activities.',
        primaryContact: 'SASA President',
        email: 'sasa@suffolk.edu',
        instagram: 'suffolk_sasa',
        discord: 'SASA Suffolk'
      },
      'The Suffolk Journal': {
        description: 'Suffolk University\'s official student newspaper, covering campus news, events, and student life.',
        primaryContact: 'Editor-in-Chief',
        email: 'journal@suffolk.edu',
        instagram: 'suffolkjournal',
        discord: 'Suffolk Journal'
      },
      'Entrepreneurship Club': {
        description: 'Fostering innovation and business development through networking, workshops, and startup planning.',
        primaryContact: 'Club President',
        email: 'entrepreneurship@suffolk.edu',
        instagram: 'suffolk_entrepreneurship',
        discord: 'Suffolk Entrepreneurship'
      }
    };
    
    return clubDetails[clubName] || {
      description: 'TBD',
      primaryContact: 'TBD',
      email: 'TBD',
      instagram: 'TBD',
      discord: 'TBD'
    };
  };

  const clubColor = ensureContrast(event.clubAccentColor);
  const clubDetails = getClubDetails(event.clubName);



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4 flex flex-col"
        style={{ 
          borderColor: event.clubAccentColor, 
          borderWidth: '3px',
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px ${event.clubAccentColor}20`
        }}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-white">
          <div className="flex justify-between items-center gap-6">
            {/* Left Column - Text */}
            <div className="flex-1 min-w-0">
              {/* Club Name */}
              <h2 
                className="text-2xl font-bold truncate mb-2"
                style={{ color: clubColor }}
              >
                {(() => {
                  // Check if this is a general meeting or an event
                  const isGeneralMeeting = event.title.toLowerCase().includes('general meeting') || 
                                         event.title.toLowerCase().includes('meeting');
                  
                  if (isGeneralMeeting) {
                    return event.clubName;
                  } else {
                    return `${event.clubName} Event`;
                  }
                })()}
              </h2>
              
              {(() => {
                // Check if this is a general meeting or an event
                const isGeneralMeeting = event.title.toLowerCase().includes('general meeting') || 
                                       event.title.toLowerCase().includes('meeting');
                
                if (isGeneralMeeting) {
                  // General Meeting Format
                  return (
                    <>
                      {/* Meta Row 1 - Day/Frequency */}
                      <div className="flex items-center gap-2 mb-1">
                        <svg 
                          className="w-4 h-4 flex-shrink-0 text-gray-600" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-base font-medium text-gray-600">
                          {getMeetingFrequency(event.clubName)}
                        </span>
                      </div>
                      
                      {/* Meta Row 2 - Time */}
                      <div className="flex items-center gap-2 mb-2">
                        <svg 
                          className="w-4 h-4 flex-shrink-0 text-gray-600" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-base font-medium text-gray-600">
                          {formatTimeRange(event.startTime, event.endTime)}
                        </span>
                      </div>
                      
                      {/* Meta Row 3 - Building */}
                      <div className="flex items-center gap-2 mb-1">
                        <svg 
                          className="w-4 h-4 flex-shrink-0 text-gray-600" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-base font-medium text-gray-600">
                          {event.building}
                        </span>
                      </div>
                      
                      {/* Meta Row 4 - Room */}
                      <div className="flex items-center gap-2">
                        <svg 
                          className="w-4 h-4 flex-shrink-0 text-gray-600" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14h8" />
                        </svg>
                        <span className="text-base font-medium text-gray-600">
                          {event.room}
                        </span>
                      </div>
                    </>
                  );
                } else {
                  // Event Format
                  const eventDate = new Date(event.date);
                  const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
                  const formattedDate = eventDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  });
                  
                  return (
                    <>
                      {/* Meta Row 1 - Day and Date */}
                      <div className="flex items-center gap-2 mb-1">
                        <svg 
                          className="w-4 h-4 flex-shrink-0 text-gray-600" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-base font-medium text-gray-600">
                          {dayOfWeek}, {formattedDate}
                        </span>
                      </div>
                      
                      {/* Meta Row 2 - Time */}
                      <div className="flex items-center gap-2 mb-2">
                        <svg 
                          className="w-4 h-4 flex-shrink-0 text-gray-600" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-base font-medium text-gray-600">
                          {formatTimeRange(event.startTime, event.endTime)}
                        </span>
                      </div>
                      
                      {/* Meta Row 3 - Building */}
                      <div className="flex items-center gap-2 mb-1">
                        <svg 
                          className="w-4 h-4 flex-shrink-0 text-gray-600" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-base font-medium text-gray-600">
                          {event.building}
                        </span>
                      </div>
                      
                      {/* Meta Row 4 - Room */}
                      <div className="flex items-center gap-2">
                        <svg 
                          className="w-4 h-4 flex-shrink-0 text-gray-600" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14h8" />
                        </svg>
                        <span className="text-base font-medium text-gray-600">
                          {event.room}
                        </span>
                      </div>
                    </>
                  );
                }
              })()}
            </div>

            {/* Right Column - Profile Picture */}
            <div className="flex items-center gap-4">
              <img
                src={getProfileImage(event.clubName)}
                alt={`${event.clubName} profile image`}
                className="rounded-full object-cover border-2 shadow-md"
                style={{ 
                  borderColor: event.clubAccentColor,
                  width: '140px',
                  height: '140px'
                }}
                onError={(e) => {
                  // Fallback to a default avatar if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(event.clubName)}&background=${event.clubAccentColor.replace('#', '')}&color=ffffff&size=140`;
                }}
              />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                title="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

          {/* Content Area with Tabs */}
          <div className="px-8 py-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            {/* Event/Meeting Description Section */}
            <div className="mb-6">
              <div 
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                style={{ borderColor: `${event.clubAccentColor}30` }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-1 h-full rounded-full flex-shrink-0 mt-1"
                    style={{ backgroundColor: event.clubAccentColor }}
                  ></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      {(() => {
                        const isGeneralMeeting = event.title.toLowerCase().includes('general meeting') || 
                                               event.title.toLowerCase().includes('meeting');
                        return isGeneralMeeting ? 'Meeting Details' : 'Event Details';
                      })()}
                    </h3>
                    <div className="text-gray-800 leading-relaxed">
                      {(() => {
                        // Check if this is the special November 18th Entrepreneurship Club meeting
                        // Parse dates to handle different formats (e.g., 'November 18, 2025' or '2025-11-18')
                        const eventDate = new Date(event.date);
                        const targetDate = new Date('2025-11-18');
                        const isSameDate = eventDate.getFullYear() === targetDate.getFullYear() &&
                                          eventDate.getMonth() === targetDate.getMonth() &&
                                          eventDate.getDate() === targetDate.getDate();
                        
                        // Extract start time - handle both '12:30' (24-hour) and '12:30 PM - 1:45 PM' formats
                        const startTimeMatch = event.startTime.match(/^(\d{1,2}):(\d{2})/);
                        const isCorrectTime = startTimeMatch && 
                                             ((startTimeMatch[1] === '12' && startTimeMatch[2] === '30') ||
                                              (event.startTime === '12:30'));
                        
                        const isSpecialMeeting = event.clubName === 'Entrepreneurship Club' && 
                                               isSameDate && 
                                               isCorrectTime;
                        
                        if (isSpecialMeeting) {
                          return (
                            <p>goal setting for spring and celebration</p>
                          );
                        } else {
                          // Default text for all other meetings
                          return (
                            <div className="flex items-center gap-3">
                              <p className="flex-1">Leaders of Club or Org can update by E-mailing</p>
                              <a
                                href={`mailto:4wallsdormscalendar@gmail.com?subject=${encodeURIComponent(`${event.clubName} Meeting Details`)}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email
                              </a>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
            <div className="relative">
              <div className="flex items-center gap-8 mb-4">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    ref={(el) => { tabRefs.current[index] = el; }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-lg font-medium transition-colors duration-300 ${
                      activeTab === tab.id 
                        ? 'text-gray-900' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* Tab Indicator */}
              <div className="relative">
                <div className="w-full h-px bg-gray-300"></div>
                <div 
                  className="absolute top-0 h-1 rounded-full transition-all duration-500 ease-in-out"
                  style={{ 
                    backgroundColor: event.clubAccentColor,
                    left: `${indicatorStyle.left}px`,
                    width: `${indicatorStyle.width}px`
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px] max-h-[300px] overflow-y-auto">
              {activeTab === 'Updates' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Updates</h3>
                  {(() => {
                    const updates = event ? getUpdates(event.clubName) : [];
                    return updates.length > 0 ? (
                      <div className="space-y-4">
                        {updates.map((update) => (
                          <div key={update.id} className="space-y-2">
                            <div className="flex items-center">
                              <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                {update.date}
                                {update.time && ` • ${update.time}`}
                              </div>
                            </div>
                            <div 
                              className="rounded-lg p-4 border-2"
                              style={{
                                backgroundColor: `${event?.clubAccentColor}20`,
                                borderColor: event?.clubAccentColor
                              }}
                            >
                              <p className="text-gray-800">
                                {event?.clubName === 'Entrepreneurship Club' ? (
                                  update.content
                                ) : (
                                  <>
                                    <strong>{event?.clubName}</strong> {update.content}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500 text-lg mb-4">Contact us to add</p>
                        <a
                          href={`mailto:4WallsDormsCalendar@gmail.com?subject=${encodeURIComponent(`${event.clubName} Updates`)}`}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email
                        </a>
                      </div>
                    );
                  })()}
                </div>
              )}
            
            {activeTab === 'Overview' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
                {(() => {
                  const overview = event ? getOverview(event.clubName) : { content: 'Contact us to add overview content', source: null };
                  return overview.content === 'Contact us to add overview content' ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500 text-lg mb-4">Contact us to add</p>
                      <a
                        href={`mailto:4WallsDormsCalendar@gmail.com?subject=${encodeURIComponent(`${event.clubName} Overview`)}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                          {overview.content}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500 italic">
                          {overview.source}
                        </div>
                        <a
                          href="mailto:4WallsDormsCalendar@gmail.com"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Change Overview
                        </a>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            
            {activeTab === 'Meetings' && (
              <div className="space-y-6">
                {(() => {
                  const meetings = event ? getMeetings(event.clubName) : [];
                  if (meetings.length === 0) {
                    return (
                      <div className="text-center py-6">
                        <p className="text-gray-500 text-lg mb-4">Contact us to add</p>
                        <a
                          href={`mailto:4WallsDormsCalendar@gmail.com?subject=${encodeURIComponent(`${event.clubName} Meetings`)}`}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email
                        </a>
                      </div>
                    );
                  }

                  const today = new Date();
                  const futureMeetings = meetings.filter(meeting => new Date(meeting.date) >= today);
                  const pastMeetings = meetings.filter(meeting => new Date(meeting.date) < today);

                  const renderMeeting = (meeting: any) => {
                    const handleMeetingClick = () => {
                      // Close the modal first
                      onClose();
                      // Navigate to the specific date
                      // Parse date string like "September 16, 2025"
                      const dateParts = meeting.date.split(' ');
                      const monthName = dateParts[0];
                      const day = parseInt(dateParts[1].replace(',', ''));
                      const year = parseInt(dateParts[2]);
                      
                      // Convert month name to number
                      const monthMap: { [key: string]: number } = {
                        'January': 1, 'February': 2, 'March': 3, 'April': 4,
                        'May': 5, 'June': 6, 'July': 7, 'August': 8,
                        'September': 9, 'October': 10, 'November': 11, 'December': 12
                      };
                      
                      const month = monthMap[monthName];
                      
                      // Navigate to the calendar page with the specific date
                      window.location.href = `/suffolk-campus-event-calendar?date=${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    };

                    return (
                      <div key={meeting.id} className="space-y-2">
                        <div className="flex items-center">
                          <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                            {meeting.date}
                          </div>
                        </div>
                        <button 
                          onClick={handleMeetingClick}
                          className="w-full rounded-lg px-8 py-4 border-2 hover:shadow-md transition-all duration-200 cursor-pointer text-left"
                          style={{
                            backgroundColor: `${event?.clubAccentColor}20`,
                            borderColor: event?.clubAccentColor
                          }}
                        >
                          <div className="text-base font-medium text-gray-900 mb-1">
                            {meeting.time}
                          </div>
                          <div 
                            className="text-sm font-bold text-gray-800 px-2 py-1 rounded mb-1 inline-block"
                            style={{ backgroundColor: `${event?.clubAccentColor}30` }}
                          >
                            {meeting.title}
                          </div>
                          <div className="text-xs text-gray-600 mb-1">
                            {meeting.description}
                          </div>
                          <div className="text-xs font-bold text-gray-600">
                            {meeting.location}
                          </div>
                        </button>
                      </div>
                    );
                  };

                  return (
                    <div className="space-y-6">
                      {/* Future Meetings */}
                      {futureMeetings.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold text-gray-800 mb-3">Future Meetings</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                            {futureMeetings.slice(0, futureMeetingsVisible).map(renderMeeting)}
                          </div>
                          {futureMeetings.length > futureMeetingsVisible && (
                            <button
                              onClick={() => setFutureMeetingsVisible(prev => prev + 4)}
                              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors mt-4"
                            >
                              Show More ({futureMeetings.length - futureMeetingsVisible} remaining)
                            </button>
                          )}
                        </div>
                      )}

                      {/* Past Meetings */}
                      {pastMeetings.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold text-gray-800 mb-3">Past Meetings</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                            {pastMeetings.slice(0, pastMeetingsVisible).map(renderMeeting)}
                          </div>
                          {pastMeetings.length > pastMeetingsVisible && (
                            <button
                              onClick={() => setPastMeetingsVisible(prev => prev + 4)}
                              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors mt-4"
                            >
                              Show More ({pastMeetings.length - pastMeetingsVisible} remaining)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
            
            {activeTab === 'Events' && (
              <div className="space-y-6">
                {(() => {
                  const events = event ? getEvents(event.clubName) : [];
                  if (events.length === 0) {
                    return (
                      <div className="text-center py-6">
                        <p className="text-gray-500 text-lg mb-4">Contact us to add</p>
                        <a
                          href={`mailto:4WallsDormsCalendar@gmail.com?subject=${encodeURIComponent(`${event.clubName} Events`)}`}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email
                        </a>
                      </div>
                    );
                  }

                  const today = new Date();
                  const futureEvents = events.filter(eventItem => new Date(eventItem.date) >= today);
                  const pastEvents = events.filter(eventItem => new Date(eventItem.date) < today);

                  const renderEvent = (eventItem: any) => {
                    const handleEventClick = () => {
                      // Close the modal first
                      onClose();
                      // Navigate to the specific date
                      // Parse date string like "September 9, 2025"
                      const dateParts = eventItem.date.split(' ');
                      const monthName = dateParts[0];
                      const day = parseInt(dateParts[1].replace(',', ''));
                      const year = parseInt(dateParts[2]);
                      
                      // Convert month name to number
                      const monthMap: { [key: string]: number } = {
                        'January': 1, 'February': 2, 'March': 3, 'April': 4,
                        'May': 5, 'June': 6, 'July': 7, 'August': 8,
                        'September': 9, 'October': 10, 'November': 11, 'December': 12
                      };
                      
                      const month = monthMap[monthName];
                      
                      // Navigate to the calendar page with the specific date
                      window.location.href = `/suffolk-campus-event-calendar?date=${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    };

                    return (
                      <div key={eventItem.id} className="space-y-2">
                        <div className="flex items-center">
                          <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                            {eventItem.date}
                          </div>
                        </div>
                        <button 
                          onClick={handleEventClick}
                          className="w-full rounded-lg px-8 py-4 border-2 hover:shadow-md transition-all duration-200 cursor-pointer text-left"
                          style={{
                            backgroundColor: `${event?.clubAccentColor}20`,
                            borderColor: event?.clubAccentColor
                          }}
                        >
                          <div className="text-base font-medium text-gray-900 mb-1">
                            {eventItem.time}
                          </div>
                          <div 
                            className="text-sm font-bold text-gray-800 px-2 py-1 rounded mb-1 inline-block"
                            style={{ backgroundColor: `${event?.clubAccentColor}30` }}
                          >
                            {eventItem.title}
                          </div>
                          <div className="text-xs text-gray-600 mb-1">
                            {eventItem.description}
                          </div>
                          <div className="text-xs font-bold text-gray-600">
                            {eventItem.location}
                          </div>
                        </button>
                      </div>
                    );
                  };

                  return (
                    <div className="space-y-6">
                      {/* Future Events */}
                      {futureEvents.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold text-gray-800 mb-3">Future Events</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                            {futureEvents.slice(0, futureEventsVisible).map(renderEvent)}
                          </div>
                          {futureEvents.length > futureEventsVisible && (
                            <button
                              onClick={() => setFutureEventsVisible(prev => prev + 4)}
                              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors mt-4"
                            >
                              Show More ({futureEvents.length - futureEventsVisible} remaining)
                            </button>
                          )}
                        </div>
                      )}

                      {/* Past Events */}
                      {pastEvents.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold text-gray-800 mb-3">Past Events</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                            {pastEvents.slice(0, pastEventsVisible).map(renderEvent)}
                          </div>
                          {pastEvents.length > pastEventsVisible && (
                            <button
                              onClick={() => setPastEventsVisible(prev => prev + 4)}
                              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors mt-4"
                            >
                              Show More ({pastEvents.length - pastEventsVisible} remaining)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
            
            {activeTab === 'Eboard' && (
              <div className="py-6">
                {eboardMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {eboardMembers.map((member) => (
                      <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-48 h-60 rounded-lg overflow-hidden mb-4 border-2 border-gray-200 shadow-sm">
                            <img
                              src={member.image}
                              alt={`${member.name} - ${member.position}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/300x375/cccccc/666666?text=Photo';
                              }}
                            />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{member.position}</p>
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                              LinkedIn
                            </a>
                          )}
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm mt-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              Email
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-lg mb-4">Contact us to add e-board information</p>
                    <a
                      href={`mailto:4WallsDormsCalendar@gmail.com?subject=${encodeURIComponent(`${event.clubName} Eboard`)}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email Us
                    </a>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'Job application' && (
              <div className="text-center py-6">
                <p className="text-gray-500 text-lg mb-4">Contact us to add</p>
                <a
                  href={`mailto:4WallsDormsCalendar@gmail.com?subject=${encodeURIComponent(`${event.clubName} Job Application`)}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              </div>
            )}
          </div>

          {/* Social Media Section - Always Visible */}
          <div className="mt-6 pt-6 border-t border-gray-200 px-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>

            {socialMediaLinks.length > 0 ? (
              <div className="flex gap-3">
                {socialMediaLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target={link.icon !== 'email' ? '_blank' : undefined}
                    rel={link.icon !== 'email' ? 'noopener noreferrer' : undefined}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md ${
                      link.icon === 'instagram' ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:shadow-lg' :
                      link.icon === 'linkedin' ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg' :
                      link.icon === 'website' ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg' :
                      'bg-gray-600 hover:bg-gray-700 hover:shadow-lg'
                    }`}
                    title={`${event.clubName} ${link.name}`}
                  >
                    {link.icon === 'instagram' && (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )}
                    {link.icon === 'linkedin' && (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )}
                    {link.icon === 'website' && (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                    )}
                    {link.icon === 'email' && (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Contact us to add</p>
                <a
                  href={`mailto:4WallsDormsCalendar@gmail.com?subject=${encodeURIComponent(`${event.clubName} Social Media`)}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              </div>
            )}
          </div>

          {/* Instagram Embed Section - Always Visible */}
          <div className="mt-6 pt-6 border-t border-gray-200 px-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest from Instagram</h3>
            
            <div className="flex justify-center">
              <blockquote 
                className="instagram-media" 
                data-instgrm-permalink="https://www.instagram.com/suffolkusasa/?utm_source=ig_embed&amp;utm_campaign=loading" 
                data-instgrm-version="14" 
                style={{ 
                  background: '#FFF', 
                  border: '0', 
                  borderRadius: '3px', 
                  boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', 
                  margin: '1px', 
                  maxWidth: '540px', 
                  minWidth: '326px', 
                  padding: '0', 
                  width: 'calc(100% - 2px)'
                }}
              >
                <div style={{ padding: '16px' }}>
                  <a 
                    href="https://www.instagram.com/suffolkusasa/?utm_source=ig_embed&amp;utm_campaign=loading" 
                    style={{ 
                      background: '#FFFFFF', 
                      lineHeight: '0', 
                      padding: '0 0', 
                      textAlign: 'center', 
                      textDecoration: 'none', 
                      width: '100%'
                    }} 
                    target="_blank"
                  >
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <div style={{ backgroundColor: '#F4F4F4', borderRadius: '50%', flexGrow: '0', height: '40px', marginRight: '14px', width: '40px' }}></div>
                      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', justifyContent: 'center' }}>
                        <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: '0', height: '14px', marginBottom: '6px', width: '100px' }}></div>
                        <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: '0', height: '14px', width: '60px' }}></div>
                      </div>
                    </div>
                    <div style={{ padding: '19% 0' }}></div>
                    <div style={{ display: 'block', height: '50px', margin: '0 auto 12px', width: '50px' }}>
                      <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink">
                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                            <g>
                              <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <div style={{ paddingTop: '8px' }}>
                      <div style={{ color: '#3897f0', fontFamily: 'Arial,sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: '550', lineHeight: '18px' }}>View this profile on Instagram</div>
                    </div>
                    <div style={{ padding: '12.5% 0' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '14px', alignItems: 'center' }}>
                      <div>
                        <div style={{ backgroundColor: '#F4F4F4', borderRadius: '50%', height: '12.5px', width: '12.5px', transform: 'translateX(0px) translateY(7px)' }}></div>
                        <div style={{ backgroundColor: '#F4F4F4', height: '12.5px', transform: 'rotate(-45deg) translateX(3px) translateY(1px)', width: '12.5px', flexGrow: '0', marginRight: '14px', marginLeft: '2px' }}></div>
                        <div style={{ backgroundColor: '#F4F4F4', borderRadius: '50%', height: '12.5px', width: '12.5px', transform: 'translateX(9px) translateY(-18px)' }}></div>
                      </div>
                      <div style={{ marginLeft: '8px' }}>
                        <div style={{ backgroundColor: '#F4F4F4', borderRadius: '50%', flexGrow: '0', height: '20px', width: '20px' }}></div>
                        <div style={{ width: '0', height: '0', borderTop: '2px solid transparent', borderLeft: '6px solid #f4f4f4', borderBottom: '2px solid transparent', transform: 'translateX(16px) translateY(-4px) rotate(30deg)' }}></div>
                      </div>
                      <div style={{ marginLeft: 'auto' }}>
                        <div style={{ width: '0px', borderTop: '8px solid #F4F4F4', borderRight: '8px solid transparent', transform: 'translateY(16px)' }}></div>
                        <div style={{ backgroundColor: '#F4F4F4', flexGrow: '0', height: '12px', width: '16px', transform: 'translateY(-4px)' }}></div>
                        <div style={{ width: '0', height: '0', borderTop: '8px solid #F4F4F4', borderLeft: '8px solid transparent', transform: 'translateY(-4px) translateX(8px)' }}></div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', justifyContent: 'center', marginBottom: '24px' }}>
                      <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: '0', height: '14px', marginBottom: '6px', width: '224px' }}></div>
                      <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: '0', height: '14px', width: '144px' }}></div>
                    </div>
                  </a>
                  <p style={{ color: '#c9c8cd', fontFamily: 'Arial,sans-serif', fontSize: '14px', lineHeight: '17px', marginBottom: '0', marginTop: '8px', overflow: 'hidden', padding: '8px 0 7px', textAlign: 'center', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href="https://www.instagram.com/suffolkusasa/?utm_source=ig_embed&amp;utm_campaign=loading" style={{ color: '#c9c8cd', fontFamily: 'Arial,sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: 'normal', lineHeight: '17px' }} target="_blank">South Asian Student Association</a> (@<a href="https://www.instagram.com/suffolkusasa/?utm_source=ig_embed&amp;utm_campaign=loading" style={{ color: '#c9c8cd', fontFamily: 'Arial,sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: 'normal', lineHeight: '17px' }} target="_blank">suffolkusasa</a>) • Instagram photos and videos
                  </p>
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;