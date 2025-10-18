import React from 'react';
import type { TicketType } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { IconCheck } from '../../components/Icons';
import { vi } from '../../lang/vi';

interface TicketTypeItemProps {
  ticketType: TicketType;
  count: number;
  onCountChange: (newCount: number) => void;
  isFeatured?: boolean;
}

export const TicketTypeItem: React.FC<TicketTypeItemProps> = ({ ticketType, count, onCountChange, isFeatured }) => {
  const { name, price, remaining, benefits } = ticketType;
  
  const featuredClasses = isFeatured 
    ? 'border-brand-500/80 ring-2 ring-brand-500/50' 
    : 'border-white/20';

  return (
    <Card className={`p-5 flex flex-col ${featuredClasses}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <p className="text-sm text-gray-400">{remaining} {vi.eventDetails.remaining}</p>
        </div>
        <p className="text-2xl font-extrabold text-brand-400">${price}</p>
      </div>
      
      {benefits && benefits.length > 0 && (
        <div className="my-4 border-t border-white/10 pt-4 space-y-2">
          <h4 className="font-semibold text-gray-200 text-sm mb-2">{vi.eventDetails.benefits}</h4>
          <ul className="space-y-1.5">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                <IconCheck size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
         <span className="text-sm font-medium text-white">Số lượng:</span>
         <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => onCountChange(count - 1)} disabled={count === 0} className="!p-2 w-8 h-8 rounded-full">-</Button>
            <span className="w-8 text-center font-bold text-lg text-white">{count}</span>
            <Button size="sm" variant="secondary" onClick={() => onCountChange(count + 1)} disabled={count >= remaining} className="!p-2 w-8 h-8 rounded-full">+</Button>
         </div>
      </div>
    </Card>
  );
};
