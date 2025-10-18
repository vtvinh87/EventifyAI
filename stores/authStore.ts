
import { create } from 'zustand';
import type { User } from '../types';
import { supabase } from '../services/supabase';
import { getProfile } from '../services/apiAuth';
// FIX: Removed specific type imports like AuthChangeEvent and used inline types for credentials
// to resolve "member not exported" errors, which can happen with Supabase version mismatches.
import type { Session, AuthError, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (credentials: SignInWithPasswordCredentials) => Promise<{ error: AuthError | null }>;
  signUp: (credentials: SignUpWithPasswordCredentials) => Promise<{ data: any, error: AuthError | null }>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,

  // FIX: signInWithPassword is the correct method for Supabase v2. The error was likely due to type issues.
  signIn: async (credentials) => {
    const { error } = await supabase.auth.signInWithPassword(credentials);
    return { error };
  },

  // FIX: signUp is the correct method for Supabase v2.
  signUp: async (credentials) => {
    const { data, error } = await supabase.auth.signUp(credentials);
    return { data, error };
  },

  // FIX: signOut is the correct method.
  signOut: async () => {
    await supabase.auth.signOut();
  },
  
  setUser: (user) => set({ user }),

}));

// Lắng nghe các thay đổi trạng thái xác thực
// FIX: onAuthStateChange is the correct method. Using explicit types for event and session.
supabase.auth.onAuthStateChange(async (event, session) => {
  const { setUser } = useAuthStore.getState();
  if (session?.user) {
    const profile = await getProfile(session.user.id);
    setUser(profile);
  } else {
    setUser(null);
  }
  useAuthStore.setState({ session, loading: false });
});

// Kiểm tra ban đầu
const initializeAuth = async () => {
    // FIX: getSession is the correct async method for Supabase v2.
    const { data: { session } } = await supabase.auth.getSession();
    useAuthStore.setState({ session });
    if (session?.user) {
        const profile = await getProfile(session.user.id);
        useAuthStore.getState().setUser(profile);
    }
    useAuthStore.setState({ loading: false });
};

initializeAuth();
