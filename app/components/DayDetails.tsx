'use client';

import { useState, useEffect } from 'react';
import { Event, Slot } from '../types';
import SlotList from './SlotList';
import AttendeesGrid from './AttendeesGrid';
import attendeesData from '../attendees.json';

interface EventData {
  data: Event[];
}

export default function DayDetails({ daySlug }: { daySlug: string }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number>(0);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  if (!event) return <div className="h-screen">Chargement...</div>;

  return (
    <div className="flex h-full w-full pb-8">
      <SlotList
        slots={slots}
        currentSlotId={currentSlot?.id || null}
        onSlotSelect={handleSlotSelect}
      />
      <div className="flex-grow pl-6">
        <h1 className="text-2xl font-bold mb-4">
          Créneau n°{currentSlot.id} de{' '}
          {formatTime(currentSlot.attributes.start_date)} à{' '}
          {formatTime(currentSlot.attributes.end_date)} :
        </h1>
        <div className="flex mb-4">
          <button
            onClick={goToPreviousSlot}
            disabled={currentSlotIndex === 0}
            className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Précédent
          </button>
          <button
            onClick={goToNextSlot}
            disabled={currentSlotIndex === slots.length - 1}
            className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Suivant
          </button>
        </div>
        <div>{currentSlot && <SlotInfo slot={currentSlot} />}</div>
      </div>
    </div>
  );
}

function SlotInfo({ slot }: { slot: Slot }) {
  const [isCopied, setIsCopied] = useState(false);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatGuests = (guests: string | number | null): string => {
    if (guests === null) return '';
    if (typeof guests === 'number') return guests.toString();

    try {
      const guestsArray = JSON.parse(guests);
      return Array.isArray(guestsArray) ? guestsArray.join(', ') : guests;
    } catch {
      return guests;
    }
  };

  const copySlotInfo = () => {
    const slotNumber = slot.id;
    const bookedBy = slot.attributes.booked_by || '';
    const guests = formatGuests(slot.attributes.guests);

    const parts = [slotNumber, bookedBy];

    if (guests) {
      parts.push(guests);
    }

    const info = parts.filter(Boolean).join(' • ');
    const finalString = info ? `${info}` : '';

    navigator.clipboard
      .writeText(finalString)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      })
      .catch((err) => {
        console.error('Erreur lors de la copie : ', err);
      });
  };

  return (
    <div className="flex flex-col gap-8">
      <button
        onClick={copySlotInfo}
        className={`p-2 text-white aspect-square size-10 rounded focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors duration-150 ${
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
      <AttendeesGrid
        bookedBy={slot.attributes.booked_by}
        guests={slot.attributes.guests}
        attendees={attendeesData}
      />
    </div>
  );
}
