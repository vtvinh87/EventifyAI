import { create } from 'zustand';
import type { Event, Ticket, TicketType } from '../types';
import type { FilterState } from '../features/events/EventFilter';
import type { Attendee } from '../types/attendee';
import { MOCK_ATTENDEES } from '../constants';
import { useAuthStore } from './authStore';
import { useUIStore } from './uiStore';
import * as api from '../services/apiEvents';

const initialFilterState: FilterState = {
  keyword: '',
  category: 'all',
  date: 'any',
  location: '',
  price: 'any',
};

interface DashboardStats {
  totalRevenue: number;
  ticketsSold24h: number;
  totalCheckins: number;
  activeEvents: number;
}

interface EventState {
  events: Event[];
  filteredEvents: Event[];
  selectedEvent: Event | null;
  myTickets: Ticket[];
  filters: FilterState;
  organizerEvents: Event[];
  dashboardStats: DashboardStats | null;
  currentEventAttendees: Attendee[];
  
  fetchEvents: () => Promise<void>;
  fetchEventById: (id: string) => Promise<void>;
  fetchMyTickets: () => Promise<void>;
  setFilters: (newFilters: FilterState) => void;
  clearFilters: () => void;
  
  fetchOrganizerEvents: () => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  fetchEventAttendees: (eventId: string) => Promise<void>;
  createEvent: (eventData: Partial<Event>) => Promise<boolean>;
  updateEvent: (eventId: string, eventData: Partial<Event>) => Promise<boolean>;
  deleteEvent: (eventId: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  filteredEvents: [],
  selectedEvent: null,
  myTickets: [],
  filters: initialFilterState,
  
  organizerEvents: [],
  dashboardStats: null,
  currentEventAttendees: [],

  fetchEvents: async () => {
    const { setLoading, setError } = useUIStore.getState();
    setLoading(true);
    try {
      const events = await api.getEvents();
      set({
        events,
        filteredEvents: events,
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      setError(`Không thể tải sự kiện: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  },

  fetchEventById: async (id: string) => {
    const { setLoading, setError } = useUIStore.getState();
    setLoading(true);
    set({ selectedEvent: null });
    try {
      const event = await api.getEventById(id);
      if (event) {
        set({ selectedEvent: event });
      } else {
        throw new Error('Không tìm thấy sự kiện');
      }
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        setError(`Không thể tải chi tiết sự kiện: ${errorMessage}`);
    } finally {
        setLoading(false);
    }
  },

  fetchMyTickets: async () => {
    const { setLoading, setError } = useUIStore.getState();
    const { user } = useAuthStore.getState();

    if (!user) {
        console.log("No user session, cannot fetch tickets.");
        set({ myTickets: [] });
        return;
    }
    
    setLoading(true);
    try {
      const tickets = await api.getMyTickets(user.id);
      set({ myTickets: tickets });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error("Error fetching tickets:", errorMessage);
        setError(`Không thể tải vé của bạn: ${errorMessage}`);
    } finally {
        setLoading(false);
    }
  },

  setFilters: (newFilters: FilterState) => {
    set({ filters: newFilters });
    const { events } = get();
    let result = [...events];

    if (newFilters.keyword) {
      const keywordLower = newFilters.keyword.toLowerCase();
      result = result.filter(event =>
        event.name.toLowerCase().includes(keywordLower) ||
        event.description.toLowerCase().includes(keywordLower)
      );
    }
    if (newFilters.category && newFilters.category !== 'all') {
      result = result.filter(event => event.category === newFilters.category);
    }
    if (newFilters.location) {
        const locationLower = newFilters.location.toLowerCase();
        result = result.filter(event =>
            event.locationName.toLowerCase().includes(locationLower) ||
            event.locationAddress.toLowerCase().includes(locationLower)
        );
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (newFilters.date === 'today') {
        result = result.filter(event => new Date(event.startTime).toDateString() === now.toDateString());
    } else if (newFilters.date === 'this_week') {
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
        result = result.filter(event => new Date(event.startTime) >= now && new Date(event.startTime) <= endOfWeek);
    } else if (newFilters.date === 'this_month') {
        result = result.filter(event => 
            new Date(event.startTime).getMonth() === now.getMonth() && 
            new Date(event.startTime).getFullYear() === now.getFullYear()
        );
    }
    if (newFilters.price === 'free') {
        result = result.filter(event => event.ticketTypes.some(t => t.price === 0));
    } else if (newFilters.price === 'under_50') {
        result = result.filter(event => event.ticketTypes.some(t => t.price > 0 && t.price < 50));
    } else if (newFilters.price === 'over_100') {
        result = result.filter(event => event.ticketTypes.some(t => t.price > 100));
    }

    set({ filteredEvents: result });
  },

  clearFilters: () => {
    set(state => ({
      filters: initialFilterState,
      filteredEvents: state.events
    }));
  },
  
  fetchOrganizerEvents: async () => {
    const { setLoading, setError } = useUIStore.getState();
    const { user } = useAuthStore.getState();
    if (!user) return;

    setLoading(true);
    try {
        const allEvents = await api.getEvents();
        const organizerEvents = allEvents.filter(e => e.organizer_id === user.id);
        set({ organizerEvents });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        setError(`Không thể tải sự kiện của bạn: ${errorMessage}`);
    } finally {
        setLoading(false);
    }
  },

  fetchDashboardStats: async () => { /* Mock */ set({ dashboardStats: { totalRevenue: 55000, ticketsSold24h: 120, totalCheckins: 8430, activeEvents: 2 }})},
  
  fetchEventAttendees: async (eventId) => { /* Mock */ set({ currentEventAttendees: MOCK_ATTENDEES })},

  createEvent: async (eventData) => {
    const { setLoading, setError } = useUIStore.getState();
    const { user } = useAuthStore.getState();
    if (!user) {
        setError("Bạn phải đăng nhập để tạo sự kiện.");
        return false;
    }
    setLoading(true);
    try {
        const newEvent = await api.createEvent(eventData, user.id);
        set(state => ({
            organizerEvents: [...state.organizerEvents, newEvent],
        }));
        return true;
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        setError(`Không thể tạo sự kiện: ${errorMessage}`);
        return false;
    } finally {
        setLoading(false);
    }
  },

  updateEvent: async (eventId, eventData) => {
    const { setLoading, setError } = useUIStore.getState();
    setLoading(true);
    try {
        const updatedEvent = await api.updateEvent(eventId, eventData);
        set(state => ({
            organizerEvents: state.organizerEvents.map(e => e.id === eventId ? updatedEvent : e),
        }));
        return true;
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        setError(`Không thể cập nhật sự kiện: ${errorMessage}`);
        return false;
    } finally {
        setLoading(false);
    }
  },
  
  deleteEvent: async (eventId) => {
    const { setLoading, setError } = useUIStore.getState();
    const originalEvents = get().organizerEvents;
    // Optimistic update
    set(state => ({
        organizerEvents: state.organizerEvents.filter(e => e.id !== eventId)
    }));
    setLoading(true);
    try {
        await api.deleteEvent(eventId);
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        setError(`Không thể xóa sự kiện: ${errorMessage}`);
        // Revert on error
        set({ organizerEvents: originalEvents });
    } finally {
        setLoading(false);
    }
  },
}));