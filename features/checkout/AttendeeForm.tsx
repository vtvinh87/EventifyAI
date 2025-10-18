import React from 'react';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import type { FormFieldSchema } from '../../lib/mockData';
import { useCartStore } from '../../stores/cartStore';
import type { TicketInstance } from '../../stores/cartStore';

interface AttendeeFormProps {
  schema: FormFieldSchema[];
  tickets: TicketInstance[];
}

export const AttendeeForm: React.FC<AttendeeFormProps> = ({ schema, tickets }) => {
  const { attendeeInfo, setAttendeeInfo } = useCartStore();

  const handleChange = (ticketId: string, fieldName: string, value: string) => {
    const currentInfo = attendeeInfo[ticketId] || {};
    const newInfo = { ...currentInfo, [fieldName]: value };
    setAttendeeInfo(ticketId, newInfo);
  };

  return (
    <div className="space-y-6">
      {tickets.map((ticket, index) => (
        <Card key={ticket.id} className="p-6 transition-shadow hover:shadow-lg hover:shadow-brand-900/50">
          <h3 className="text-lg font-semibold text-white mb-4">
            Thông tin vé {index + 1}: <span className="text-brand-400">{ticket.ticketTypeName}</span>
          </h3>
          <div className="space-y-4">
            {schema.map(field => (
              <Input
                key={field.name}
                id={`${ticket.id}-${field.name}`}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                value={attendeeInfo[ticket.id]?.[field.name] || ''}
                onChange={(e) => handleChange(ticket.id, field.name, e.target.value)}
                autoComplete={`attendee-${index}-${field.name}`}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};