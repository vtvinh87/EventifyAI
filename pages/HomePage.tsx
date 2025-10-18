import React, { useState, useEffect } from 'react';
import { vi } from '../lang/vi';
import { Button } from '../components/ui/Button';
import { EventCard } from '../features/events/EventCard';
import { RecommendedEventsCarousel } from '../features/events/RecommendedEventsCarousel';
import { TrendingEventsGrid } from '../features/events/TrendingEventsGrid';
import { UpcomingEventsList } from '../features/events/UpcomingEventsList';
import { InteractiveMap } from '../features/events/InteractiveMap';
import { useEventStore } from '../stores/eventStore';

const HomePage: React.FC = () => {
  const { events, fetchEvents } = useEventStore();
  const [selectedCategory, setSelectedCategory] = useState(vi.home.all);

  useEffect(() => {
    // Chỉ tìm nạp nếu chưa có sự kiện nào trong store
    if (events.length === 0) {
      fetchEvents();
    }
  }, [fetchEvents, events.length]);
  
  const categories = [vi.home.all, vi.home.technology, vi.home.music, vi.home.workshop];
  
  const filteredEvents = events.filter(e => {
      return selectedCategory === vi.home.all || e.category === selectedCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter">{vi.home.title} <span className="text-brand-500">{vi.home.titleHighlight}</span></h1>
            <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">{vi.home.subtitle}</p>
        </div>
        
        <RecommendedEventsCarousel events={events.slice(0, 5)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-12">
          <div className="lg:col-span-2">
            <TrendingEventsGrid />
          </div>
          <div className="lg:col-span-1">
            <UpcomingEventsList />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-white">{vi.home.allEvents}</h2>
        </div>
        
        <div className="mb-8 flex justify-center flex-wrap gap-2">
            {categories.map((category) => (
                <Button key={category} variant={selectedCategory === category ? 'primary' : 'secondary'} onClick={() => setSelectedCategory(category)}>
                    {category}
                </Button>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => <EventCard key={event.id} event={event} />)}
        </div>

        <InteractiveMap />
    </div>
  );
};

export default HomePage;
