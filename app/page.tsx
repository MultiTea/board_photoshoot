import EventList from './components/EventList';
import Breadcrumb from './components/Breadcrumb';

export default function Home() {
  return (
    <div>
      <Breadcrumb />
      <h1 className="text-2xl font-bold mb-4">Créneaux de Photoshoot</h1>
      <EventList />
    </div>
  );
}
