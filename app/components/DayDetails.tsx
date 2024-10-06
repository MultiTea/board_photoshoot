'use client';

import { useState, useEffect } from 'react';
import { Event, Slot } from '../types';
import SlotList from './SlotList';

interface EventData {
  data: Event[];
}

export default function DayDetails({ daySlug }: { daySlug: string }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number>(0);

  useEffect(() => {
    fetch(
      'https://data.fblacklight.org/api/events?filters[id][$in][0]=252&filters[id][$in][1]=253&filters[id][$in][2]=254&filters[id][$in][3]=255&populate=*'
    )
      .then((response) => response.json())
      .then((data: EventData) => {
        const matchingEvent = data.data.find((e: Event) => {
          const d = new Date(e.attributes.start_date);
          const eventDaySlug = `${d.toLocaleDateString('fr-FR', {
            weekday: 'long',
          })}-${d.getDate()}`;
          return eventDaySlug === daySlug;
        });

        if (matchingEvent) {
          setEvent(matchingEvent);
          const allSlots = matchingEvent.attributes.vqs_slots.data;
          setSlots(allSlots);
          const now = new Date();
          const currentIndex = allSlots.findIndex(
            (slot: Slot) => new Date(slot.attributes.end_date) > now
          );
          setCurrentSlotIndex(currentIndex >= 0 ? currentIndex : 0);
        }
      });
  }, [daySlug]);

  const currentSlot = slots[currentSlotIndex];
  const nextSlot = slots[currentSlotIndex + 1];

  const goToPreviousSlot = () => {
    if (currentSlotIndex > 0) {
      setCurrentSlotIndex(currentSlotIndex - 1);
    }
  };

  const goToNextSlot = () => {
    if (currentSlotIndex < slots.length - 1) {
      setCurrentSlotIndex(currentSlotIndex + 1);
    }
  };

  const handleSlotSelect = (slotId: number) => {
    const index = slots.findIndex((slot) => slot.id === slotId);
    if (index !== -1) {
      setCurrentSlotIndex(index);
    }
  };

  if (!event) return <div>Chargement...</div>;

  return (
    <div className="flex h-[calc(100vh-4.5rem)]">
      <SlotList
        slots={slots}
        currentSlotId={currentSlot?.id || null}
        onSlotSelect={handleSlotSelect}
      />
      <div className="flex-grow p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">{event.attributes.name}</h1>
        <div className="flex justify-between mb-4">
          <button
            onClick={goToPreviousSlot}
            disabled={currentSlotIndex === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Précédent
          </button>
          <button
            onClick={goToNextSlot}
            disabled={currentSlotIndex === slots.length - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Suivant
          </button>
        </div>
        <div className="flex">
          <div className="px-2">
            <h2 className="text-xl font-bold m-2">Créneau actuel :</h2>
            {currentSlot && <SlotInfo slot={currentSlot} />}
          </div>
          <div className="px-2">
            <h2 className="text-xl font-bold m-2">Prochain créneau :</h2>
            {nextSlot && <SlotInfo slot={nextSlot} />}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SlotInfoProps {
  slot: Slot;
}

function SlotInfo({ slot }: SlotInfoProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copySlotInfo = () => {
    const info = `${slot.attributes.booked_by || 'Non réservé'} - ${
      slot.attributes.guests || 'Aucun'
    } -`;
    navigator.clipboard
      .writeText(info)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 400);
      })
      .catch((err) => {
        console.error('Erreur lors de la copie : ', err);
      });
  };

  return (
    <div className="bg-gray-800 p-4 rounded">
      <p>Début : {new Date(slot.attributes.start_date).toLocaleTimeString()}</p>
      <p>Fin : {new Date(slot.attributes.end_date).toLocaleTimeString()}</p>
      <p>Réservé par : {slot.attributes.booked_by || 'Non réservé'}</p>
      <p>Invités : {slot.attributes.guests || 'Aucun'}</p>
      <p>Check-in : {slot.attributes.checked_in ? 'Oui' : 'Non'}</p>
      <button
        onClick={copySlotInfo}
        className={`mt-2 p-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors duration-300 ${
          isCopied ? 'bg-blue-500' : 'bg-green-500 hover:bg-green-600'
        }`}
        aria-label="Copier les informations"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
    </div>
  );
}
