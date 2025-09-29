
import { courses, Course } from './courses';

export type Batch = {
  id: string;
  courseId: string;
  startDate: string;
  endDate: string;
  time: string;
  status: 'Live' | 'Upcoming';
};

export { type Course, courses };

export const batches: Batch[] = [
  {
    id: 'b-c1-1',
    courseId: 'c1',
    startDate: '2025-10-15',
    endDate: '2025-11-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c1-2',
    courseId: 'c1',
    startDate: '2025-11-15',
    endDate: '2025-12-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c2-1',
    courseId: 'c2',
    startDate: '2025-10-15',
    endDate: '2025-11-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c2-2',
    courseId: 'c2',
    startDate: '2025-11-15',
    endDate: '2025-12-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c3-1',
    courseId: 'c3',
    startDate: '2025-10-15',
    endDate: '2025-11-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c3-2',
    courseId: 'c3',
    startDate: '2025-11-15',
    endDate: '2025-12-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c4-1',
    courseId: 'c4',
    startDate: '2025-10-15',
    endDate: '2025-11-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c4-2',
    courseId: 'c4',
    startDate: '2025-11-15',
    endDate: '2025-12-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c5-1',
    courseId: 'c5',
    startDate: '2025-10-15',
    endDate: '2025-11-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c5-2',
    courseId: 'c5',
    startDate: '2025-11-15',
    endDate: '2025-12-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c6-1',
    courseId: 'c6',
    startDate: '2025-10-15',
    endDate: '2025-11-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c6-2',
    courseId: 'c6',
    startDate: '2025-11-15',
    endDate: '2025-12-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c7-1',
    courseId: 'c7',
    startDate: '2025-10-15',
    endDate: '2025-11-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c7-2',
    courseId: 'c7',
    startDate: '2025-11-15',
    endDate: '2025-12-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c8-1',
    courseId: 'c8',
    startDate: '2025-10-15',
    endDate: '2025-11-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
  {
    id: 'b-c8-2',
    courseId: 'c8',
    startDate: '2025-11-15',
    endDate: '2025-12-15',
    time: '6:00 PM - 8:00 PM (Mon-Fri)',
    status: 'Upcoming',
  },
];

export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};

    
