import React from 'react';
import type { Ticket } from '../../types';
import { vi } from '../../lang/vi';
import { Tabs } from '../../components/ui/Tabs';
import { TicketCard } from './TicketCard';

interface TicketWalletProps {
  tickets: Ticket[];
}

export const TicketWallet: React.FC<TicketWalletProps> = ({ tickets }) => {
  const now = new Date();
  const upcomingTickets = tickets.filter(t => new Date(t.event.endTime) >= now);
  const pastTickets = tickets.filter(t => new Date(t.event.endTime) < now);

  const tabs = [
    {
      label: `${vi.myTickets.upcoming} (${upcomingTickets.length})`,
      content: (
        <div className="space-y-6">
          {upcomingTickets.length > 0 ? (
            upcomingTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
          ) : (
            <p className="text-center text-gray-400 py-10">{vi.myTickets.noTickets.replace('{tab}', vi.myTickets.upcoming.toLowerCase())}</p>
          )}
        </div>
      ),
    },
    {
      label: `${vi.myTickets.past} (${pastTickets.length})`,
      content: (
        <div className="space-y-6">
          {pastTickets.length > 0 ? (
            pastTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
          ) : (
            <p className="text-center text-gray-400 py-10">{vi.myTickets.noTickets.replace('{tab}', vi.myTickets.past.toLowerCase())}</p>
          )}
        </div>
      ),
    },
  ];

  return <Tabs tabs={tabs} />;
};