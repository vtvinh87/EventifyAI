import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconAlertCircle } from '../components/Icons';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const PaymentCancelPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <Card className="w-full max-w-lg text-center p-8">
                <div className="flex flex-col items-center">
                    <IconAlertCircle size={64} className="text-yellow-400 mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">Thanh toán đã bị hủy</h1>
                    <p className="text-gray-300 mb-6">
                        Đã có lỗi xảy ra hoặc bạn đã hủy giao dịch. Vui lòng thử lại.
                    </p>
                    <Button onClick={() => navigate('/checkout')}>
                        Thử lại thanh toán
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default PaymentCancelPage;
