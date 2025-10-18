import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { IconCheckCircle } from '../components/Icons';
import { vi } from '../lang/vi';
import { Card } from '../components/ui/Card';

const PaymentSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const { clearCart } = useCartStore();

    useEffect(() => {
        // Clear the cart on successful payment
        clearCart();

        // Redirect to 'My Tickets' page after a delay
        const timer = setTimeout(() => {
            navigate('/my-tickets');
        }, 4000);

        // Cleanup timer on component unmount
        return () => clearTimeout(timer);
    }, [clearCart, navigate]);

    return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <Card className="w-full max-w-lg text-center p-8">
                <div className="flex flex-col items-center">
                    <IconCheckCircle size={64} className="text-green-400 mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">{vi.checkout.paymentSuccessTitle}</h1>
                    <p className="text-gray-300">{vi.checkout.paymentSuccessMessage}</p>
                </div>
            </Card>
        </div>
    );
};

export default PaymentSuccessPage;
