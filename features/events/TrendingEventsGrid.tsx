
import React, { useState, useEffect } from 'react';
import type { Event } from '../../types';
// FIX: Correctly import getTrendingEvents which was added to the apiEvents service.
import { getTrendingEvents } from '../../services/apiEvents';
import { vi } from '../../lang/vi';
import { Spinner } from '../../components/UI';
import { EventCard } from './EventCard';

export const TrendingEventsGrid: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const trendingEvents = await getTrendingEvents();
        setEvents(trendingEvents);
      } catch (err) {
        setError(vi.common.error);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Spinner />
        </div>
      );
    }

    if (error) {
      return <p className="text-red-400 text-center">{error}</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-4">{vi.home.trending}</h2>
      {renderContent()}
    </div>
  );
};
