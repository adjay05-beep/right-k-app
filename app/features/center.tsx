import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { TextField } from '../../components/ui/TextField';
import { AgencyCategory, AgencyInfo } from '../../constants/agency-types';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/design-system';
import { findAgenciesByAddress } from '../../utils/agencyService';

import specializedAgencies from '../../assets/data/specialized_agencies.json';

export default function AgencyFinderScreen() {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<AgencyInfo[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<AgencyCategory>('immigration');

    const categories: AgencyCategory[] = ['immigration', 'community', 'plus', 'support'];

    // Categories that use static lists instead of search
    const isStaticCategory = (cat: AgencyCategory) => cat === 'plus' || cat === 'support';

    const handleCategoryChange = (category: AgencyCategory) => {
        setSelectedCategory(category);
        setSearchQuery('');

        if (isStaticCategory(category)) {
            // Load static data immediately
            const staticData = (specializedAgencies as any)[category] || [];
            // Map plain JSON to AgencyInfo structure if needed (already matches mostly)
            setResults(staticData);
            setHasSearched(true);
        } else {
            // Reset for search mode
            setHasSearched(false);
            setResults([]);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setHasSearched(true);

        // Simulate network delay
        setTimeout(async () => {
            const foundAgencies = await findAgenciesByAddress(searchQuery, selectedCategory);
            setResults(foundAgencies);
            setLoading(false);
        }, 500);
    };

    const openNaverMap = (address: string) => {
        const query = encodeURIComponent(address);
        const url = `https://map.naver.com/?query=${query}`;
        Linking.openURL(url);
    };



    const openGoogleMap = (address: string) => {
        const query = encodeURIComponent(address);
        Linking.openURL(`https://maps.google.com/?q=${query}`);
    };

    const getCategoryColor = (category: AgencyCategory): string => {
        switch (category) {
            case 'immigration': return COLORS.primary[600];
            case 'community': return COLORS.success.main;
            case 'plus': return '#E91E63'; // Distinction for Plus Centers
            case 'support': return '#FF9800'; // Orange for Support
            default: return COLORS.primary[600];
        }
    };

    const getCategoryIcon = (category: AgencyCategory): React.ComponentProps<typeof MaterialIcons>['name'] => {
        switch (category) {
            case 'immigration': return 'badge';
            case 'community': return 'location-city';
            case 'plus': return 'add-business';
            case 'support': return 'volunteer-activism';
            default: return 'location-city';
        }
    };

    const getCategoryLabel = (category: AgencyCategory) => {
        // Fallback labels until translation files are updated
        const labels: Record<string, string> = {
            immigration: '출입국',
            community: '주민센터',
            plus: '다문화플러스',
            support: '지원센터'
        };
        // return t(`agency.category.${category}`); // Use this after updating translations
        return labels[category] || category;
    }

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('agency.title')}
                subtitle={t('agency.subtitle')}
                colors={[COLORS.primary[600], COLORS.primary[500]]}
            />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Category Tabs */}
                <Card style={{ marginBottom: SPACING.md }}>
                    <Text style={styles.categoryLabel}>{t('agency.select_category')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                        <View style={styles.categoryContainer}>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category}
                                    style={[
                                        styles.categoryTab,
                                        selectedCategory === category && {
                                            backgroundColor: getCategoryColor(category),
                                            borderColor: getCategoryColor(category),
                                        }
                                    ]}
                                    onPress={() => handleCategoryChange(category)}
                                >
                                    <MaterialIcons
                                        name={getCategoryIcon(category)}
                                        size={20}
                                        color={selectedCategory === category ? COLORS.white : COLORS.text.secondary}
                                    />
                                    <Text style={[
                                        styles.categoryText,
                                        selectedCategory === category && styles.categoryTextActive
                                    ]}>
                                        {getCategoryLabel(category)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </Card>

                {/* Category Description & Search Area */}
                <Card style={{ marginBottom: SPACING.lg }}>
                    <View style={styles.descriptionHeader}>
                        <MaterialIcons
                            name={getCategoryIcon(selectedCategory)}
                            size={24}
                            color={getCategoryColor(selectedCategory)}
                        />
                        <Text style={styles.descriptionTitle}>
                            {getCategoryLabel(selectedCategory)}
                        </Text>
                    </View>
                    <Text style={styles.descriptionText}>
                        {/* Static descriptions for now to match new categories */}
                        {selectedCategory === 'immigration' && "외국인 등록, 비자 연장 등 출입국 관련 업무를 처리하는 관서입니다."}
                        {selectedCategory === 'community' && "전입신고, 인감증명 등 생활 민원 행정 서비스를 제공합니다."}
                        {selectedCategory === 'plus' && "법무부, 고용부, 지자체 업무를 한 곳에서 처리하는 원스톱 센터입니다."}
                        {selectedCategory === 'support' && "법률 상담, 생활 통역, 문화 프로그램 등 정착 지원 서비스를 제공합니다."}
                    </Text>

                    {/* Conditional Search Input - Only for Searchable Categories */}
                    {!isStaticCategory(selectedCategory) && (
                        <>
                            <TextField
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder={t('agency.input_placeholder')}
                                style={{ marginTop: SPACING.md, marginBottom: SPACING.md }}
                            />

                            <Button
                                title={t('agency.btn_search')}
                                onPress={handleSearch}
                                loading={loading}
                                icon={<MaterialIcons name="search" size={20} color={COLORS.white} />}
                                fullWidth
                            />


                        </>
                    )}
                </Card>

                {/* Empty State */}
                {hasSearched && results.length === 0 && !loading && (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="location-off" size={48} color={COLORS.text.tertiary} />
                        <Text style={styles.emptyText}>{t('agency.no_results')}</Text>
                    </View>
                )}

                {/* Results List */}
                {results.map((agency, index) => (
                    <Card key={index} style={{ marginBottom: SPACING.md }}>
                        {/* Category Badge */}
                        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(agency.category) }]}>
                            <MaterialIcons name={getCategoryIcon(agency.category)} size={14} color={COLORS.white} />
                            <Text style={styles.categoryBadgeText}>
                                {getCategoryLabel(agency.category)}
                            </Text>
                        </View>

                        <Text style={styles.resultTitle}>{agency.name}</Text>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="location-on" size={16} color={COLORS.text.secondary} />
                            <Text style={styles.resultAddress}>{agency.address}</Text>
                        </View>
                        <Text style={styles.resultPhone}>{agency.phone}</Text>

                        {/* Jurisdiction Info (Only for Immigration) */}
                        {
                            agency.jurisdiction && agency.jurisdiction.length > 0 && (
                                <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
                                    <MaterialIcons name="map" size={16} color={COLORS.primary[600]} style={{ marginTop: 2 }} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.resultAddress, { color: COLORS.primary[700], fontWeight: '600' }]}>
                                            관할:
                                        </Text>
                                        <Text style={styles.resultAddress}>
                                            {agency.jurisdiction.join(', ')}
                                        </Text>
                                    </View>
                                </View>
                            )
                        }

                        {/* Services List */}
                        {
                            agency.services && agency.services.length > 0 && (
                                <View style={styles.servicesContainer}>
                                    <Text style={styles.servicesTitle}>{t('agency.services')}:</Text>
                                    <View style={styles.servicesList}>
                                        {agency.services.map((service: string, sIdx: number) => (
                                            <View key={sIdx} style={styles.serviceBadge}>
                                                <Text style={styles.serviceText}>{service}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )
                        }

                        {/* Map Buttons */}
                        < View style={styles.mapButtonsContainer} >
                            <Button
                                title="네이버 지도"
                                onPress={() => openNaverMap(agency.address)}
                                variant="outline"
                                icon={<MaterialIcons name="map" size={18} color={COLORS.success.main} />}
                                style={styles.mapButton}
                            />
                            <Button
                                title="구글 지도"
                                onPress={() => openGoogleMap(agency.address)}
                                variant="outline"
                                icon={<MaterialIcons name="public" size={18} color={COLORS.primary[600]} />}
                                style={styles.mapButton}
                            />
                        </View>
                    </Card >
                ))
                }
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.lg,
        paddingTop: 120, // Clear absolute header
    },
    categoryLabel: {
        ...TYPOGRAPHY.caption,
        fontWeight: 'bold',
        color: COLORS.text.secondary,
        marginBottom: SPACING.sm,
    },
    categoryScroll: {
        marginHorizontal: -SPACING.md,
    },
    categoryContainer: {
        flexDirection: 'row',
        gap: SPACING.sm,
        paddingHorizontal: SPACING.md,
    },
    categoryTab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.full,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
    },
    categoryText: {
        ...TYPOGRAPHY.caption,
        fontWeight: '600',
        color: COLORS.text.secondary,
    },
    categoryTextActive: {
        color: COLORS.white,
    },
    descriptionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    descriptionTitle: {
        ...TYPOGRAPHY.h3,
        color: COLORS.primary[700],
    },
    descriptionText: {
        ...TYPOGRAPHY.body,
        color: COLORS.text.secondary,
        lineHeight: 22,
    },
    emptyState: {
        alignItems: 'center',
        padding: SPACING.xl,
    },
    emptyText: {
        ...TYPOGRAPHY.body,
        color: COLORS.text.tertiary,
        marginTop: SPACING.md,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
        marginBottom: SPACING.sm,
    },
    categoryBadgeText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 11,
    },
    resultTitle: {
        ...TYPOGRAPHY.h3,
        marginBottom: SPACING.xs,
        color: COLORS.primary[700],
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    resultAddress: {
        ...TYPOGRAPHY.body,
        flex: 1,
        color: COLORS.text.secondary,
    },
    resultPhone: {
        ...TYPOGRAPHY.body,
        color: COLORS.text.secondary,
    },
    servicesContainer: {
        backgroundColor: COLORS.secondary[50],
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
        marginTop: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    servicesTitle: {
        ...TYPOGRAPHY.caption,
        fontWeight: 'bold',
        color: COLORS.secondary[800],
        marginBottom: SPACING.xs,
    },
    servicesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    serviceBadge: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
        borderWidth: 1,
        borderColor: COLORS.secondary[200],
    },
    serviceText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.secondary[700],
        fontSize: 11,
    },
    mapButtonsContainer: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginTop: SPACING.sm,
    },
    mapButton: {
        flex: 1,
    },
});
