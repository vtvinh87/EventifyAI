
import type { Attendee, Event, Feedback, Organizer } from './types';

// FIX: Added missing MOCK_EVENTS and MOCK_FEEDBACKS data.
const MOCK_ORGANIZER_AI: Organizer = {
  id: 'c33a97e1-8726-48a3-9f86-35eac1306368',
  name: 'AI Innovators Co.',
  description: 'AI Innovators Co. is at the forefront of artificial intelligence research and development, hosting events that showcase the future of technology.',
  logoUrl: 'https://i.pravatar.cc/150?u=ai-innovators'
};

const MOCK_ORGANIZER_CRAFT: Organizer = {
    id: 'd44b98e2-9837-49b4-9f97-46fbd2417479',
    name: 'The Craft Circle',
    description: 'A community of artists and crafters sharing their passion through workshops and gatherings.',
    logoUrl: 'https://i.pravatar.cc/150?u=craft-circle'
};

export const MOCK_EVENTS: Event[] = [
    {
        id: 'event_1',
        name: 'Hội nghị AI Sáng tạo 2024',
        description: 'Tham gia cùng các chuyên gia hàng đầu để khám phá những đột phá mới nhất trong lĩnh vực AI sáng tạo, từ nghệ thuật đến âm nhạc và hơn thế nữa. Một ngày đầy cảm hứng với các bài phát biểu, hội thảo và cơ hội kết nối.',
        bannerUrl: 'https://picsum.photos/seed/ai2024/1200/600',
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // in 7 days
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 8), // 8 hours long
        locationName: 'Trung tâm Hội nghị Quốc gia',
        locationAddress: '57 Phạm Hùng, Mễ Trì, Nam Từ Liêm, Hà Nội',
        coordinates: { lat: 21.0049, lng: 105.7836 },
        organizer_id: MOCK_ORGANIZER_AI.id,
        organizer: MOCK_ORGANIZER_AI,
        category: 'Công nghệ',
        ticketTypes: [
            { id: 't1_1', name: 'Vé Phổ Thông', price: 25, quantity: 500, remaining: 150, benefits: ['Toàn quyền tham dự hội nghị', 'Ăn trưa & đồ uống nhẹ'] },
            { id: 't1_2', name: 'Vé VIP', price: 75, quantity: 100, remaining: 20, benefits: ['Tất cả quyền lợi vé Phổ Thông', 'Ghế ngồi hàng đầu', 'Túi quà độc quyền', 'Tiệc tối kết nối'] },
        ],
    },
    {
        id: 'event_2',
        name: 'Đại nhạc hội Mùa hè Sôi động',
        description: 'Một đêm nhạc không thể quên với sự góp mặt của các nghệ sĩ hàng đầu V-Pop. Hãy sẵn sàng để hòa mình vào không khí âm nhạc đỉnh cao dưới bầu trời đêm.',
        bannerUrl: 'https://picsum.photos/seed/musicfest/1200/600',
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // in 30 days
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 + 1000 * 60 * 60 * 5), // 5 hours long
        locationName: 'Sân vận động Mỹ Đình',
        locationAddress: 'Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm, Hà Nội',
        coordinates: { lat: 21.0209, lng: 105.7663 },
        organizer_id: 'org_music_fest',
        organizer: { id: 'org_music_fest', name: 'VinaSound', description: 'Nhà tổ chức sự kiện âm nhạc hàng đầu Việt Nam.', logoUrl: 'https://i.pravatar.cc/150?u=vinasound' },
        category: 'Âm nhạc',
        ticketTypes: [
            { id: 't2_1', name: 'Vé Khán đài', price: 40, quantity: 10000, remaining: 2500 },
            { id: 't2_2', name: 'Vé Sát sân khấu', price: 120, quantity: 2000, remaining: 100 },
        ],
    },
    {
        id: 'event_3',
        name: 'Workshop Nặn gốm cho người mới bắt đầu',
        description: 'Tìm về sự bình yên và khơi dậy tính sáng tạo của bạn trong buổi workshop nặn gốm thư giãn. Không yêu cầu kinh nghiệm, chúng tôi sẽ hướng dẫn bạn từng bước.',
        bannerUrl: 'https://picsum.photos/seed/pottery/1200/600',
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // in 14 days
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 60 * 3), // 3 hours long
        locationName: 'Xưởng gốm Bát Tràng',
        locationAddress: '289 Giang Cao, Bát Tràng, Gia Lâm, Hà Nội',
        coordinates: { lat: 20.9833, lng: 105.9167 },
        organizer_id: MOCK_ORGANIZER_CRAFT.id,
        organizer: MOCK_ORGANIZER_CRAFT,
        category: 'Workshop',
        ticketTypes: [
            { id: 't3_1', name: 'Vé Tiêu chuẩn', price: 30, quantity: 20, remaining: 5, benefits: ['Bao gồm nguyên liệu và nung sản phẩm'] },
        ],
    }
];

export const MOCK_FEEDBACKS: Feedback[] = [
    { id: 'fb_1', rating: 5, comment: 'Sự kiện rất tuyệt vời! Các diễn giả rất chuyên nghiệp và nội dung bổ ích.', attendeeName: 'Nguyễn Văn A' },
    { id: 'fb_2', rating: 4, comment: 'Địa điểm tổ chức hơi khó tìm một chút, nhưng nhìn chung mọi thứ đều tốt.', attendeeName: 'Trần Thị B' },
    { id: 'fb_3', rating: 3, comment: 'Giá vé VIP hơi cao so với những gì nhận được. Đồ ăn trưa cũng không ngon lắm.', attendeeName: 'Lê Văn C' },
    { id: 'fb_4', rating: 5, comment: 'Một trải nghiệm khó quên. Âm nhạc và sân khấu quá đỉnh!', attendeeName: 'Phạm Thị D' },
];


// Most mock data has been removed and is now fetched from Supabase.
// Keeping MOCK_ATTENDEES for dashboard example until it's connected to the backend.

export const MOCK_ATTENDEES: Attendee[] = Array.from({ length: 150 }, (_, i) => ({
  id: `att_${i + 1}`,
  name: `Người tham dự ${i + 1}`,
  email: `attendee${i + 1}@email.com`,
  checkedIn: Math.random() > 0.4,
  checkInTime: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 2) : undefined,
  ticketType: Math.random() > 0.2 ? 'Vé Phổ Thông' : 'Vé VIP',
}));
