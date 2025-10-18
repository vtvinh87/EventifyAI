


export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: 'attendee' | 'organizer';
  interests?: string[];
}

export interface Organizer {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  startTime: Date;
  endTime: Date;
  locationName: string;
  locationAddress: string;
  coordinates?: { lat: number; lng: number; };
  organizer_id: string;
  organizer: Organizer;
  category: string;
  ticketTypes: TicketType[];
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  remaining: number;
  benefits?: string[];
}

export interface Ticket {
  id: string;
  event: Event;
  ticketType: TicketType;
  purchaseDate: Date;
  qrCode: string;
}

export interface Attendee {
  id:string;
  name: string;
  email: string;
  checkedIn: boolean;
  checkInTime?: Date;
  // FIX: Add missing ticketType property to match the definition required by dashboard features.
  ticketType: string;
}

export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  attendeeName: string;
}

export interface AISentimentAnalysis {
    sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
    confidence: number;
}

export interface AITopicAnalysis {
    topics: string[];
}