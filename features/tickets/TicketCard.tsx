import React from 'react';
import type { Ticket } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { IconCalendar, IconMapPin, IconQrCode } from '../../components/Icons';
import { formatDate, formatTime } from '../../utils/date';
import { vi } from '../../lang/vi';
import { QRCodeDisplay } from './QRCodeDisplay';

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const [isQrModalOpen, setIsQrModalOpen] = React.useState(false);
  const { event, ticketType, qrCode } = ticket;

  return (
    <>
      <Card className="flex flex-col md:flex-row overflow-hidden">
        <img
          src={event.bannerUrl}
          alt={event.name}
          className="w-full md:w-1/3 h-48 md:h-auto object-cover"
        />
        <div className="p-6 flex flex-col flex-grow">
          <div>
            <p className="text-sm font-bold text-brand-400">{event.category.toUpperCase()}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{event.name}</h3>
            <p className="text-lg font-semibold text-gray-300">{ticketType.name}</p>
          </div>
          <div className="text-sm text-gray-400 my-4 space-y-2">
            <p className="flex items-center gap-2">
              <IconCalendar size={14} /> 
              <span>{formatDate(event.startTime)} at {formatTime(event.startTime)}</span>
            </p>
            <p className="flex items-center gap-2">
              <IconMapPin size={14} /> 
              <span>{event.locationName}</span>
            </p>
          </div>
          <div className="mt-auto flex justify-end">
            <Button onClick={() => setIsQrModalOpen(true)}>
              <IconQrCode size={18} className="mr-2" />
              {vi.myTickets.viewQRCode}
            </Button>
          </div>
        </div>
      </Card>
      
      <QRCodeDisplay
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        qrCodeValue={qrCode}
        eventName={event.name}
        ticketTypeName={ticketType.name}
      />
    </>
  );
};
