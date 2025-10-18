import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Event, TicketType } from '../types';

export interface CartItem {
  eventId: string;
  eventName:string;
  ticketTypeId: string;
  ticketName: string;
  price: number;
  quantity: number;
}

// Represents a single ticket instance that needs attendee info
export interface TicketInstance {
    id: string; // e.g., 'ticketTypeId_0'
    ticketTypeName: string;
}

export type AttendeeInfo = Record<string, string>; // e.g., { fullName: 'John Doe', email: '...' }

interface CartState {
  items: CartItem[];
  attendeeInfo: Record<string, AttendeeInfo>; // Maps ticketInstance.id to AttendeeInfo
  paymentStatus: 'idle' | 'processing' | 'success' | 'error';
  setTicketQuantity: (event: Pick<Event, 'id' | 'name'>, ticketType: Pick<TicketType, 'id' | 'name' | 'price' | 'remaining'>, quantity: number) => void;
  setAttendeeInfo: (ticketInstanceId: string, info: AttendeeInfo) => void;
  setPaymentStatus: (status: CartState['paymentStatus']) => void;
  clearCart: () => void;
  // Selectors
  getTicketInstances: () => TicketInstance[];
  totalItems: () => number;
  totalCost: () => number;
  // FIX: Added missing selectors for event-specific totals.
  getEventTotalTickets: (eventId: string) => number;
  getEventTotalCost: (eventId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      attendeeInfo: {},
      paymentStatus: 'idle',

      setTicketQuantity: (event, ticketType, quantity) => {
        const clampedQuantity = Math.max(0, Math.min(quantity, ticketType.remaining));

        set(state => {
          const existingItemIndex = state.items.findIndex(
            item => item.eventId === event.id && item.ticketTypeId === ticketType.id
          );

          if (clampedQuantity === 0) {
            if (existingItemIndex > -1) {
              const newItems = state.items.filter(item => item.ticketTypeId !== ticketType.id || item.eventId !== event.id);
              // Also remove associated attendee info
              const newAttendeeInfo = { ...state.attendeeInfo };
              Object.keys(newAttendeeInfo).forEach(key => {
                  if (key.startsWith(ticketType.id)) {
                      delete newAttendeeInfo[key];
                  }
              });
              return { items: newItems, attendeeInfo: newAttendeeInfo };
            }
            return state;
          }

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity = clampedQuantity;
            return { items: newItems };
          } else {
            const newItem: CartItem = {
              eventId: event.id,
              eventName: event.name,
              ticketTypeId: ticketType.id,
              ticketName: ticketType.name,
              price: ticketType.price,
              quantity: clampedQuantity,
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      setAttendeeInfo: (ticketInstanceId, info) => {
          set(state => ({
              attendeeInfo: {
                  ...state.attendeeInfo,
                  [ticketInstanceId]: info,
              }
          }));
      },
      
      setPaymentStatus: (status) => set({ paymentStatus: status }),

      clearCart: () => set({ items: [], attendeeInfo: {}, paymentStatus: 'idle' }),

      // --- Selectors ---
      getTicketInstances: () => {
          const { items } = get();
          return items.flatMap(item => 
              Array.from({ length: item.quantity }, (_, i) => ({
                  id: `${item.ticketTypeId}_${i}`,
                  ticketTypeName: item.ticketName,
              }))
          );
      },

      totalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      totalCost: () => {
          const { items } = get();
          return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      // FIX: Implemented missing selectors for event-specific totals.
      getEventTotalTickets: (eventId: string) => {
        const { items } = get();
        return items
          .filter(item => item.eventId === eventId)
          .reduce((total, item) => total + item.quantity, 0);
      },
      
      getEventTotalCost: (eventId: string) => {
          const { items } = get();
          return items
            .filter(item => item.eventId === eventId)
            .reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'eventify-cart-storage',
    }
  )
);