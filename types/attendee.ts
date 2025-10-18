export interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  checkedIn: boolean;
  checkInTime?: Date;
}
