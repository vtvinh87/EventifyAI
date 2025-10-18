
import { supabase } from './supabase';
import type { Event, Ticket } from '../types';
import type { CartItem, AttendeeInfo } from '../stores/cartStore';

const transformEventData = (event: any): Event => {
    if (!event) return event;
    // Supabase returns the joined table data under the name used in the select statement.
    // The table name is 'organizations', so the data will be in event.organizations.
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
        ticketTypes: event.ticket_types || [], // Assume ticket_types is a JSONB column
        organizer: organizerData ? { // Check if organizerData exists before mapping
            id: organizerData.id,
            name: organizerData.name,
            description: organizerData.description,
            logoUrl: organizerData.logo_url
        } : null, // Handle case where organizer might be null
    };
};

export const getEvents = async (): Promise<Event[]> => {
  // FIX: Changed the joined table name from 'organizers' to 'organizations' to match the database schema.
  const { data, error } = await supabase
    .from('events')
    .select('*, organizations(*)') 
    .order('start_time', { ascending: true });
  
  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
  
  return data.map(transformEventData);
};

export const getTrendingEvents = async (): Promise<Event[]> => {
  // FIX: Changed the joined table name from 'organizers' to 'organizations'.
  const { data, error } = await supabase
    .from('events')
    .select('*, organizations(*)')
    .order('start_time', { ascending: true })
    .limit(4);

  if (error) {
    console.error('Error fetching trending events:', error);
    throw error;
  }
  return data.map(transformEventData);
};

export const getUpcomingEvents = async (): Promise<Event[]> => {
  // FIX: Changed the joined table name from 'organizers' to 'organizations'.
  const { data, error } = await supabase
    .from('events')
    .select('*, organizations(*)')
    .gt('start_time', new Date().toISOString()) // Filter for events starting in the future
    .order('start_time', { ascending: true })
    .limit(5);

  if (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
  return data.map(transformEventData);
};


export const getEventById = async (id: string): Promise<Event | null> => {
    // FIX: Changed the joined table name from 'organizers' to 'organizations'.
    const { data, error } = await supabase
        .from('events')
        .select('*, organizations(*)')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching event ${id}:`, error);
        return null;
    }

    return transformEventData(data);
};

export const getMyTickets = async (userId: string): Promise<Ticket[]> => {
    // FIX: Changed the nested joined table name from 'organizers' to 'organizations'.
    const { data, error } = await supabase
        .from('tickets')
        .select('*, events(*, organizations(*))')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching user tickets:', error);
        throw error;
    }

    // This transformation is more complex due to nested event data
    return data.map(ticket => ({
        id: ticket.id,
        purchaseDate: new Date(ticket.purchase_date),
        qrCode: ticket.qr_code,
        // The event data within the ticket needs transformation as well
        event: transformEventData(ticket.events),
        // Assume ticket_type is a JSONB column on the ticket row for simplicity
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
        ticket_type: { // This is the JSONB field
          id: item.ticketTypeId,
          name: item.ticketName,
          price: item.price,
          attendee: attendee || {}, // Include attendee info
        },
        qr_code: `evtfi-qr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      };
    });
  });

  if (newTickets.length === 0) {
    return { success: false, error: { message: "No tickets to create." } };
  }

  const { error } = await supabase.from('tickets').insert(newTickets);

  if (error) {
    console.error('Error creating tickets:', error);
    return { success: false, error };
  }

  return { success: true };
};
