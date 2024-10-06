'use client';

import { Slot } from '../types';

interface SlotListProps {
  slots: Slot[];
  currentSlotId: number | null;
  onSlotSelect: (slotId: number) => void;
}

export default function SlotList({
  slots,
  currentSlotId,
  onSlotSelect,
}: SlotListProps) {
  return (
    <div className="w-1/6 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 sticky top-0 z-10 py-2">
        Tous les créneaux
      </h2>
      <div className="overflow-y-auto">
        <ul>
          {slots.map((slot) => (
            <li
              key={slot.id}
              className={`cursor-pointer p-2 ${
                slot.id === currentSlotId ? 'bg-blue-600' : ''
              }`}
              onClick={() => onSlotSelect(slot.id)}
            >
              {new Date(slot.attributes.start_date).toLocaleTimeString()} -
              {new Date(slot.attributes.end_date).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
