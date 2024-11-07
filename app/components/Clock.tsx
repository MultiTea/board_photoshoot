'use client';

import React, { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  const date = new Date();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute flex flex-col justify-end top-6 right-6">
      <div className="text-5xl font-light text-left">
        {time.toLocaleTimeString()}
      </div>
      <div className="text-sm text-left relative left-2">
        {' '}
        {formatDate(date)}
      </div>
    </div>
  );
}
