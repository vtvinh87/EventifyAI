import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { vi } from '../lang/vi';
import { AttendeeForm } from '../features/checkout/AttendeeForm';
import { PaymentOptions } from '../features/checkout/PaymentOptions';
import { OrderSummary } from '../features/checkout/OrderSummary';
import { IconCheck } from '../components/Icons';
import { mockRegistrationSchema } from '../lib/mockData';
import { createPaymentSession } from '../lib/paymentService';


const steps = [
    { id: 1, name: vi.checkout.step1 },
    { id: 2, name: vi.checkout.step2 },
    { id: 3, name: vi.checkout.step3 },
];

const CheckoutPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { items, attendeeInfo, totalCost, totalItems, getTicketInstances } = useCartStore();

    const totalTickets = totalItems();
    const cost = totalCost();
    const ticketsForForm = getTicketInstances();

    const validateAttendeeInfo = () => {
        for (const ticket of ticketsForForm) {
            const info = attendeeInfo[ticket.id];
            if (!info) return false;
            for (const field of mockRegistrationSchema) {
                if (field.required && !info[field.name]) {
                    return false;
                }
            }
        }
        return true;
    };

    const handleNext = () => {
        if (step === 1 && !validateAttendeeInfo()) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc cho tất cả các vé.');
            return;
        }
        setStep(s => Math.min(s + 1, 3));
    };
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleConfirmPayment = async () => {
        setIsLoading(true);
        const { setPaymentStatus } = useCartStore.getState();
        setPaymentStatus('processing');
        try {
            const result = await createPaymentSession({ items, attendeeInfo });
            if (result.success) {
                setPaymentStatus('success');
            } else {
                setPaymentStatus('error');
                console.error(result.message);
            }
            navigate(result.redirectUrl);
        } catch (error) {
            setPaymentStatus('error');
            console.error("Payment failed:", error);
            navigate('/payment/cancel');
        }
    };
    
    if (totalTickets === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                 <h1 className="text-3xl font-bold text-white mb-4">{vi.checkout.emptyCart}</h1>
                 <Button onClick={() => navigate('/discover')}>{vi.checkout.continueShopping}</Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-extrabold text-white text-center mb-10">{vi.checkout.title}</h1>
            
            {/* Stepper */}
            <div className="w-full max-w-md mx-auto mb-10">
                <ol className="flex items-center w-full">
                    {steps.map((s, index) => (
                        <li key={s.id} className={`flex w-full items-center ${index < steps.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block" : ''} ${step > s.id ? 'after:border-brand-500' : 'after:border-gray-700'}`}>
                            <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 flex-shrink-0 transition-colors ${step >= s.id ? 'bg-brand-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                {step > s.id ? <IconCheck size={24} /> : <span className="font-bold">{s.id}</span>}
                            </span>
                        </li>
                    ))}
                </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <main className="md:col-span-2">
                    <Card>
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                {steps.find(s => s.id === step)?.name}
                            </h2>
                            {step === 1 && <AttendeeForm schema={mockRegistrationSchema} tickets={ticketsForForm} />}
                            {step === 2 && <PaymentOptions />}
                            {step === 3 && <OrderSummary onConfirm={handleConfirmPayment} isLoading={isLoading} />}
                        </div>
                    </Card>

                    <div className="flex justify-between mt-8">
                        <Button variant="secondary" onClick={handleBack} disabled={step === 1}>
                            {vi.checkout.back}
                        </Button>
                        {step < 3 && (
                            <Button onClick={handleNext}>
                                {vi.checkout.next}
                            </Button>
                        )}
                    </div>
                </main>

                <aside className="md:col-span-1">
                    <div className="sticky top-24">
                        <Card>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-4">{vi.checkout.orderSummary}</h3>
                                <div className="space-y-3">
                                    {items.map(item => (
                                        <div key={`${item.eventId}-${item.ticketTypeId}`} className="flex justify-between items-center text-sm">
                                            <div>
                                                <p className="font-semibold text-white truncate">{item.ticketName} (x{item.quantity})</p>
                                                <p className="text-gray-400 truncate">{item.eventName}</p>
                                            </div>
                                            <p className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-white/10 my-4"></div>
                                <div className="flex justify-between font-bold text-lg text-white">
                                    <span>{vi.checkout.total}</span>
                                    <span>${cost.toFixed(2)}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CheckoutPage;