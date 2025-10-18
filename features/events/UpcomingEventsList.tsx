
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Event } from '../../types';
// FIX: Correctly import getUpcomingEvents which was added to the apiEvents service.
import { getUpcomingEvents } from '../../services/apiEvents';
import { vi } from '../../lang/vi';
import { Spinner } from '../../components/UI';
import { Card } from '../../components/ui/Card';
import { IconMapPin, IconClock } from '../../components/Icons';
import { formatTime } from '../../utils/date';

// A more compact list item for upcoming events for better UX in a list view
const UpcomingEventListItem: React.FC<{ event: Event }> = ({ event }) => {
  const eventDate = new Date(event.startTime);
  const day = eventDate.toLocaleDateString('vi-VN', { day: '2-digit' });
  const month = eventDate.toLocaleDateString('vi-VN', { month: 'short' });

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <Card className="p-4 flex items-center gap-4 hover:!border-brand-500/50">
        <div className="flex flex-col items-center justify-center text-center bg-brand-900/50 rounded-lg p-2 w-16 h-16 flex-shrink-0">
          <span className="text-xs font-semibold text-brand-300 uppercase">{month}</span>
          <span className="text-2xl font-bold text-white tracking-tight">{day}</span>
        </div>
        <div className="flex-grow overflow-hidden">
          <h3 className="text-md font-bold text-white truncate group-hover:text-brand-300 transition-colors">{event.name}</h3>
          <div className="text-sm text-gray-400 mt-1 space-y-0.5">
            <p className="flex items-center gap-1.5 truncate">
              <IconClock size={12} /> {formatTime(event.startTime)}
            </p>
            <p className="flex items-center gap-1.5 truncate">
              <IconMapPin size={12} /> {event.locationName}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};


export const UpcomingEventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const upcomingEvents = await getUpcomingEvents();
        setEvents(upcomingEvents);
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
      <div className="space-y-4">
        {events.map(event => (
          <UpcomingEventListItem key={event.id} event={event} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-4">{vi.home.upcoming}</h2>
      {renderContent()}
    </div>
  );
};
