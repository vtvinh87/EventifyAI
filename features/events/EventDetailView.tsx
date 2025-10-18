import React, { useRef } from 'react';
import type { Event } from '../../types';
import { vi } from '../../lang/vi';
import { EventDetailHero } from './EventDetailHero';
import { Card } from '../../components/ui/Card';
import { IconCalendar, IconMapPin } from '../../components/Icons';
import { formatDate, formatTime } from '../../utils/date';
import { EventContentTabs } from './EventContentTabs';
import { TicketSelector } from '../checkout/TicketSelector';

interface EventDetailViewProps {
    event: Event;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({ event }) => {
    const ticketsSectionRef = useRef<HTMLDivElement>(null);

    const handleGetTicketsClick = () => {
        ticketsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>
            <EventDetailHero event={event} onGetTicketsClick={handleGetTicketsClick} />
            
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 text-gray-200">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="flex items-start gap-4">
                                <IconCalendar className="text-brand-400 mt-1" size={24} />
                                <div>
                                    <h3 className="font-semibold text-white">{vi.eventDetails.dateAndTime}</h3>
                                    <p>{formatDate(event.startTime)} - {formatDate(event.endTime)}</p>
                                    <p>{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <IconMapPin className="text-brand-400 mt-1" size={24} />
                                <div>
                                    <h3 className="font-semibold text-white">{vi.eventDetails.location}</h3>
                                    <p>{event.locationName}</p>
                                    <p>{event.locationAddress}</p>
                                </div>
                            </div>
                        </div>
                        
                        <EventContentTabs event={event} />

                    </div>
                    
                    <div className="lg:col-span-1" ref={ticketsSectionRef}>
                        <Card className="sticky top-24">
                            <div className="p-6">
                                <TicketSelector event={event} />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventDetailView;