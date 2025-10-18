import React, { useState, useEffect } from 'react';
import type { Event } from '../../types';
import { Button } from '../../components/ui/Button';
import { IconPlusCircle } from '../../components/Icons';
import { Modal } from '../../components/UI';
import { EventTable } from '../../features/dashboard/EventTable';
import { EventForm } from '../../features/dashboard/EventForm';
import { AttendeeTable } from '../../features/dashboard/AttendeeTable';
import { useEventStore } from '../../stores/eventStore';

const ManageEventPage: React.FC = () => {
  const { 
      organizerEvents,
      currentEventAttendees,
      fetchOrganizerEvents,
      fetchEventAttendees,
      createEvent, 
      updateEvent, 
      deleteEvent 
  } = useEventStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

  useEffect(() => {
    if (organizerEvents.length === 0) {
      fetchOrganizerEvents();
    }
    // Tải danh sách người tham dự cho một sự kiện mẫu
    if (currentEventAttendees.length === 0) {
        fetchEventAttendees('mock_event_id');
    }
  }, [organizerEvents, fetchOrganizerEvents, currentEventAttendees, fetchEventAttendees]);

  const handleCreateNew = () => {
    setEventToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  };
  
  const handleDelete = (eventId: string) => {
      if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này không?')) {
          deleteEvent(eventId);
      }
  };

  const handleSave = (eventData: Omit<Event, 'id' | 'organizer' | 'ticketTypes'> & { id?: string }) => {
    if (eventData.id) {
      updateEvent(eventData as Partial<Event> & { id: string });
    } else {
      createEvent(eventData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Quản lý sự kiện</h1>
        <Button onClick={handleCreateNew}>
          <IconPlusCircle className="mr-2" size={20} />
          Tạo Sự kiện mới
        </Button>
      </div>
      
      <EventTable events={organizerEvents} onEdit={handleEdit} onDelete={handleDelete} />

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-4">Danh sách người tham dự</h2>
        <p className="text-gray-400 mb-6">Quản lý và theo dõi tất cả người tham dự các sự kiện của bạn tại đây.</p>
        <AttendeeTable attendees={currentEventAttendees} />
      </div>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={eventToEdit ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}
      >
        <EventForm 
            eventToEdit={eventToEdit}
            onSave={handleSave}
            onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ManageEventPage;
