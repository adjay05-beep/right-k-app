import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Save email to platform-specific storage
 * - Web: localStorage
 * - Mobile: SecureStore
 */
export const saveEmailToStorage = async (email: string): Promise<void> => {
    if (Platform.OS === 'web') {
        localStorage.setItem('saved_email', email);
    } else {
        await SecureStore.setItemAsync('saved_email', email);
    }
};

/**
 * Load email from platform-specific storage
 */
export const loadEmailFromStorage = async (): Promise<string | null> => {
    if (Platform.OS === 'web') {
        return localStorage.getItem('saved_email');
    } else {
        return await SecureStore.getItemAsync('saved_email');
    }
};

/**
 * Delete email from platform-specific storage
 */
export const deleteEmailFromStorage = async (): Promise<void> => {
    if (Platform.OS === 'web') {
        localStorage.removeItem('saved_email');
    } else {
        await SecureStore.deleteItemAsync('saved_email');
    }
};
