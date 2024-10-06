import DayDetails from './../components/DayDetails';
import Breadcrumb from './../components/Breadcrumb';

export default function DayPage({ params }: { params: { daySlug: string } }) {
  return (
    <div className="h-full overflow-hidden">
      <Breadcrumb />
      <DayDetails daySlug={params.daySlug} />
    </div>
  );
}
