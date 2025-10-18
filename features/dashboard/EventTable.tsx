import React from 'react';
import type { Event } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { IconEdit, IconTrash2 } from '../../components/Icons';
import { formatDate } from '../../utils/date';

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

export const EventTable: React.FC<EventTableProps> = ({ events, onEdit, onDelete }) => {
  const getStatus = (event: Event) => {
    const now = new Date();
    if (new Date(event.endTime) < now) {
      return <span className="px-2 py-1 text-xs font-semibold bg-gray-500/20 text-gray-300 rounded-full">Đã kết thúc</span>;
    }
    if (new Date(event.startTime) > now) {
      return <span className="px-2 py-1 text-xs font-semibold bg-blue-500/20 text-blue-300 rounded-full">Sắp diễn ra</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-300 rounded-full">Đang diễn ra</span>;
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-gray-400 uppercase bg-white/5">
            <tr>
              <th className="px-6 py-3">Tên sự kiện</th>
              <th className="px-6 py-3">Ngày diễn ra</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map(event => (
                <tr key={event.id} className="border-b border-white/10 hover:bg-white/10">
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{event.name}</td>
                  <td className="px-6 py-4 text-gray-300">{formatDate(event.startTime)}</td>
                  <td className="px-6 py-4">{getStatus(event)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="!p-2" onClick={() => onEdit(event)} aria-label={`Edit ${event.name}`}>
                            <IconEdit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="!p-2 text-red-400 hover:text-red-300" onClick={() => onDelete(event.id)} aria-label={`Delete ${event.name}`}>
                            <IconTrash2 size={16} />
                        </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-400">
                  Bạn chưa tạo sự kiện nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};