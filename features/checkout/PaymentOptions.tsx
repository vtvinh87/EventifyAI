import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { vi } from '../../lang/vi';
import { IconCheckCircle } from '../../components/Icons';

const paymentMethods = [
  { id: 'credit-card', name: vi.checkout.creditCard },
  { id: 'momo', name: vi.checkout.momo },
  { id: 'bank-transfer', name: vi.checkout.bankTransfer },
];

export const PaymentOptions: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('credit-card');

  return (
    <div className="space-y-4">
      {paymentMethods.map(method => (
        <Card
          key={method.id}
          onClick={() => setSelectedMethod(method.id)}
          className={`
            p-4 cursor-pointer flex justify-between items-center transition-all
            ${selectedMethod === method.id ? 'border-brand-500 ring-2 ring-brand-500/50' : 'hover:border-white/50'}
          `}
        >
          <span className="font-semibold text-white">{method.name}</span>
          {selectedMethod === method.id && <IconCheckCircle className="text-brand-400" />}
        </Card>
      ))}
    </div>
  );
};
