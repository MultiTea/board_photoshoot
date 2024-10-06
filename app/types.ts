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

export interface Slot {
  id: number;
  attributes: {
    start_date: string;
    end_date: string;
    booked_by: string | null;
    guests: number | null;
    checked_in: boolean;
  };
}