import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreatePostModal } from '../../components/community/CreatePostModal';
import { PostCard } from '../../components/community/PostCard';
import { PostOptionsModal } from '../../components/community/PostOptionsModal';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/design-system';
import { useAuthStore } from '../../store/authStore';
import { Post, useCommunityStore } from '../../store/communityStore';
import { useVisaStore } from '../../store/visaStore';
import { communityService } from '../../utils/communityService';
import { auth } from '../../utils/firebase';

const COUNTRIES = [
    { id: 'ALL', name: 'All Threads', emoji: '🌐' },
    { id: 'PH', name: 'Philippines', emoji: '🇵🇭' },
    { id: 'VN', name: 'Vietnam', emoji: '🇻🇳' },
    { id: 'KH', name: 'Cambodia', emoji: '🇰🇭' },
    { id: 'UZ', name: 'Uzbekistan', emoji: '🇺🇿' },
    { id: 'TH', name: 'Thailand', emoji: '🇹🇭' },
    { id: 'MM', name: 'Myanmar', emoji: '🇲🇲' },
    { id: 'NP', name: 'Nepal', emoji: '🇳🇵' },
];

export default function CommunityScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const {
        posts,
        selectedCountry,
        isLoading,
        setPosts,
        setSelectedCountry,
        setLoading
    } = useCommunityStore();
    const { name: userName, country: userCountry } = useVisaStore();
    const { user } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    // Post Options Modal State
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | undefined>(undefined);

    const authorName = userName || auth.currentUser?.displayName || t('dashboard.guest');
    const authorId = auth.currentUser?.uid || 'guest';
    const insets = useSafeAreaInsets();
    const headerHeight = insets.top + 60;

    // Find selected country object
    const selectedCountryObj = COUNTRIES.find(c => c.id === selectedCountry) || COUNTRIES[0];

    useEffect(() => {
        loadPosts();
    }, [selectedCountry]);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const fetchedPosts = await communityService.getPostsByCountry(selectedCountry);
            setPosts(fetchedPosts as any);
        } catch (error) {
            console.error('Failed to load posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadPosts();
        setRefreshing(false);
    };

    const handleSelectCountry = (countryId: string) => {
        setSelectedCountry(countryId);
        setDropdownVisible(false);
    };

    return (
        <View style={styles.container}>
            <ScreenHeader title={t('community.title')} />

            {/* Filter Dropdown Area */}
            <View style={[styles.filterContainer, { marginTop: headerHeight }]}>
                <TouchableOpacity
                    style={styles.dropdownTrigger}
                    onPress={() => setDropdownVisible(true)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.dropdownEmoji}>{selectedCountryObj.emoji}</Text>
                    <Text style={styles.dropdownText}>
                        {selectedCountry === 'ALL' ? t('community.allCountries') : t(`salary.countries.${selectedCountry}`, selectedCountryObj.name)}
                    </Text>
                    <MaterialIcons name="keyboard-arrow-down" size={20} color={COLORS.text.primary} />
                </TouchableOpacity>
            </View>

            {/* Feed */}
            {
                isLoading && !refreshing ? (
                    <ActivityIndicator style={{ marginTop: 50 }} color={COLORS.primary[600]} />
                ) : (
                    <FlatList
                        data={posts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <PostCard
                                post={item as any}
                                onOptionsPress={(post, position) => {
                                    setSelectedPost(post);
                                    setMenuPosition(position);
                                    setOptionsModalVisible(true);
                                }}
                            />
                        )}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        contentContainerStyle={styles.feedContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>{t('community.noPosts')}</Text>
                            </View>
                        }
                    />
                )
            }

            {/* Dropdown Modal */}
            <Modal
                visible={dropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setDropdownVisible(false)}
                >
                    <View style={styles.dropdownMenu}>
                        <FlatList
                            data={COUNTRIES}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.dropdownItem,
                                        selectedCountry === item.id && styles.dropdownItemActive
                                    ]}
                                    onPress={() => handleSelectCountry(item.id)}
                                >
                                    <Text style={styles.dropdownItemIcon}>{item.emoji}</Text>
                                    <View style={styles.dropdownItemTextContainer}>
                                        <Text style={[
                                            styles.dropdownItemText,
                                            selectedCountry === item.id && styles.dropdownItemTextActive
                                        ]}>
                                            {item.id === 'ALL' ? t('community.allCountries') : t(`salary.countries.${item.id}`, item.name)}
                                        </Text>
                                        {selectedCountry === item.id && (
                                            <MaterialIcons name="check" size={16} color={COLORS.primary[600]} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.8}
                onPress={() => {
                    if (!userName || !userCountry) {
                        Alert.alert(
                            t('community.verificationRequired'),
                            t('community.verificationRequiredDesc'),
                            [
                                { text: t('common.cancel'), style: 'cancel' },
                                { text: t('common.verifyNow'), onPress: () => router.push('/(tabs)/profile') }
                            ]
                        );
                        return;
                    }
                    setModalVisible(true);
                }}
            >
                <MaterialIcons name="add" size={28} color="white" />
            </TouchableOpacity>

            <CreatePostModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    onRefresh(); // Refresh feed after posting
                }}
                communityId={selectedCountry}
                authorId={authorId}
                authorName={authorName}
            />

            {/* Post Options Modal */}
            <PostOptionsModal
                visible={optionsModalVisible}
                onClose={() => {
                    setOptionsModalVisible(false);
                    setSelectedPost(null);
                }}
                isAuthor={selectedPost?.authorId === user?.uid}
                position={menuPosition}
                onEdit={() => {
                    setOptionsModalVisible(false);
                    alert(t('community.featureInProgress'));
                }}
                onDelete={() => {
                    setOptionsModalVisible(false);
                    if (confirm(t('community.confirmDelete'))) {
                        alert(t('community.deleteInProgress'));
                    }
                }}
                onReport={() => {
                    setOptionsModalVisible(false);
                    alert(t('community.reportSubmitted'));
                }}
                onBlock={() => {
                    setOptionsModalVisible(false);
                    alert(t('community.userBlocked'));
                }}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    filterContainer: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.sm,
        zIndex: 5,
        alignItems: 'flex-start',
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    dropdownEmoji: {
        fontSize: 16,
        marginRight: 8,
    },
    dropdownText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginRight: 4,
    },
    feedContent: {
        padding: SPACING.lg,
        paddingBottom: 100, // Extra space for FAB
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.text.tertiary,
        fontSize: 14,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.md,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownMenu: {
        width: '80%',
        maxHeight: '60%',
        backgroundColor: 'white',
        borderRadius: RADIUS.lg,
        paddingVertical: SPACING.sm,
        ...SHADOWS.lg,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    dropdownItemActive: {
        backgroundColor: COLORS.primary[50],
    },
    dropdownItemIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    dropdownItemTextContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownItemText: {
        fontSize: 16,
        color: COLORS.text.primary,
    },
    dropdownItemTextActive: {
        color: COLORS.primary[600],
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: '#F1F3F5',
        marginHorizontal: 20,
    },
});
