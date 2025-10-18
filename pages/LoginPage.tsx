import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { LoginForm } from '../features/auth/LoginForm';
import { vi } from '../lang/vi';

const LoginPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen -mt-16">
            <Card className="w-full max-w-md">
                <div className="p-8">
                    <h1 className="text-3xl font-extrabold text-white text-center mb-2">{vi.login.title}</h1>
                    <p className="text-center text-gray-400 mb-6">{vi.login.subtitle}</p>
                    <LoginForm />
                    <p className="text-sm text-gray-400 text-center mt-6">
                        {vi.login.toRegister}{' '}
                        <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300">
                            {vi.login.registerLink}
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
