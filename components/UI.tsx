
import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

// --- Modal Component ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <Card className="w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          {title && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>X</Button>
            </div>
          )}
          {children}
        </div>
      </Card>
    </div>
  );
};

// --- Spinner Component ---
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };
    return (
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-brand-500 ${sizeClasses[size]}`}></div>
    );
};