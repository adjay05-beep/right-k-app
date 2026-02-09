import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../../constants/design-system';
import { VISA_TYPES } from '../../constants/visa-policy-data';

interface VisaDropdownProps {
    selectedVisaCode: string;
    onSelect: (code: string) => void;
}

export const VisaDropdown = ({ selectedVisaCode, onSelect }: VisaDropdownProps) => {
    const { t } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const sortedVisas = Object.values(VISA_TYPES).sort((a, b) => a.code.localeCompare(b.code));
    const categories = [...new Set(sortedVisas.map(v => v.category))];

    const categoryMap: Record<string, string> = {
        'Professional': t('visaCalc.categories.professional'),
        'Resident': t('visaCalc.categories.resident'),
        'ShortTerm': t('visaCalc.categories.shortTerm'),
        'Education': t('visaCalc.categories.education'),
        'Overseas': t('visaCalc.categories.overseas'),
        'Diplomatic': t('visaCalc.categories.diplomatic'),
        'Other': t('visaCalc.categories.other')
    };

    return (
        <View style={styles.dropdownWrapper}>
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <View style={styles.dropdownButtonContent}>
                    <View style={styles.selectedVisaBadge}>
                        <Text style={styles.selectedVisaBadgeText}>{selectedVisaCode}</Text>
                    </View>
                    <Text style={styles.selectedVisaName} numberOfLines={1}>
                        {t(`visaTypes.${selectedVisaCode}.name`) || selectedVisaCode}
                    </Text>
                    <MaterialIcons
                        name={isDropdownOpen ? "expand-less" : "expand-more"}
                        size={24}
                        color={COLORS.primary[600]}
                    />
                </View>
            </TouchableOpacity>

            {isDropdownOpen && (
                <View style={styles.dropdownMenu}>
                    <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled={true}>
                        {categories.map(cat => (
                            <View key={cat}>
                                <View style={styles.dropdownCategoryHeader}>
                                    <Text style={styles.dropdownCategoryText}>{categoryMap[cat] || cat}</Text>
                                </View>
                                {sortedVisas.filter(v => v.category === cat).map(visa => (
                                    <TouchableOpacity
                                        key={visa.code}
                                        style={[
                                            styles.dropdownItem,
                                            selectedVisaCode === visa.code && styles.dropdownItemActive
                                        ]}
                                        onPress={() => {
                                            onSelect(visa.code);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        <View style={styles.visaBadgeSmall}>
                                            <Text style={styles.visaBadgeTextSmall}>{visa.code}</Text>
                                        </View>
                                        <Text style={[
                                            styles.dropdownItemText,
                                            selectedVisaCode === visa.code && styles.dropdownItemTextActive
                                        ]}>
                                            {t(`visaTypes.${visa.code}.name`)}
                                        </Text>
                                        {selectedVisaCode === visa.code && (
                                            <MaterialIcons name="check" size={18} color={COLORS.primary[500]} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    dropdownWrapper: {
        padding: SPACING.md,
        position: 'relative',
    },
    dropdownButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1.5,
        borderColor: COLORS.primary[200],
        borderRadius: 12,
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
    },
    dropdownButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedVisaBadge: {
        backgroundColor: COLORS.primary[500],
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 10,
    },
    selectedVisaBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    selectedVisaName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    dropdownMenu: {
        marginTop: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: '#eee',
        overflow: 'hidden',
    },
    dropdownCategoryHeader: {
        backgroundColor: '#f5f7fa',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownCategoryText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#777',
        textTransform: 'uppercase',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    dropdownItemActive: {
        backgroundColor: COLORS.primary[50],
    },
    dropdownItemText: {
        flex: 1,
        fontSize: 15,
        color: '#444',
    },
    dropdownItemTextActive: {
        color: COLORS.primary[600],
        fontWeight: 'bold',
    },
    visaBadgeSmall: {
        backgroundColor: '#eee',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 10,
        width: 50,
        alignItems: 'center',
    },
    visaBadgeTextSmall: {
        fontSize: 11,
        fontWeight: '700',
        color: '#666',
    },
});
