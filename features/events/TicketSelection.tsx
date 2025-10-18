import React, { useState } from 'react';
import type { Event } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/UI';
import { vi } from '../../lang/vi';
import { TicketTypeItem } from './TicketTypeItem';

interface TicketSelectionProps {
  event: Event;
}

export const TicketSelection: React.FC<TicketSelectionProps> = ({ event }) => {
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);

  const handleTicketCountChange = (ticketTypeId: string, count: number) => {
    const ticketType = event.ticketTypes.find(t => t.id === ticketTypeId);
    if (!ticketType) return;
    const newCount = Math.max(0, Math.min(count, ticketType.remaining));
    setTicketCounts(prev => ({ ...prev, [ticketTypeId]: newCount }));
  };

  const totalCost = Object.entries(ticketCounts).reduce((acc, [ticketTypeId, count]) => {
    const ticketType = event.ticketTypes.find(t => t.id === ticketTypeId);
    // FIX: Use Number() to ensure `count` is treated as a number, as it can be inferred as `unknown`.
    return acc + (ticketType ? ticketType.price * Number(count) : 0);
  }, 0);
  
  // FIX: Use Number() to ensure `count` is treated as a number. This resolves type errors where `count` was inferred as `unknown`.
  const totalTickets = Object.values(ticketCounts).reduce((acc, count) => acc + Number(count), 0);

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-4">{vi.eventDetails.getTickets}</h2>
      <div className="space-y-4">
        {event.ticketTypes.map(tt => (
          <TicketTypeItem
            key={tt.id}
            ticketType={tt}
            count={ticketCounts[tt.id] || 0}
            onCountChange={(newCount) => handleTicketCountChange(tt.id, newCount)}
            isFeatured={tt.name.toLowerCase().includes('vip')}
          />
        ))}
      </div>
      
      {/* FIX: The conditional check now works correctly as `totalTickets` is guaranteed to be a number. */}
      {totalTickets > 0 && (
        <div className="mt-6 border-t border-white/20 pt-4">
          <div className="flex justify-between items-center text-xl font-bold text-white mb-4">
            <span>{vi.eventDetails.total}</span>
            <span>${totalCost.toFixed(2)}</span>
          </div>
          <Button className="w-full" onClick={() => setCheckoutModalOpen(true)}>
            {vi.eventDetails.checkout} ({totalTickets})
          </Button>
        </div>
      )}

      <Modal isOpen={isCheckoutModalOpen} onClose={() => setCheckoutModalOpen(false)} title={vi.eventDetails.checkoutModalTitle}>
        <div className="text-white">
          <p className="mb-4">{vi.eventDetails.checkoutModalBody}</p>
          <p className="mb-2">{vi.eventDetails.totalAmount} <span className="font-bold text-brand-400">${totalCost.toFixed(2)}</span></p>
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="secondary" onClick={() => setCheckoutModalOpen(false)}>{vi.eventDetails.cancel}</Button>
            <Button onClick={() => { alert(vi.eventDetails.purchaseSuccess); setCheckoutModalOpen(false); }}>{vi.eventDetails.confirmPurchase}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};