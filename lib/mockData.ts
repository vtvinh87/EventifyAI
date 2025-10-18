
export interface SelectedTicket {
  id: string;
  ticketTypeName: string;
}

export interface FormFieldSchema {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel';
  placeholder: string;
  required: boolean;
}

/**
 * Dữ liệu giả cho các vé đã được người dùng chọn trong giỏ hàng.
 * Mỗi vé trong mảng này sẽ yêu cầu một form thông tin người tham dự riêng.
 */
export const mockSelectedTickets: SelectedTicket[] = [
  { id: 'ticket_instance_1', ticketTypeName: 'Vé VIP' },
  { id: 'ticket_instance_2', ticketTypeName: 'Vé Phổ Thông' },
  { id: 'ticket_instance_3', ticketTypeName: 'Vé Phổ Thông' },
];

/**
 * Cấu trúc (schema) cho form đăng ký thông tin người tham dự.
 * Component AttendeeForm sẽ sử dụng schema này để render động các trường input.
 */
export const mockRegistrationSchema: FormFieldSchema[] = [
  {
    name: 'fullName',
    label: 'Họ và tên',
    type: 'text',
    placeholder: 'Nguyễn Văn A',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'email@example.com',
    required: true,
  },
  {
    name: 'phone',
    label: 'Số điện thoại (Tùy chọn)',
    type: 'tel',
    placeholder: '0901234567',
    required: false,
  },
];
