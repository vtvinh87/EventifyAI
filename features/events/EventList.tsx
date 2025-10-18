import React from 'react';
import type { Event } from '../../types';
import { EventCard } from './EventCard';
import { vi } from '../../lang/vi';

interface EventListProps {
  events: Event[];
}

/**
 * A component that renders a responsive grid of EventCard components.
 * @param {Event[]} events - An array of event objects to display.
 */
export const EventList: React.FC<EventListProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>{vi.eventDetails.notFound}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};