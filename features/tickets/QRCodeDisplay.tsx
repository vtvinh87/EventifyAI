import React from 'react';
import { Modal } from '../../components/UI';
import { vi } from '../../lang/vi';

interface QRCodeDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeValue: string;
  eventName: string;
  ticketTypeName: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ isOpen, onClose, qrCodeValue, eventName, ticketTypeName }) => {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    qrCodeValue
  )}&size=256x256&bgcolor=ffffff&color=000000&qzone=1`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={vi.myTickets.qrModalTitle}>
      <div className="flex flex-col items-center text-center text-white">
        <p className="mb-4 text-gray-300">{vi.myTickets.qrModalSubtitle}</p>
        <div className="p-4 bg-white rounded-lg">
          <img
            src={qrCodeUrl}
            alt={`Mã QR cho vé ${ticketTypeName}`}
            width={256}
            height={256}
          />
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold">{eventName}</h3>
          <p className="text-brand-400">{ticketTypeName}</p>
          <p className="text-xs text-gray-500 mt-2 font-mono break-all">{qrCodeValue}</p>
        </div>
      </div>
    </Modal>
  );
};
