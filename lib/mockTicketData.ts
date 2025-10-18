
import type { Event, Ticket } from '../types';
// FIX: Import MOCK_EVENTS which was missing from the constants file.
import { MOCK_EVENTS } from '../constants';

// Tạo một sự kiện trong quá khứ để làm dữ liệu giả
const MOCK_PAST_EVENT: Event = {
    id: 'event_past_1',
    name: 'Hội thảo Lập trình Web 2023',
    description: 'Nhìn lại các xu hướng phát triển web của năm đã qua.',
    bannerUrl: 'https://picsum.photos/seed/webconf2023/1200/600',
    startTime: new Date('2023-12-15T09:00:00'),
    endTime: new Date('2023-12-15T17:00:00'),
    locationName: 'Trung tâm Hội nghị Sài Gòn',
    locationAddress: '789 Đường Tương Lai, Quận 1, TPHCM',
    // FIX: Added missing 'organizer_id' property to match the Event type.
    organizer_id: MOCK_EVENTS[0].organizer.id,
    organizer: MOCK_EVENTS[0].organizer, // Tái sử dụng một nhà tổ chức
    category: 'Công nghệ',
    ticketTypes: [
        { id: 't_past_1', name: 'Vé Tham Dự', price: 50, quantity: 200, remaining: 0 },
    ]
};

const USER_TICKETS_KEY = 'eventify-user-tickets';

// Một danh sách các vé giả lập được xác định trước cho người dùng
const getDefaultMockTickets = (): Ticket[] => [
    // Vé sắp diễn ra
    { 
        id: 'ticket_user_1', 
        event: MOCK_EVENTS[0], // AI Sáng Tạo 2024
        ticketType: MOCK_EVENTS[0].ticketTypes[1], // VIP
        purchaseDate: new Date('2024-08-01T10:00:00'), 
        qrCode: `mock-qr-code-${Math.random().toString(36).substr(2, 9)}` 
    },
    // Một vé sắp diễn ra khác
    { 
        id: 'ticket_user_2', 
        event: MOCK_EVENTS[2], // Workshop Nặn Gốm
        ticketType: MOCK_EVENTS[2].ticketTypes[0], // Tiêu Chuẩn
        purchaseDate: new Date('2024-08-15T14:30:00'), 
        qrCode: `mock-qr-code-${Math.random().toString(36).substr(2, 9)}` 
    },
    // Một vé đã qua
    {
        id: 'ticket_user_3',
        event: MOCK_PAST_EVENT,
        ticketType: MOCK_PAST_EVENT.ticketTypes[0],
        purchaseDate: new Date('2023-11-20T11:00:00'),
        qrCode: `mock-qr-code-${Math.random().toString(36).substr(2, 9)}`
    }
];

/**
 * Lấy dữ liệu vé giả lập cho người dùng hiện tại.
 * Nó sẽ kiểm tra localStorage trước tiên để tìm các vé hiện có. Nếu không tìm thấy,
 * nó sẽ tạo một bộ mặc định, lưu trữ trong localStorage và trả về nó.
 * Điều này mô phỏng tính bền bỉ của dữ liệu cho ví vé của người dùng.
 * @returns Một mảng các đối tượng Ticket.
 */
export const getMockUserTickets = (): Ticket[] => {
    try {
        const storedTickets = localStorage.getItem(USER_TICKETS_KEY);
        if (storedTickets) {
            // Quan trọng: Ngày tháng sẽ là chuỗi sau khi JSON.parse, cần chuyển đổi chúng trở lại
            return JSON.parse(storedTickets).map((ticket: any) => ({
                ...ticket,
                event: {
                    ...ticket.event,
                    startTime: new Date(ticket.event.startTime),
                    endTime: new Date(ticket.event.endTime),
                },
                purchaseDate: new Date(ticket.purchaseDate)
            }));
        }

        // Nếu không có vé trong bộ nhớ, tạo các vé mặc định, lưu trữ và trả về
        const defaultTickets = getDefaultMockTickets();
        localStorage.setItem(USER_TICKETS_KEY, JSON.stringify(defaultTickets));
        return defaultTickets;

    } catch (error) {
        console.error("Không thể lấy/đặt vé giả trong localStorage:", error);
        // Trả về vé mặc định mà không lưu trữ nếu localStorage thất bại
        return getDefaultMockTickets();
    }
};
