
import { supabase } from './supabase';
import type { Event, Ticket, TicketType } from '../types';
import type { CartItem, AttendeeInfo } from '../stores/cartStore';
// FIX: Import PostgrestResponse to create a more specific type for the withTimeout helper,
// which helps TypeScript correctly infer the shape of the Supabase response.
import type { PostgrestResponse } from '@supabase/supabase-js';

const API_TIMEOUT = 8000; // 8 seconds

/**
 * Wraps a promise with a timeout. If the promise does not resolve or reject
 * within the specified time, it will be rejected with a timeout error.
 * @param promise The promise to wrap.
 * @param ms The timeout duration in milliseconds.
 * @returns A new promise that will either resolve with the original promise's value or reject.
 */
// FIX: Changed the function signature to accept a `PromiseLike<T>` instead of `Promise<T>`.
// Supabase query builders are "thenable" (PromiseLike) but not strict Promises. This change
// allows TypeScript to correctly infer the response type, fixing errors where `data` and `error`
// properties were not found on the awaited result.
const withTimeout = <T>(promise: PromiseLike<PostgrestResponse<T>>, ms: number): Promise<PostgrestResponse<T>> => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error(`API call timed out after ${ms}ms`));
        }, ms);

        promise.then(
            (res) => {
                clearTimeout(timeoutId);
                resolve(res);
            },
            (err) => {
                clearTimeout(timeoutId);
                reject(err);
            }
        );
    });
};


const transformEventData = (event: any): Event => {
    if (!event) return event;
    const organizerData = event.organizations; 
    return {
        id: event.id,
        name: event.name,
        description: event.description,
        bannerUrl: event.banner_url,
        startTime: new Date(event.start_time),
        endTime: new Date(event.end_time),
        locationName: event.location_name,
        locationAddress: event.location_address,
        coordinates: event.coordinates,
        organizer_id: event.organizer_id,
        category: event.category,
        ticketTypes: event.ticket_types || [],
        organizer: organizerData ? {
            id: organizerData.id,
            name: organizerData.name,
            description: organizerData.description,
            logoUrl: organizerData.logo_url
        } : null,
    };
};

export const getEvents = async (): Promise<Event[]> => {
  const query = supabase
    .from('events')
    .select('*, organizations(*)') 
    .order('start_time', { ascending: true });
  
  const { data, error } = await withTimeout(query, API_TIMEOUT);
  
  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
  
  return data.map(transformEventData);
};

export const getTrendingEvents = async (): Promise<Event[]> => {
  const query = supabase
    .from('events')
    .select('*, organizations(*)')
    .order('start_time', { ascending: true })
    .limit(4);

  const { data, error } = await withTimeout(query, API_TIMEOUT);

  if (error) {
    console.error('Error fetching trending events:', error);
    throw error;
  }
  return data.map(transformEventData);
};

export const getUpcomingEvents = async (): Promise<Event[]> => {
  const query = supabase
    .from('events')
    .select('*, organizations(*)')
    .gt('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(5);

  const { data, error } = await withTimeout(query, API_TIMEOUT);

  if (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
  return data.map(transformEventData);
};


export const getEventById = async (id: string): Promise<Event | null> => {
    const query = supabase
        .from('events')
        .select('*, organizations(*)')
        .eq('id', id)
        .single();

    const { data, error } = await withTimeout(query, API_TIMEOUT);

    if (error) {
        console.error(`Error fetching event ${id}:`, error);
        return null;
    }

    return transformEventData(data);
};

export const getMyTickets = async (userId: string): Promise<Ticket[]> => {
    const query = supabase
        .from('tickets')
        .select('*, events(*, organizations(*))')
        .eq('user_id', userId);

    const { data, error } = await withTimeout(query, API_TIMEOUT);

    if (error) {
        console.error('Error fetching user tickets:', error);
        throw error;
    }

    return data.map(ticket => ({
        id: ticket.id,
        purchaseDate: new Date(ticket.purchase_date),
        qrCode: ticket.qr_code,
        event: transformEventData(ticket.events),
        ticketType: ticket.ticket_type
    }));
};

export const createTickets = async (
  payload: { items: CartItem[]; attendeeInfo: Record<string, AttendeeInfo> },
  userId: string
): Promise<{ success: boolean; error?: any }> => {
  const { items, attendeeInfo } = payload;

  const newTickets = items.flatMap(item => {
    return Array.from({ length: item.quantity }, (_, i) => {
      const attendeeInfoKey = `${item.ticketTypeId}_${i}`;
      const attendee = attendeeInfo[attendeeInfoKey];
      
      return {
        event_id: item.eventId,
        user_id: userId,
        ticket_type: {
          id: item.ticketTypeId,
          name: item.ticketName,
          price: item.price,
          attendee: attendee || {},
        },
        qr_code: `evtfi-qr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      };
    });
  });

  if (newTickets.length === 0) {
    return { success: false, error: { message: "No tickets to create." } };
  }

  const query = supabase.from('tickets').insert(newTickets);
  const { error } = await withTimeout(query, API_TIMEOUT);

  if (error) {
    console.error('Error creating tickets:', error);
    return { success: false, error };
  }

  return { success: true };
};

// --- Organizer Event Management ---

export const createEvent = async (eventData: Partial<Event>, organizerId: string): Promise<Event> => {
  const query = supabase
    .from('events')
    .insert([{
      name: eventData.name,
      description: eventData.description,
      banner_url: eventData.bannerUrl,
      start_time: eventData.startTime,
      end_time: eventData.endTime,
      location_name: eventData.locationName,
      location_address: eventData.locationAddress,
      category: eventData.category,
      organizer_id: organizerId,
      ticket_types: eventData.ticketTypes,
    }])
    .select()
    .single();

  const { data, error } = await withTimeout(query, API_TIMEOUT);

  if (error) throw error;
  return transformEventData(data);
};

export const updateEvent = async (eventId: string, eventData: Partial<Event>): Promise<Event> => {
  const query = supabase
    .from('events')
    .update({
      name: eventData.name,
      description: eventData.description,
      banner_url: eventData.bannerUrl,
      start_time: eventData.startTime,
      end_time: eventData.endTime,
      location_name: eventData.locationName,
      location_address: eventData.locationAddress,
      category: eventData.category,
      ticket_types: eventData.ticketTypes,
    })
    .eq('id', eventId)
    .select()
    .single();
    
  const { data, error } = await withTimeout(query, API_TIMEOUT);
    
  if (error) throw error;
  return transformEventData(data);
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  const query = supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  const { error } = await withTimeout(query, API_TIMEOUT);

  if (error) throw error;
};
