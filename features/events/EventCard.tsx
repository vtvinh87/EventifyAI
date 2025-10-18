import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Event } from '../../types';
import { Card } from '../../components/ui/Card';
import { IconCalendar, IconMapPin } from '../../components/Icons';
import { formatDate } from '../../utils/date';

interface EventCardProps {
  event: Event;
}

/**
 * A reusable component to display a summary of an event.
 * Features a glassmorphism design that supports both light and dark modes.
 */
const EventCardComponent: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Link to={`/events/${event.id}`} className="block h-full group">
      <Card className="hover:!border-brand-500/50 h-full flex flex-col hover:-translate-y-1 hover:scale-[1.02]">
        <div className="overflow-hidden">
          <img
            src={event.bannerUrl}
            alt={event.name}
            className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-sm font-medium text-brand-400">{event.category.toUpperCase()}</p>
          <h3 className="text-xl font-bold text-white mt-1 mb-2 flex-grow group-hover:text-brand-300 transition-colors">{event.name}</h3>
          <div className="text-sm text-gray-300 mt-auto space-y-1">
            <p className="flex items-center gap-2">
              <IconCalendar size={14} /> {formatDate(event.startTime)}
            </p>
            <p className="flex items-center gap-2">
              <IconMapPin size={14} /> {event.locationName}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export const EventCard = memo(EventCardComponent);