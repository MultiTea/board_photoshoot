'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Event } from '../types';

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch(
      'https://data.fblacklight.org/api/events?filters[id][$in][0]=252&filters[id][$in][1]=253&filters[id][$in][2]=254&filters[id][$in][3]=255&populate=*'
    )
      .then((response) => response.json())
      .then((data) => setEvents(data.data));
  }, []);

  const getDaySlug = (date: string) => {
    const d = new Date(date);
    const dayName = d.toLocaleDateString('fr-FR', { weekday: 'long' });
    const dayNumber = d.getDate();
    return `${dayName}-${dayNumber}`;
  };

  return (
    <div className="flex gap-8">
      {events.map((event, index) => {
        const daySlug = getDaySlug(event.attributes.start_date);
        return (
          <div key={event.id} className="flex">
            <Link
              href={`/${daySlug}`}
              className="px-4 py-2.5 rounded-md border border-cyan-700 hover:bg-blue-600"
            >
              <h2 className="text-xl font-bold">
                {event.attributes.name} #{index + 1}
              </h2>
              <p>
                {new Date(event.attributes.start_date).toLocaleDateString()}
              </p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
