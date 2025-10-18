
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { vi } from '../lang/vi';
import EventDetailView from '../features/events/EventDetailView';
import { useEventStore } from '../stores/eventStore';
import { useUIStore } from '../stores/uiStore';

const EventDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { selectedEvent, fetchEventById } = useEventStore();
    const { isLoading } = useUIStore();

    useEffect(() => {
        if (id) {
            fetchEventById(id);
        }
    // FIX: Removed fetchEventById from dependency array as it's a stable function from Zustand.
    }, [id]);
    
    // GlobalFeedback sẽ hiển thị spinner, component này không cần render gì cả.
    if (isLoading) {
        return <div className="min-h-screen"></div>;
    }
    
    // GlobalFeedback sẽ hiển thị modal lỗi. Sau khi đóng modal, selectedEvent sẽ là null.
    if (!selectedEvent) {
        return <div className="text-center py-20 text-white text-2xl">{vi.eventDetails.notFound}</div>;
    }

    return <EventDetailView event={selectedEvent} />;
};

export default EventDetailPage;
