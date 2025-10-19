import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventStore } from '../../stores/eventStore';
import { useUIStore } from '../../stores/uiStore';
import { vi } from '../../lang/vi';
import { EventForm } from '../../features/dashboard/EventForm';
import { EventCard } from '../../features/events/EventCard';
import { Card } from '../../components/ui/Card';
import type { Event } from '../../types';
import { MOCK_EVENTS } from '../../constants';

const CreateEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { organizerEvents, createEvent, updateEvent } = useEventStore();
  const { isLoading } = useUIStore();
  
  const [eventData, setEventData] = useState<Partial<Event>>({});
  
  const isEditing = Boolean(id);
  
  const eventToEdit = useMemo(() => {
    return isEditing ? organizerEvents.find(e => e.id === id) : null;
  }, [id, isEditing, organizerEvents]);

  // Create a preview event object from form data
  const previewEvent = useMemo<Event>(() => ({
    id: eventData.id || 'preview',
    name: eventData.name || 'Tên sự kiện',
    description: eventData.description || 'Mô tả sự kiện sẽ hiển thị ở đây.',
    bannerUrl: eventData.bannerUrl || 'https://picsum.photos/seed/placeholder/1200/600',
    startTime: eventData.startTime ? new Date(eventData.startTime) : new Date(),
    endTime: eventData.endTime ? new Date(eventData.endTime) : new Date(),
    locationName: eventData.locationName || 'Địa điểm',
    locationAddress: eventData.locationAddress || 'Địa chỉ',
    category: eventData.category || 'Danh mục',
    organizer: MOCK_EVENTS[0].organizer, // Mock organizer for preview
    organizer_id: MOCK_EVENTS[0].organizer.id,
    ticketTypes: eventData.ticketTypes || [],
  }), [eventData]);

  const handleSave = async (formData: Partial<Event>) => {
    let success = false;
    if (isEditing && id) {
      success = await updateEvent(id, formData);
    } else {
      success = await createEvent(formData);
    }
    
    if (success) {
      // In a real app, you might show a toast notification
      alert(vi.createEvent.successMessage);
      navigate('/dashboard/events');
    }
    // Error is handled globally by uiStore
  };

  const handleDataChange = useCallback((data: Partial<Event>) => {
    setEventData(prev => ({ ...prev, ...data }));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-white mb-8">
        {isEditing ? vi.createEvent.editTitle : vi.createEvent.title}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
            <Card>
                <div className="p-6">
                    <EventForm 
                        eventToEdit={eventToEdit} 
                        onSave={handleSave} 
                        isSaving={isLoading} 
                        onDataChange={handleDataChange}
                    />
                </div>
            </Card>
        </main>
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">{vi.createEvent.livePreview}</h3>
            <EventCard event={previewEvent} disableLink />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateEventPage;
