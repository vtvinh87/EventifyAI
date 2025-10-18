import { create } from 'zustand';

interface UIState {
  isChatbotOpen: boolean;
  toggleChatbot: () => void;
  isLoading: boolean;
  error: string | null;
  setLoading: (status: boolean) => void;
  setError: (message: string | null) => void;
  clearError: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isChatbotOpen: false,
  toggleChatbot: () => set((state) => ({ isChatbotOpen: !state.isChatbotOpen })),
  isLoading: false,
  error: null,
  setLoading: (status) => set({ isLoading: status }),
  setError: (message) => set({ error: message, isLoading: false }), // Tự động tắt loading khi có lỗi
  clearError: () => set({ error: null }),
}));