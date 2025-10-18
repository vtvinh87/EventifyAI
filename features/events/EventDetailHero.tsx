import React from 'react';
import type { Event } from '../../types';
import { Button } from '../../components/ui/Button';
import { IconCalendar, IconMapPin, IconTicket } from '../../components/Icons';
import { formatDate } from '../../utils/date';
import { vi } from '../../lang/vi';

interface EventDetailHeroProps {
  event: Event;
  onGetTicketsClick: () => void;
}

export const EventDetailHero: React.FC<EventDetailHeroProps> = ({ event, onGetTicketsClick }) => {
  return (
    <div className="relative rounded-b-3xl overflow-hidden -mt-20">
      <div className="absolute inset-0">
        <img src={event.bannerUrl} alt={event.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
      </div>
      <div className="relative container mx-auto px-4 pt-48 pb-12 text-white">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex-grow">
            <p className="text-sm font-bold text-brand-400 mb-2">{event.category.toUpperCase()}</p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">{event.name}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-gray-200">
              <div className="flex items-center gap-2">
                <IconCalendar size={16} />
                <span>{formatDate(event.startTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconMapPin size={16} />
                <span>{event.locationName}</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button size="lg" onClick={onGetTicketsClick}>
              <IconTicket className="mr-2" />
              {vi.eventDetails.getTicketsHero}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};