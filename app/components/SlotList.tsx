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
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  return (
    <div className="flex flex-col w-fit">
      <h2 className="text-xl font-bold sticky mb-4 px-2">Tous les créneaux</h2>
      <div className="flex flex-col flex-grow-0 backdrop-brightness-90 rounded-lg">
        <ul>
          {slots.map((slot) => (
            <li
              key={slot.id}
              className={`cursor-pointer p-2 ${
                slot.id === currentSlotId ? 'rounded-lg bg-blue-600' : ''
              }`}
              onClick={() => onSlotSelect(slot.id)}
            >
              {' '}
              {formatTime(slot.attributes.start_date)} ➺ 
              {formatTime(slot.attributes.end_date)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
