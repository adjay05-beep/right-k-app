import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface VisaState {
    visaType: string;
    expiryDate: string | null; // ISO Date String YYYY-MM-DD
    issueDate: string | null; // ISO Date String YYYY-MM-DD
    entryDate: string | null; // ISO Date String YYYY-MM-DD
    regNumber?: string;
    name?: string;
    country?: string;

    setVisaDetails: (details: Partial<Omit<VisaState, 'setVisaDetails' | 'reset'>>) => void;
    reset: () => void;
}

import { Platform } from 'react-native';

// Custom storage adapter for Expo SecureStore
const secureStorage = {
    getItem: async (name: string): Promise<string | null> => {
        if (Platform.OS === 'web' || typeof window !== 'undefined') {
            const value = localStorage.getItem(name);
            // console.log(`[Store] Load ${name}:`, value); // Debug
            return value;
        }
        return await SecureStore.getItemAsync(name);
    },
    setItem: async (name: string, value: string): Promise<void> => {
        if (Platform.OS === 'web' || typeof window !== 'undefined') {
            localStorage.setItem(name, value);
            // console.log(`[Store] Save ${name}:`, value); // Debug
            return;
        }
        await SecureStore.setItemAsync(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        if (Platform.OS === 'web' || typeof window !== 'undefined') {
            localStorage.removeItem(name);
            return;
        }
        await SecureStore.deleteItemAsync(name);
    },
};

export const useVisaStore = create<VisaState>()(
    persist(
        (set) => ({
            visaType: 'E-9',
            expiryDate: '2025-12-31',
            issueDate: '2024-09-02',
            entryDate: '2024-09-01',
            regNumber: '',
            name: '',
            country: '',

            setVisaDetails: (details) => set((state) => ({ ...state, ...details })),
            reset: () => set({ visaType: '', expiryDate: null, issueDate: null, entryDate: null, regNumber: '', name: '', country: '' }),
        }),
        {
            name: 'visa-storage',
            storage: createJSONStorage(() => secureStorage),
            version: 1, // Force cache invalidation if schema changes
        }
    )
);
