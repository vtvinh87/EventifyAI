import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface AppState {
  theme: Theme;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),
}));
