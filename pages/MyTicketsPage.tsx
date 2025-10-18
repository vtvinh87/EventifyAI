import React, { useEffect } from 'react';
import { vi } from '../lang/vi';
import { TicketWallet } from '../features/tickets/TicketWallet';
import { useEventStore } from '../stores/eventStore';
import { useUIStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';

const MyTicketsPage: React.FC = () => {
  const { myTickets, fetchMyTickets } = useEventStore();
  const { isLoading, error } = useUIStore(); // Lỗi được xử lý bởi GlobalFeedback
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
        fetchMyTickets();
    }
  }, [user, fetchMyTickets]);

  const renderContent = () => {
    // Spinner được hiển thị bởi GlobalFeedback
    if (isLoading) {
      return <div className="py-20"></div>;
    }

    // Lỗi được hiển thị bởi GlobalFeedback, sau khi đóng modal, myTickets sẽ trống
    if (error && myTickets.length === 0) {
      return null;
    }
    
    return <TicketWallet tickets={myTickets} />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-white mb-8">{vi.myTickets.title}</h1>
      {renderContent()}
    </div>
  );
};

export default MyTicketsPage;