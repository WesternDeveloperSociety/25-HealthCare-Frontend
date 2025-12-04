// data/mockClinics.ts
// Mock clinic data for Mapbox (uses [longitude, latitude] format)

export interface Clinic {
  id: string;
  name: string;
  address: string;
  specialty: string;
  coordinates: [number, number]; // [longitude, latitude] for Mapbox
  phone: string;
  hours: string;
}

export const mockClinics: Clinic[] = [
  {
    id: 'clinic-1',
    name: 'Bay Area Medical Center',
    address: '123 Market St, San Francisco, CA 94102',
    specialty: 'General Practice',
    coordinates: [-122.4194, 37.7749],
    phone: '(415) 555-0123',
    hours: 'Mon-Fri 8AM-6PM',
  },
  {
    id: 'clinic-2',
    name: 'Downtown Health Clinic',
    address: '456 Mission St, San Francisco, CA 94105',
    specialty: 'Urgent Care',
    coordinates: [-122.3988, 37.7897],
    phone: '(415) 555-0456',
    hours: 'Daily 7AM-10PM',
  },
  {
    id: 'clinic-3',
    name: 'Pacific Heights Medical',
    address: '789 California St, San Francisco, CA 94108',
    specialty: 'Cardiology',
    coordinates: [-122.4145, 37.7919],
    phone: '(415) 555-0789',
    hours: 'Mon-Fri 9AM-5PM',
  },
  {
    id: 'clinic-4',
    name: 'Marina District Clinic',
    address: '321 Chestnut St, San Francisco, CA 94123',
    specialty: 'Pediatrics',
    coordinates: [-122.4392, 37.8014],
    phone: '(415) 555-1011',
    hours: 'Mon-Sat 8AM-7PM',
  },
  {
    id: 'clinic-5',
    name: 'SOMA Medical Group',
    address: '654 Folsom St, San Francisco, CA 94107',
    specialty: 'Internal Medicine',
    coordinates: [-122.3989, 37.7819],
    phone: '(415) 555-1213',
    hours: 'Mon-Fri 8AM-6PM',
  },
  {
    id: 'clinic-6',
    name: 'Nob Hill Family Practice',
    address: '987 Powell St, San Francisco, CA 94108',
    specialty: 'Family Medicine',
    coordinates: [-122.4092, 37.7938],
    phone: '(415) 555-1415',
    hours: 'Mon-Fri 9AM-5PM',
  },
  {
    id: 'clinic-7',
    name: 'Richmond District Health',
    address: '147 Clement St, San Francisco, CA 94118',
    specialty: 'General Practice',
    coordinates: [-122.4668, 37.7829],
    phone: '(415) 555-1617',
    hours: 'Mon-Sat 8AM-8PM',
  },
  {
    id: 'clinic-8',
    name: 'Mission Bay Urgent Care',
    address: '258 Third St, San Francisco, CA 94107',
    specialty: 'Urgent Care',
    coordinates: [-122.3893, 37.7742],
    phone: '(415) 555-1819',
    hours: 'Daily 24 Hours',
  },
];
