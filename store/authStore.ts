import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User
} from 'firebase/auth';
import { create } from 'zustand';
import { auth } from '../utils/firebase';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    checkUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    error: null,

    signIn: async (email, pass) => {
        set({ isLoading: true, error: null });
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            // State update is handled by onAuthStateChanged
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
            throw e;
        }
    },

    signUp: async (email, pass) => {
        set({ isLoading: true, error: null });
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
            // State update is handled by onAuthStateChanged
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
            throw e;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await signOut(auth);
            set({ user: null, isLoading: false });
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
        }
    },

    checkUser: () => {
        set({ isLoading: true });
        onAuthStateChanged(auth, (user) => {
            set({ user, isLoading: false });
        });
    }
}));

// Initialize the listener
useAuthStore.getState().checkUser();
