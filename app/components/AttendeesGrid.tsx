import { AttendeesGridProps, ParsedGuests } from '../types';
import AttendeeBadge from './AttendeeBadge';

const AttendeesGrid = ({ bookedBy, guests, attendees }: AttendeesGridProps) => {
  const parseGuests = (guests: string | number | null): ParsedGuests => {
    if (!guests) return [];

    if (typeof guests === 'number') return [guests];

    try {
      const parsed = JSON.parse(guests);
      return Array.isArray(parsed) ? parsed.map(Number) : [Number(parsed)];
    } catch {
      if (typeof guests === 'string' && guests.includes(',')) {
        return guests
          .split(',')
          .map((g) => Number(g.trim()))
          .filter((n) => !isNaN(n));
      }
      const num = Number(guests);
      return !isNaN(num) ? [num] : [];
    }
  };

  const bookerInfo = bookedBy
    ? attendees.find((a) => a.badge === Number(bookedBy))
    : null;

  const parsedGuests = parseGuests(guests);

  const guestsList = parsedGuests
    .map((badge) => {
      const guest = attendees.find((a) => a.badge === Number(badge));
      return guest;
    })
    .filter((attendee): attendee is NonNullable<typeof attendee> =>
      Boolean(attendee)
    );

  if (!bookerInfo && guestsList.length === 0) return null;

  return (
    <div className="flex flex-row flex-wrap gap-4 space-4 w-auto h-max overflow-y-auto">
      {/* Booker Section */}
      {bookerInfo && (
        <div className="grow-0 h-fit px-12 py-4 max-h-auto aspect-square border-2 border-red-500 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-red-500">
            Réservé par
          </h3>
          <div className="flex justify-center">
            <AttendeeBadge
              key={bookerInfo.profileId}
              badge={bookerInfo.badge}
              profileId={bookerInfo.profileId}
              username={bookerInfo.username}
            />
          </div>
        </div>
      )}

      {/* Guests Section */}
      {guestsList.length > 0 && (
        <div className="grow w-max-48 p-4 aspect-auto border-2 border-blue-500 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-500">Invités</h3>
          <div className="flex flex-row place-content-evenly flex-wrap gap-6">
            {guestsList.map((guest) => (
              <AttendeeBadge
                key={guest.profileId}
                badge={guest.badge}
                profileId={guest.profileId}
                username={guest.username}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeesGrid;
