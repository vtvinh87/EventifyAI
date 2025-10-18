import React from 'react';
import type { Event } from '../../types';
import { vi } from '../../lang/vi';
import { Tabs } from '../../components/ui/Tabs';
import { Card } from '../../components/ui/Card';
import EventMap from './EventMap';

// --- Mock Data ---
const MOCK_SCHEDULE = [
  { time: '09:00 - 10:00', title: 'Đón khách & Cà phê sáng', description: 'Bắt đầu ngày mới với cà phê và cơ hội giao lưu.' },
  { time: '10:00 - 11:30', title: 'Bài phát biểu chính: Tương lai của AI', description: 'Diễn giả Jane Doe từ Google AI sẽ chia sẻ những đột phá mới nhất.' },
  { time: '11:30 - 12:00', title: 'Giải lao & Giao lưu', description: 'Thời gian để thư giãn và kết nối với các đồng nghiệp.' },
  { time: '12:00 - 13:30', title: 'Thảo luận nhóm: AI trong Đạo đức', description: 'Một cuộc thảo luận sôi nổi về những thách thức đạo đức của AI.' },
  { time: '13:30 - 14:30', title: 'Ăn trưa', description: 'Thưởng thức bữa trưa do các đầu bếp địa phương chuẩn bị.' },
];

// --- Tab Content Components ---

const ScheduleTab: React.FC = () => (
  <div className="space-y-6">
    {MOCK_SCHEDULE.map((item, index) => (
      <div key={index} className="flex gap-4">
        <div className="font-semibold text-brand-400 w-32 flex-shrink-0">{item.time}</div>
        <div>
          <h3 className="font-bold text-white">{item.title}</h3>
          <p className="text-gray-400">{item.description}</p>
        </div>
      </div>
    ))}
  </div>
);

const OrganizerTab: React.FC<{ organizer: Event['organizer'] }> = ({ organizer }) => (
  <Card className="flex flex-col sm:flex-row items-center gap-6 p-6">
    <img src={organizer.logoUrl} alt={organizer.name} className="w-32 h-32 rounded-full flex-shrink-0" />
    <div>
      <h3 className="text-2xl font-bold text-white mb-2">{organizer.name}</h3>
      <p className="text-gray-300">{organizer.description}</p>
    </div>
  </Card>
);

// --- Main Tabs Component ---

interface EventContentTabsProps {
  event: Event;
}

export const EventContentTabs: React.FC<EventContentTabsProps> = ({ event }) => {
  const tabs = [
    {
      label: vi.eventDetails.tabDescription,
      content: <p className="whitespace-pre-wrap leading-relaxed">{event.description}</p>,
    },
    {
      label: vi.eventDetails.tabSchedule,
      content: <ScheduleTab />,
    },
    {
      label: vi.eventDetails.location,
      content: event.coordinates 
        ? <EventMap center={event.coordinates} /> 
        : <p>Thông tin vị trí không có sẵn.</p>,
    },
    {
      label: vi.eventDetails.tabOrganizer,
      content: <OrganizerTab organizer={event.organizer} />,
    },
  ];

  return <Tabs tabs={tabs} />;
};