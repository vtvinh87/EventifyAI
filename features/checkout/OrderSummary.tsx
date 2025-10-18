import React from 'react';
import { useCartStore } from '../../stores/cartStore';
import { vi } from '../../lang/vi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface OrderSummaryProps {
  onConfirm: () => void;
  isLoading: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ onConfirm, isLoading }) => {
  const { items, totalCost } = useCartStore();
  const cost = totalCost();

  return (
    <div>
        <h3 className="text-xl font-bold text-white mb-4">{vi.checkout.orderSummary}</h3>
        <Card className="p-4 space-y-3">
            {items.map(item => (
                <div key={`${item.eventId}-${item.ticketTypeId}`} className="flex justify-between items-center text-sm">
                    <div>
                        <p className="font-semibold text-white">{item.ticketName} ({item.quantity}x)</p>
                        <p className="text-gray-400">{item.eventName}</p>
                    </div>
                    <p className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            ))}
            <div className="border-t border-white/10 my-2"></div>
            <div className="flex justify-between font-bold text-lg text-white">
                <span>{vi.checkout.total}</span>
                <span>${cost.toFixed(2)}</span>
            </div>
        </Card>
        <div className="mt-6">
            <h4 className="font-semibold text-white mb-2">Thông tin người tham dự</h4>
            <p className="text-gray-300 text-sm">Nguyễn Văn A</p>
            <p className="text-gray-300 text-sm">email@example.com</p>
        </div>
        <div className="mt-4">
            <h4 className="font-semibold text-white mb-2">Phương thức thanh toán</h4>
            <p className="text-gray-300 text-sm">Thẻ Tín dụng / Ghi nợ</p>
        </div>
        <Button onClick={onConfirm} disabled={isLoading} className="w-full mt-8">
            {isLoading ? vi.checkout.processing : vi.checkout.confirmAndPay}
        </Button>
    </div>
  );
};
