import { AttendeesGridProps, ParsedGuests } from '../types';
import AttendeeBadge from './AttendeeBadge';

const AttendeesGrid = ({ bookedBy, guests, attendees }: AttendeesGridProps) => {
  const parseGuests = (guests: string | number | null): ParsedGuests => {
    if (!guests) return [];
    if (typeof guests === 'number') return [guests];
    try {
      return JSON.parse(guests);
    } catch {
      return [parseInt(guests)];
    }
  };

  // Get all badges (booked_by + guests)
  const allBadges = [bookedBy, ...parseGuests(guests)].filter(
    (badge): badge is string | number => Boolean(badge)
  );

  // Find attendee info for each badge
  const attendeesList = allBadges
    .map((badge) =>
      attendees.find((a) => a.badge === parseInt(badge.toString()))
    )
    .filter((attendee): attendee is NonNullable<typeof attendee> =>
      Boolean(attendee)
    );

  if (attendeesList.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {attendeesList.map((attendee) => (
          <AttendeeBadge
            key={attendee.profileId}
            badge={attendee.badge}
            profileId={attendee.profileId}
            username={attendee.username}
          />
        ))}
      </div>
    </div>
  );
};

export default AttendeesGrid;
