import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../../constants/design-system';
import { Post } from '../../store/communityStore';
import { communityService } from '../../utils/communityService';

export const CommunityPreview = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecentPosts = async () => {
            try {
                const recent = await communityService.getPostsByCountry('ALL', 5);
                setPosts(recent as any);
            } catch (error) {
                console.error('[CommunityPreview] Error:', error);
            } finally {
                setLoading(false);
            }
        };
        loadRecentPosts();
    }, []);

    if (loading) return <ActivityIndicator style={{ marginVertical: 20 }} />;
    if (posts.length === 0) return null;

    const formatTime = (timestamp: any) => {
        if (!timestamp) return '';
        const now = new Date();
        const postDate = new Date(timestamp.seconds * 1000);
        const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 24) {
            return `${diffInHours}h`;
        }
        return `${Math.floor(diffInHours / 24)}d`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('community.recentPosts')}</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/community')}>
                    <Text style={styles.viewAll}>{t('dashboard.readMore')}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={posts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push('/(tabs)/community')}
                        activeOpacity={0.9}
                    >
                        {/* Header: Community Info */}
                        <View style={styles.cardHeader}>
                            <View style={styles.communityBadge}>
                                <Text style={styles.communityIcon}>r/</Text>
                            </View>
                            <View>
                                <Text style={styles.communityName}>{item.communityId || 'General'}</Text>
                                <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
                            </View>
                        </View>

                        {/* Content */}
                        <Text style={styles.postTitle} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.postContent} numberOfLines={2}>{item.content}</Text>

                        {/* Footer: Stats */}
                        <View style={styles.footer}>
                            <View style={styles.statItem}>
                                <MaterialIcons name="favorite-border" size={16} color={COLORS.text.tertiary} />
                                <Text style={styles.statText}>{item.likes || 0}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <MaterialIcons name="chat-bubble-outline" size={16} color={COLORS.text.tertiary} />
                                <Text style={styles.statText}>{item.commentCount || 0}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: SPACING.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text.primary,
        letterSpacing: -0.5,
    },
    viewAll: {
        fontSize: 14,
        color: COLORS.primary[600],
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
    },
    card: {
        width: 260,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    communityBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    communityIcon: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.primary[700],
    },
    communityName: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    timeText: {
        fontSize: 10,
        color: COLORS.text.tertiary,
    },
    postTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginBottom: 6,
        lineHeight: 20,
    },
    postContent: {
        fontSize: 13,
        color: COLORS.text.secondary,
        lineHeight: 18,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statText: {
        fontSize: 11,
        color: COLORS.text.secondary,
        fontWeight: '500',
        marginLeft: 4,
    },
});
