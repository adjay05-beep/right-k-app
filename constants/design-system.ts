
export const COLORS = {
    // Brand Colors
    primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6', // Main Primary
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
    },
    secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
    },

    // Semaphore
    success: {
        light: '#dcfce7',
        main: '#10b981',
        dark: '#047857',
    },
    warning: {
        light: '#fef9c3',
        main: '#f59e0b',
        dark: '#b45309',
    },
    error: {
        light: '#fee2e2',
        main: '#ef4444',
        dark: '#b91c1c',
    },
    info: {
        light: '#e0f2fe',
        main: '#0ea5e9',
        dark: '#0369a1',
    },

    // Feature Themes (preserving existing identities)
    salary: {
        light: '#d1fae5',
        main: '#059669', // Emerald
        dark: '#064e3b',
    },
    visa: {
        light: '#fbcfe8',
        main: '#db2777', // Pink
        dark: '#831843',
    },

    // Neutrals
    white: '#ffffff',
    black: '#000000',
    background: '#f9fafb', // Gray 50
    surface: '#ffffff',
    border: '#e5e7eb', // Gray 200
    text: {
        primary: '#111827', // Gray 900
        secondary: '#4b5563', // Gray 600
        tertiary: '#9ca3af', // Gray 400
        inverse: '#ffffff',
    }
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

export const SHADOWS = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
};

export const TYPOGRAPHY = {
    h1: {
        fontSize: 28,
        fontWeight: '700' as const,
        color: COLORS.text.primary,
    },
    h2: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: COLORS.text.primary,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        color: COLORS.text.primary,
    },
    h4: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: COLORS.text.primary,
    },
    body: {
        fontSize: 16,
        color: COLORS.text.secondary,
    },
    caption: {
        fontSize: 14,
        color: COLORS.text.tertiary,
    },
    label: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: COLORS.text.secondary,
        marginBottom: SPACING.xs,
    }
};
