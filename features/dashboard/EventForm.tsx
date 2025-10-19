
import React, { useState, useEffect } from 'react';
import type { Event, TicketType } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { vi } from '../../lang/vi';
import { IconTrash2, IconPlusCircle } from '../../components/Icons';

interface EventFormProps {
  eventToEdit?: Event | null;
  onSave: (eventData: Partial<Event>) => void;
  isSaving: boolean;
  onDataChange: (data: Partial<Event>) => void;
}

const formatDateForInput = (date?: Date | string): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

// Use a type for the form's ticket representation
type FormTicketType = Omit<Partial<TicketType>, 'benefits'> & { benefits?: string };

const initialFormState = {
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    locationName: '',
    locationAddress: '',
    category: '',
    bannerUrl: '',
};

export const EventForm: React.FC<EventFormProps> = ({ eventToEdit, onSave, isSaving, onDataChange }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [ticketTypes, setTicketTypes] = useState<FormTicketType[]>([]);

  // Effect to populate form when editing
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
      setTicketTypes(eventToEdit.ticketTypes.map(t => ({...t, benefits: t.benefits?.join('\n')})));
    } else {
      setFormData({
          ...initialFormState,
          bannerUrl: `https://picsum.photos/seed/event${Date.now()}/1200/600`,
      });
      setTicketTypes([]);
    }
  }, [eventToEdit]);
  
  // Effect to notify parent of changes for live preview
  useEffect(() => {
    onDataChange({
      ...formData,
      startTime: formData.startTime ? new Date(formData.startTime) : undefined,
      endTime: formData.endTime ? new Date(formData.endTime) : undefined,
      // FIX: Use non-null assertions for `id` and `name` as they are guaranteed to exist
      // by the component's logic, but are typed as optional in FormTicketType.
      // This satisfies the `TicketType[]` interface required by the parent component.
      ticketTypes: ticketTypes.map(t => ({
        ...t,
        id: t.id!,
        name: t.name!,
        price: Number(t.price) || 0,
        quantity: Number(t.quantity) || 0,
        remaining: Number(t.quantity) || 0,
        benefits: t.benefits?.split('\n').filter(b => b.trim() !== '') || [],
      }))
    });
  }, [formData, ticketTypes, onDataChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTicketChange = (index: number, field: keyof FormTicketType, value: string | number) => {
      const newTicketTypes = [...ticketTypes];
      (newTicketTypes[index] as any)[field] = value;
      setTicketTypes(newTicketTypes);
  };

  const addTicketType = () => {
      setTicketTypes([...ticketTypes, { id: `new_${Date.now()}`, name: '', price: 0, quantity: 100, benefits: '' }]);
  };

  const removeTicketType = (index: number) => {
      setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedTicketTypes: TicketType[] = ticketTypes.map(t => ({
      id: t.id!,
      name: t.name!,
      price: Number(t.price) || 0,
      quantity: Number(t.quantity) || 0,
      remaining: Number(t.quantity) || 0, // Assume remaining starts as full quantity
      benefits: t.benefits?.split('\n').filter(b => b.trim() !== ''),
    }));

    const submissionData = {
      ...formData,
      id: eventToEdit?.id,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      ticketTypes: processedTicketTypes,
    };
    onSave(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-white mb-3">{vi.createEvent.basicInfo}</h3>
            <div className="space-y-4">
                <Input label="Tên sự kiện" name="name" value={formData.name} onChange={handleChange} required />
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Mô tả</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4}
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
            </div>
        </div>

        <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-3">{vi.createEvent.tickets}</h3>
            <div className="space-y-4">
                {ticketTypes.map((ticket, index) => (
                    <div key={ticket.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label={vi.createEvent.ticketName} value={ticket.name} onChange={e => handleTicketChange(index, 'name', e.target.value)} placeholder="Vé Phổ thông" required/>
                            <Input label={vi.createEvent.ticketPrice} type="number" value={ticket.price} onChange={e => handleTicketChange(index, 'price', Number(e.target.value))} required/>
                            <Input label={vi.createEvent.ticketQuantity} type="number" value={ticket.quantity} onChange={e => handleTicketChange(index, 'quantity', Number(e.target.value))} required/>
                        </div>
                        <div className="mt-4">
                             <label className="block text-sm font-medium text-gray-300 mb-1">{vi.createEvent.ticketBenefits}</label>
                            <textarea value={ticket.benefits} onChange={e => handleTicketChange(index, 'benefits', e.target.value)} rows={3}
                                className="w-full bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200"
                            />
                        </div>
                         <div className="text-right mt-2">
                             <Button type="button" variant="ghost" size="sm" className="text-red-400" onClick={() => removeTicketType(index)}>
                                 <IconTrash2 size={16} />
                             </Button>
                         </div>
                    </div>
                ))}
                <Button type="button" variant="secondary" onClick={addTicketType}>
                    <IconPlusCircle className="mr-2" /> {vi.createEvent.addTicketType}
                </Button>
            </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
            <Button type="submit" disabled={isSaving}>
                {isSaving ? vi.createEvent.savingButton : vi.createEvent.saveButton}
            </Button>
        </div>
    </form>
  );
};
