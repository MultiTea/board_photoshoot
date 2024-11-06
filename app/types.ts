export interface Slot {
  id: number;
  attributes: {
    start_date: string;
    end_date: string;
    booked_by: string | null;
    guests: string | number | null;
    checked_in: boolean;
  };
}

export interface Event {
  id: number;
  attributes: {
    name: string;
    start_date: string;
    end_date: string;
    vqs_slots: {
      data: Slot[];
    };
  };
}

export interface Attendee {
  profileId: string;
  badge: number;
  username: string;
  country: string;
  color: string;
  badgeCreated: string | null;
}

// Props interfaces for components
export interface AttendeeBadgeProps {
  badge: number;
  profileId: string;
  username: string;
}

export interface AttendeesGridProps {
  bookedBy: string | null;
  guests: string | number | null;
  attendees: Attendee[];
}

export interface SlotInfoProps {
  slot: Slot;
}

// Type for parsed guests data
export type ParsedGuests = number[];