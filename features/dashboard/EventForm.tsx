
import React, { useState, useEffect } from 'react';
import type { Event } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface EventFormProps {
  eventToEdit?: Event | null;
  onSave: (eventData: Omit<Event, 'id' | 'organizer' | 'ticketTypes'> & { id?: string }) => void;
  onClose: () => void;
}

const formatDateForInput = (date?: Date): string => {
  if (!date) return '';
  const d = new Date(date);
  // Adjust for timezone offset to display correctly in the input
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export const EventForm: React.FC<EventFormProps> = ({ eventToEdit, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    locationName: '',
    locationAddress: '',
    category: '',
    bannerUrl: '',
  });

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        name: eventToEdit.name,
        description: eventToEdit.description,
        startTime: formatDateForInput(eventToEdit.startTime),
        endTime: formatDateForInput(eventToEdit.endTime),
        locationName: eventToEdit.locationName,
        locationAddress: eventToEdit.locationAddress,
        category: eventToEdit.category,
        bannerUrl: eventToEdit.bannerUrl,
      });
    } else {
      // Reset form for new event
      setFormData({
        name: '',
        description: '',
        startTime: '',
        endTime: '',
        locationName: '',
        locationAddress: '',
        category: '',
        bannerUrl: `https://picsum.photos/seed/event${Date.now()}/1200/600`,
      });
    }
  }, [eventToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Added 'organizer_id' to the submission data to satisfy the type requirements of the onSave prop.
    // A mock ID is used for new events, while the existing ID is used for edits.
    const submissionData = {
      ...formData,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      id: eventToEdit?.id,
      organizer_id: eventToEdit?.organizer_id || 'c33a97e1-8726-48a3-9f86-35eac1306368', // Mock organizer ID for new events
    };
    onSave(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <Input label="Tên sự kiện" name="name" value={formData.name} onChange={handleChange} required />
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Mô tả</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Thời gian bắt đầu" name="startTime" type="datetime-local" value={formData.startTime} onChange={handleChange} required />
        <Input label="Thời gian kết thúc" name="endTime" type="datetime-local" value={formData.endTime} onChange={handleChange} required />
      </div>
      <Input label="Địa điểm" name="locationName" value={formData.locationName} onChange={handleChange} required />
      <Input label="Địa chỉ" name="locationAddress" value={formData.locationAddress} onChange={handleChange} required />
      <Input label="Danh mục" name="category" value={formData.category} onChange={handleChange} placeholder="VD: Công nghệ, Âm nhạc..." required />
      <Input label="URL Ảnh bìa" name="bannerUrl" value={formData.bannerUrl} onChange={handleChange} required />
      
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
        <Button type="submit">Lưu sự kiện</Button>
      </div>
    </form>
  );
};
