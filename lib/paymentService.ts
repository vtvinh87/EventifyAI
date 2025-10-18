
import type { CartItem, AttendeeInfo } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { createTickets } from '../services/apiEvents';

interface PaymentPayload {
    items: CartItem[];
    attendeeInfo: Record<string, AttendeeInfo>;
}

interface PaymentResponse {
    success: boolean;
    redirectUrl: string;
    message?: string;
}

/**
 * Creates a payment session by first saving tickets to the database.
 * In a real application, this would also integrate with a payment provider like Stripe.
 * @param payload - The cart data to be sent for payment processing.
 * @returns A promise that resolves with the payment session details.
 */
export const createPaymentSession = async (payload: PaymentPayload): Promise<PaymentResponse> => {
    console.log("Creating payment session with payload:", payload);

    // Get the current user from the authentication store
    const { user } = useAuthStore.getState();
    if (!user) {
        return {
            success: false,
            redirectUrl: '/login', // Redirect to login if user is not authenticated
            message: 'User is not authenticated.',
        };
    }

    // Simulate a short network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create the ticket records in the Supabase database
    const { success, error } = await createTickets(payload, user.id);

    if (success) {
        // If ticket creation is successful, proceed to the success page
        return {
            success: true,
            redirectUrl: '/payment/success',
        };
    } else {
        // If ticket creation fails, redirect to the cancellation page
        console.error("Failed to create tickets in database:", error);
        return {
            success: false,
            redirectUrl: '/payment/cancel',
            message: (error as any)?.message || 'Failed to save tickets to your account.',
        };
    }
};
