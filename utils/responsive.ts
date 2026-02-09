import { Dimensions } from 'react-native';

// Get device dimensions
const { width, height } = Dimensions.get('window');

// Design reference base (iPhone X/11/12/13 standard size)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Width Percentage
 * Converts percentage to actual screen width
 * @param percentage - percentage of screen width (0-100)
 * @returns scaled width value
 */
export const wp = (percentage: number): number => {
    return (width * percentage) / 100;
};

/**
 * Height Percentage
 * Converts percentage to actual screen height
 * @param percentage - percentage of screen height (0-100)
 * @returns scaled height value
 */
export const hp = (percentage: number): number => {
    return (height * percentage) / 100;
};

/**
 * Font Size Scaling
 * Scales font size based on screen width relative to base width
 * @param size - base font size
 * @returns scaled font size
 */
export const fp = (size: number): number => {
    return (width / BASE_WIDTH) * size;
};

/**
 * Spacing Scaling
 * Scales spacing (padding, margin) based on average of screen dimensions
 * Uses average of width and height for balanced scaling
 * @param size - base spacing size
 * @returns scaled spacing value
 */
export const sp = (size: number): number => {
    const scale = (width + height) / (BASE_WIDTH + BASE_HEIGHT);
    return size * scale;
};

/**
 * Get responsive dimensions
 * Helper to get current screen dimensions
 */
export const getScreenDimensions = () => {
    return {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        isSmallDevice: width < 375,
        isMediumDevice: width >= 375 && width < 414,
        isLargeDevice: width >= 414,
    };
};
