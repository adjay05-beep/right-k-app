import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { TextField } from '../../components/ui/TextField';
import { AgencyCategory } from '../../constants/agency-types';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/design-system';
import { AgencyInfo, findAgenciesByAddress } from '../../utils/agencyService';

export default function AgencyFinderScreen() {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<AgencyInfo[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<AgencyCategory>('community');

    const categories: AgencyCategory[] = ['immigration', 'community', 'global', 'multicultural', 'worker'];

    const handleCategoryChange = (category: AgencyCategory) => {
        setSelectedCategory(category);
        setHasSearched(false);
        setResults([]);
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
        Linking.openURL(`https://map.naver.com/v5/search/${query}`);
    };

    const openGoogleMap = (address: string) => {
        const query = encodeURIComponent(address);
        Linking.openURL(`https://maps.google.com/?q=${query}`);
    };

    const getCategoryColor = (category: AgencyCategory): string => {
        switch (category) {
            case 'immigration': return COLORS.primary[600];
            case 'community': return COLORS.success.main;
            case 'global': return COLORS.secondary[600];
            case 'multicultural': return '#E91E63';
            case 'worker': return '#FF9800';
            default: return COLORS.primary[600];
        }
    };

    const getCategoryIcon = (category: AgencyCategory): React.ComponentProps<typeof MaterialIcons>['name'] => {
        switch (category) {
            case 'immigration': return 'badge';
            case 'community': return 'location-city';
            case 'global': return 'public';
            case 'multicultural': return 'groups';
            case 'worker': return 'work';
            default: return 'location-city';
        }
    };

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
                                        {t(`agency.category.${category}`)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </Card>

                {/* Category Description */}
                <Card style={{ marginBottom: SPACING.lg }}>
                    <View style={styles.descriptionHeader}>
                        <MaterialIcons
                            name={getCategoryIcon(selectedCategory)}
                            size={24}
                            color={getCategoryColor(selectedCategory)}
                        />
                        <Text style={styles.descriptionTitle}>
                            {t(`agency.category.${selectedCategory}`)}
                        </Text>
                    </View>
                    <Text style={styles.descriptionText}>
                        {t(`agency.description.${selectedCategory}`)}
                    </Text>

                    {/* Search Input */}
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
                </Card>

                {/* Empty State */}
                {hasSearched && results.length === 0 && !loading && (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="location-off" size={48} color={COLORS.text.tertiary} />
                        <Text style={styles.emptyText}>{t('agency.no_results')}</Text>
                    </View>
                )}

                {/* Results */}
                {results.map((agency, index) => (
                    <Card key={index} style={{ marginBottom: SPACING.md }}>
                        {/* Category Badge */}
                        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(agency.category) }]}>
                            <MaterialIcons name={getCategoryIcon(agency.category)} size={14} color={COLORS.white} />
                            <Text style={styles.categoryBadgeText}>
                                {t(`agency.category.${agency.category}`)}
                            </Text>
                        </View>

                        <Text style={styles.resultTitle}>{agency.name}</Text>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="location-on" size={16} color={COLORS.text.secondary} />
                            <Text style={styles.resultAddress}>{agency.address}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="phone" size={16} color={COLORS.text.secondary} />
                            <Text style={styles.resultPhone}>{agency.phone}</Text>
                        </View>

                        {/* Services List */}
                        {agency.services && agency.services.length > 0 && (
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
                        )}

                        {/* Map Buttons */}
                        <View style={styles.mapButtonsContainer}>
                            <Button
                                title={t('agency.btn_naver_map')}
                                onPress={() => openNaverMap(agency.address)}
                                variant="outline"
                                icon={<MaterialIcons name="map" size={18} color={COLORS.success.main} />}
                                style={styles.mapButton}
                            />
                            <Button
                                title={t('agency.btn_google_map')}
                                onPress={() => openGoogleMap(agency.address)}
                                variant="outline"
                                icon={<MaterialIcons name="public" size={18} color={COLORS.primary[600]} />}
                                style={styles.mapButton}
                            />
                        </View>
                    </Card>
                ))}
            </ScrollView>
        </View>
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
