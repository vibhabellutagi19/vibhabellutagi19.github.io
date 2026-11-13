import { AppLifecycle } from './AppLifecycle';
import { BookingRace } from './BookingRace';
import { DriverLocation } from './DriverLocation';
import { JobStages } from './JobStages';
import { NullFilter } from './NullFilter';
import { SessionSimulator } from './SessionSimulator';

// Interactive demos that posts embed with a `::demo[name]` line.
export const postDemos = {
  'app-lifecycle': AppLifecycle,
  'booking-race': BookingRace,
  'driver-location': DriverLocation,
  'job-stages': JobStages,
  'null-filter': NullFilter,
  'session-simulator': SessionSimulator,
};
