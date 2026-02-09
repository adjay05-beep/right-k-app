import { MaterialIcons } from '@expo/vector-icons';
import { getLocales } from 'expo-localization';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../../constants/design-system';
import { translateTexts } from '../../utils/aiService';
import { fetchNews, NewsItem } from '../../utils/newsService';

export const HomeNews = () => {
    const { t, i18n } = useTranslation();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Get device language code (e.g., 'ko', 'en', 'vi')
    const currentLang = i18n.language || getLocales()[0]?.languageCode || 'ko';

    useEffect(() => {
        loadNews();
    }, [currentLang]);

    const loadNews = async (query?: string) => {
        setLoading(true);
        try {
            // 1. Fetch raw Korean news (user query or default)
            const items = await fetchNews(query);

            // 2. Translate if not Korean
            if (currentLang !== 'ko' && items.length > 0) {
                const titles = items.map(item => item.title);
                const translatedTitles = await translateTexts(titles, currentLang);

                // Merge translated titles back
                const translatedItems = items.map((item, index) => ({
                    ...item,
                    title: translatedTitles[index] || item.title, // Fallback to original
                    source: "Google News (Translated)"
                }));
                setNews(translatedItems);
            } else {
                setNews(items);
            }
            setCurrentPage(1); // Reset to first page on new load
        } catch (e) {
            console.error("News Load Error:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            loadNews(); // Load default
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        loadNews(searchQuery);
    };

    const handlePress = (link: string) => {
        Linking.openURL(link).catch(err => console.error("Couldn't load page", err));
    };

    const totalPages = Math.ceil(news.length / itemsPerPage);
    const paginatedNews = news.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>{t('dashboard.updates')}</Text>
                <MaterialIcons name="rss-feed" size={18} color={COLORS.primary[500]} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder={currentLang === 'ko' ? t('news.searchPlaceholder') : t('news.searchPlaceholderEn')}
                    placeholderTextColor={COLORS.text.tertiary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity onPress={handleSearch}>
                    <MaterialIcons name="search" size={24} color={COLORS.primary[600]} />
                </TouchableOpacity>
            </View>

            {/* News List or Loading */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary[500]} />
                </View>
            ) : paginatedNews.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>{t('news.noNews')}</Text>
                    <TouchableOpacity onPress={() => loadNews()}>
                        <Text style={styles.retryText}>{t('news.retry')}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    {paginatedNews.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.item}
                            activeOpacity={0.7}
                            onPress={() => handlePress(item.link)}
                        >
                            <View style={styles.content}>
                                <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                                <View style={styles.metaRow}>
                                    <Text style={styles.source}>{item.source}</Text>
                                    <Text style={styles.newsDate}>{item.pubDate}</Text>
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color={COLORS.text.tertiary} />
                        </TouchableOpacity>
                    ))}

                    {/* Pagination UI */}
                    {totalPages > 1 && (
                        <View style={styles.paginationContainer}>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[
                                        styles.pageButton,
                                        currentPage === i + 1 && styles.activePageButton
                                    ]}
                                    onPress={() => setCurrentPage(i + 1)}
                                >
                                    <Text style={[
                                        styles.pageText,
                                        currentPage === i + 1 && styles.activePageText
                                    ]}>
                                        {i + 1}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
        marginBottom: SPACING.xxl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text.primary,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    content: {
        flex: 1,
        marginRight: SPACING.md,
    },
    newsTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.text.primary,
        marginBottom: 6,
        lineHeight: 22,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    source: {
        fontSize: 12,
        color: COLORS.primary[500],
        fontWeight: '600',
    },
    newsDate: {
        fontSize: 12,
        color: COLORS.text.tertiary,
    },
    emptyContainer: {
        paddingVertical: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.secondary[50],
        borderRadius: 8,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.text.tertiary,
        marginBottom: 8,
    },
    retryButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    retryText: {
        fontSize: 13,
        color: COLORS.primary[500],
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.secondary[50], // Light grey background
        borderRadius: 8,
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.md,
        height: 44,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text.primary,
        paddingVertical: 8,
    },
    searchButton: {
        padding: 4,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.lg,
        gap: 8,
    },
    pageButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.secondary[50],
    },
    activePageButton: {
        backgroundColor: COLORS.primary[500],
    },
    pageText: {
        fontSize: 14,
        color: COLORS.text.secondary,
        fontWeight: '500',
    },
    activePageText: {
        color: '#FFFFFF',
    }
});
