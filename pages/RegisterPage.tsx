import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { RegisterForm } from '../features/auth/RegisterForm';
import { vi } from '../lang/vi';

const RegisterPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen -mt-16">
            <Card className="w-full max-w-md">
                <div className="p-8">
                    <h1 className="text-3xl font-extrabold text-white text-center mb-2">{vi.register.title}</h1>
                    <p className="text-center text-gray-400 mb-6">{vi.register.subtitle}</p>
                    <RegisterForm />
                    <p className="text-sm text-gray-400 text-center mt-6">
                        {vi.register.toLogin}{' '}
                        <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300">
                            {vi.register.loginLink}
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default RegisterPage;
