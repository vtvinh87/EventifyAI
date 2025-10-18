import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event } from '../../types';
import { Button } from '../../components/ui/Button';
import { vi } from '../../lang/vi';
import { TicketTypeItem } from './TicketTypeItem';
import { useCartStore } from '../../stores/cartStore';

interface TicketSelectorProps {
  event: Event;
}

export const TicketSelector: React.FC<TicketSelectorProps> = ({ event }) => {
  const navigate = useNavigate();
  const { items, setTicketQuantity, getEventTotalCost, getEventTotalTickets } = useCartStore();

  const handleTicketCountChange = (ticketTypeId: string, count: number) => {
    const ticketType = event.ticketTypes.find(t => t.id === ticketTypeId);
    if (!ticketType) return;
    
    setTicketQuantity(
      { id: event.id, name: event.name },
      { id: ticketType.id, name: ticketType.name, price: ticketType.price, remaining: ticketType.remaining },
      count
    );
  };

  const totalCost = getEventTotalCost(event.id);
  const totalTickets = getEventTotalTickets(event.id);

  const getTicketCount = (ticketTypeId: string) => {
      const item = items.find(i => i.eventId === event.id && i.ticketTypeId === ticketTypeId);
      return item?.quantity || 0;
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-4">{vi.eventDetails.getTickets}</h2>
      <div className="space-y-4">
        {event.ticketTypes.map(tt => (
          <TicketTypeItem
            key={tt.id}
            ticketType={tt}
            count={getTicketCount(tt.id)}
            onCountChange={(newCount) => handleTicketCountChange(tt.id, newCount)}
            isFeatured={tt.name.toLowerCase().includes('vip')}
          />
        ))}
      </div>
      
      {totalTickets > 0 && (
        <div className="mt-6 border-t border-white/20 pt-4">
          <div className="flex justify-between items-center text-xl font-bold text-white mb-4">
            <span>{vi.eventDetails.total}</span>
            <span>${totalCost.toFixed(2)}</span>
          </div>
          <Button className="w-full" onClick={() => navigate('/checkout')}>
            {vi.eventDetails.checkout} ({totalTickets})
          </Button>
        </div>
      )}
    </>
  );
};