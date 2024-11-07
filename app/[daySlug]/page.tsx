import DayDetails from './../components/DayDetails';
import Breadcrumb from './../components/Breadcrumb';
import { Event } from './../types';
import Clock from './../components/Clock';

export default function DayPage({ params }: { params: { daySlug: string } }) {
  return (
    <div className="h-dvh px-10">
      <div className="flex justify-between pt-16">
        <Breadcrumb />
        <Clock />
      </div>
      <DayDetails daySlug={params.daySlug} />
    </div>
  );
}

interface ApiResponse {
  data: Event[];
}

export async function generateStaticParams() {
  const response = await fetch(
    'https://data.fblacklight.org/api/events?filters[id][$in][0]=252&filters[id][$in][1]=253&filters[id][$in][2]=254&filters[id][$in][3]=255&populate=*'
  );
  const data: ApiResponse = await response.json();

  return data.data.map((event: Event) => {
    const date = new Date(event.attributes.start_date);
    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
    const dayNumber = date.getDate();
    return {
      daySlug: `${dayName}-${dayNumber}`,
    };
  });
}
