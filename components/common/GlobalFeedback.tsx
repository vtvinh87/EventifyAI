import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { Spinner, Modal } from '../UI';
import { Button } from '../ui/Button';
import { IconAlertCircle } from '../Icons';

export const GlobalFeedback: React.FC = () => {
  const { isLoading, error, clearError } = useUIStore();

  return (
    <>
      {/* Global Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Spinner size="lg" />
        </div>
      )}

      {/* Global Error Modal */}
      <Modal isOpen={!!error} onClose={clearError} title="Đã có lỗi xảy ra">
        <div className="text-center text-white">
          <IconAlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <p className="text-gray-300 mb-6">{error}</p>
          <Button onClick={clearError}>Đã hiểu</Button>
        </div>
      </Modal>
    </>
  );
};