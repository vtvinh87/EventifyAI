import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event } from '../../types';
import { Button } from '../../components/ui/Button';
import { IconPlusCircle } from '../../components/Icons';
import { EventTable } from '../../features/dashboard/EventTable';
import { AttendeeTable } from '../../features/dashboard/AttendeeTable';
import { useEventStore } from '../../stores/eventStore';

const ManageEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
      organizerEvents,
      currentEventAttendees,
      fetchOrganizerEvents,
      fetchEventAttendees,
      deleteEvent 
  } = useEventStore();

  useEffect(() => {
    // Check if organizerEvents is empty before fetching
    if (organizerEvents.length === 0) {
      fetchOrganizerEvents();
    }
  }, [organizerEvents, fetchOrganizerEvents]);

  // Load attendees for a sample event if the list is empty
  useEffect(() => {
    if (currentEventAttendees.length === 0) {
      fetchEventAttendees('mock_event_id');
    }
  }, [currentEventAttendees, fetchEventAttendees]);

  const handleCreateNew = () => {
    navigate('/create-event');
  };

  const handleEdit = (event: Event) => {
    navigate(`/dashboard/events/${event.id}/edit`);
  };
  
  const handleDelete = (eventId: string) => {
      if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này không?')) {
          deleteEvent(eventId);
      }
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
    </div>
  );
};

export default ManageEventPage;