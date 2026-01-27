// data/mockMedications.ts
// Mock medication data for testing

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  startDate: string; // ISO date string
  duration: number; // days
  frequency: string;
  prescribedBy: string;
  instructions?: string;
}

// Get today's date in ISO format (YYYY-MM-DD)
const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const mockMedications: Medication[] = [
  {
    id: 'med-1',
    name: 'Lisinopril',
    dosage: '10mg',
    startDate: getToday(),
    duration: 30,
    frequency: 'Once daily',
    prescribedBy: 'Dr. Sarah Johnson',
    instructions: 'Take in the morning with water',
  },
  {
    id: 'med-2',
    name: 'Metformin',
    dosage: '500mg',
    startDate: getToday(),
    duration: 90,
    frequency: 'Twice daily',
    prescribedBy: 'Dr. Michael Chen',
    instructions: 'Take with meals',
  },
  {
    id: 'med-3',
    name: 'Atorvastatin',
    dosage: '20mg',
    startDate: getToday(),
    duration: 5,
    frequency: 'Once daily',
    prescribedBy: 'Dr. Sarah Johnson',
    instructions: 'Take at bedtime',
  },
  {
    id: 'med-4',
    name: 'Levothyroxine',
    dosage: '50mcg',
    startDate: getToday(),
    duration: 2,
    frequency: 'Once daily',
    prescribedBy: 'Dr. Emily Rodriguez',
    instructions: 'Take on empty stomach, 30 minutes before breakfast',
  },
];
