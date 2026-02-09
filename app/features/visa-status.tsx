import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { TextField } from '../../components/ui/TextField';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/design-system';
import { VISA_TYPES } from '../../constants/visa-policy-data';
import { useVisaStore } from '../../store/visaStore';
import { analyzeARC } from '../../utils/ocrService';

export default function VisaStatusScreen() {
    const { t } = useTranslation();
    const {
        visaType, expiryDate, issueDate,
        regNumber, name, country,
        setVisaDetails
    } = useVisaStore();

    const [isEditing, setIsEditing] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    // Edit State
    const [editType, setEditType] = useState(visaType);
    const [editExpiry, setEditExpiry] = useState(expiryDate || '');
    const [editIssue, setEditIssue] = useState(issueDate || '');
    const [editRegNumber, setEditRegNumber] = useState(regNumber || '');
    const [editName, setEditName] = useState(name || '');
    const [editCountry, setEditCountry] = useState(country || '');

    // Initialize edit state from store
    const initializeEditState = () => {
        setEditType(visaType);
        setEditExpiry(expiryDate || '');
        setEditIssue(issueDate || '');
        setEditRegNumber(regNumber || '');
        setEditName(name || '');
        setEditCountry(country || '');
    };

    const handleEditToggle = () => {
        if (!isEditing) {
            initializeEditState();
        }
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if ((editExpiry && !dateRegex.test(editExpiry)) || (editIssue && !dateRegex.test(editIssue))) {
            Alert.alert(t('common.error'), t('visaStatus.invalidDate'));
            return;
        }

        setVisaDetails({
            visaType: editType,
            expiryDate: editExpiry,
            issueDate: editIssue,
            regNumber: editRegNumber,
            name: editName,
            country: editCountry
        });
        setIsEditing(false);
        Alert.alert(t('common.ok'), t('visaStatus.savedSuccess'));
    };

    const scheduleVisaNotifications = async (expiryDateStr: string) => {
        // Notifications disabled temporarily
    };

    const handleScanARC = async () => {
        // Request permissions
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert(t('common.error'), t('visaStatus.permissionRequired'));
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (pickerResult.canceled) {
            return;
        }

        setIsScanning(true);

        try {
            const imageUri = pickerResult.assets[0].uri;

            // Analyze ARC
            const result = await analyzeARC(imageUri);

            if (!result) {
                throw new Error("No result from OCR");
            }

            // 1. Update Global Store Directly (Auto-Save)
            const finalIssueDate = result.issueDate || issueDate;
            const finalExpiryDate = result.expiryDate || estimateExpiryDate(result.visaType || visaType, finalIssueDate) || expiryDate;

            setVisaDetails({
                regNumber: result.regNumber,
                name: result.name,
                country: result.country,
                visaType: result.visaType,
                issueDate: finalIssueDate, // Update if found, else keep existing
                expiryDate: finalExpiryDate // Update if found, else estimate, else keep existing
            });

            // 2. Ensure we are in View Mode
            setIsEditing(false);

            // 3. User Feedback
            Alert.alert(
                t('visaStatus.scanComplete'),
                t('visaStatus.scanSuccess')
            );

        } catch (error) {
            console.error("OCR Error:", error);
            Alert.alert(t('visaStatus.scanFailed'), t('visaStatus.scanError'));
        } finally {
            setIsScanning(false);
        }
    };

    const calculateDDay = (targetDate: string | null) => {
        if (!targetDate) return '-';
        const today = new Date();
        const target = new Date(targetDate);
        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
    };

    /**
     * Helper to estimate expiry date if OCR fails.
     * D-10: 6 months
     * Others: Default to 1 year
     */
    const estimateExpiryDate = (type: string, issueDateStr: string | null) => {
        if (!issueDateStr) return null;

        const date = new Date(issueDateStr);
        if (isNaN(date.getTime())) return null;

        if (type.includes('D-10')) {
            date.setMonth(date.getMonth() + 6);
        } else {
            // Default to 1 year for E-9, etc.
            date.setFullYear(date.getFullYear() + 1);
        }

        // Format YYYY-MM-DD
        return date.toISOString().split('T')[0];
    };

    const dDay = calculateDDay(expiryDate);
    const isPositive = dDay.startsWith('D-');

    const router = useRouter();

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)'); // Fallback to Home tab
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('visaStatus.title')}
                colors={[COLORS.secondary[800], COLORS.secondary[900]]}
                onBack={handleBack}
                rightAction={
                    <Button
                        title={isEditing ? t('common.cancel') : t('visaStatus.editMode')}
                        onPress={handleEditToggle}
                        variant="ghost"
                        size="sm"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                        icon={<MaterialIcons name="edit" size={16} color={COLORS.white} />}
                    />
                }
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.disclaimerCard}>
                    <View style={styles.disclaimerHeader}>
                        <MaterialIcons name="warning" size={18} color={COLORS.error.main} />
                        <Text style={styles.disclaimerTitle}>{t('visaDocs.legalDisclaimer')}</Text>
                    </View>
                    <Text style={styles.disclaimerText}>{t('visaStatus.infoDesc')}</Text>
                </View>

                <Button
                    title={t('visaStatus.uploadArc')}
                    onPress={handleScanARC}
                    variant="primary"
                    icon={<MaterialIcons name="camera-alt" size={20} color={COLORS.white} />}
                    loading={isScanning}
                    style={[styles.scanButton, { marginBottom: 24 }]}
                    fullWidth
                />

                {isEditing ? (
                    <>
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>{t('visaStatus.foreignerInfo')}</Text>
                            <TextField
                                label={t('visa_status.arc_label')}
                                value={editRegNumber}
                                onChangeText={setEditRegNumber}
                                placeholder="000000-0000000"
                                keyboardType="numeric"
                            />
                            <TextField
                                label={t('visaStatus.name')}
                                value={editName}
                                onChangeText={setEditName}
                                placeholder="Name"
                            />
                            <TextField
                                label={t('visaStatus.country')}
                                value={editCountry}
                                onChangeText={setEditCountry}
                                placeholder="Country"
                            />
                        </View>

                        {/* Visa Details Form */}
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>{t('visaStatus.visaDetails')}</Text>
                            <TextField
                                label={t('visaStatus.visaType')}
                                value={editType}
                                onChangeText={setEditType}
                                placeholder="E-7-4"
                            />
                            <TextField
                                label={t('visaStatus.expiryDate')}
                                value={editExpiry}
                                onChangeText={setEditExpiry}
                                placeholder="YYYY-MM-DD"
                            />
                            <TextField
                                label={t('visaStatus.issueDate')}
                                value={editIssue}
                                onChangeText={setEditIssue}
                                placeholder="YYYY-MM-DD"
                            />
                        </View>

                        <Button
                            title={t('visaStatus.saveChanges')}
                            onPress={handleSave}
                            variant="primary"
                            style={styles.saveButton}
                        />
                    </>
                ) : (
                    <Card>
                        <View style={styles.cardHeader}>
                            <View>
                                <Text style={styles.cardLabel}>{t('visaStatus.currentVisa')}</Text>
                                <Text style={styles.cardValueLarge}>{visaType || '-'}</Text>
                            </View>
                            <View style={[styles.dDayBadge, isPositive ? styles.dDaySuccess : styles.dDayDanger]}>
                                <Text style={[styles.dDayText, isPositive ? styles.textSuccess : styles.textDanger]}>
                                    {dDay}
                                </Text>
                            </View>
                        </View>

                        {name ? (
                            <View style={styles.profileSection}>
                                <Text style={styles.profileName}>{name}</Text>
                                <Text style={styles.profileDetails}>{country} • {regNumber}</Text>
                            </View>
                        ) : null}

                        <View style={styles.divider} />

                        <View style={styles.dataRow}>
                            <View style={styles.dataCol}>
                                <Text style={styles.dataLabel}>{t('visaStatus.issueDate')}</Text>
                                <Text style={styles.dataValue}>{issueDate || '-'}</Text>
                            </View>
                            <View style={styles.dataCol}>
                                <Text style={styles.dataLabel}>{t('visaStatus.expiryDate')}</Text>
                                <Text style={styles.dataValue}>{expiryDate || '-'}</Text>
                            </View>
                        </View>


                        {/* Policy Info Section */}
                        {visaType && VISA_TYPES[visaType] && (
                            <View style={styles.policyContainer}>
                                <Text style={styles.sectionTitle}>
                                    {VISA_TYPES[visaType].name} Info
                                </Text>
                                <Text style={styles.policyDesc}>
                                    {VISA_TYPES[visaType].description}
                                </Text>
                                {VISA_TYPES[visaType].salaryRequirement && (
                                    <View style={styles.policyRow}>
                                        <Text style={styles.policyLabel}>Min. Salary:</Text>
                                        <Text style={styles.policyValue}>{VISA_TYPES[visaType].salaryRequirement}</Text>
                                    </View>
                                )}
                                {VISA_TYPES[visaType].maxStay && (
                                    <View style={styles.policyRow}>
                                        <Text style={styles.policyLabel}>Max Stay:</Text>
                                        <Text style={styles.policyValue}>{VISA_TYPES[visaType].maxStay}</Text>
                                    </View>
                                )}
                                {VISA_TYPES[visaType].notes && (
                                    <View style={styles.policyNoteBox}>
                                        <Text style={styles.policyNoteTitle}>Tips:</Text>
                                        {VISA_TYPES[visaType].notes.map((note, idx) => (
                                            <Text key={idx} style={styles.policyNoteText}>• {note}</Text>
                                        ))}
                                    </View>
                                )}
                            </View>
                        )}
                    </Card>
                )}
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
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        marginBottom: SPACING.md,
        color: COLORS.secondary[800],
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    cardLabel: {
        ...TYPOGRAPHY.caption,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    cardValueLarge: {
        fontSize: 36,
        fontWeight: '800',
        color: COLORS.secondary[800],
    },
    dDayBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        borderRadius: RADIUS.full,
    },
    dDaySuccess: {
        backgroundColor: COLORS.success.light,
    },
    dDayDanger: {
        backgroundColor: COLORS.error.light,
    },
    dDayText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    textSuccess: {
        color: COLORS.success.main,
    },
    textDanger: {
        color: COLORS.error.main,
    },
    profileSection: {
        marginBottom: SPACING.md,
    },
    profileName: {
        ...TYPOGRAPHY.h2,
        color: COLORS.text.primary,
        marginBottom: 2,
    },
    profileDetails: {
        ...TYPOGRAPHY.body,
        color: COLORS.text.secondary,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.lg,
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dataCol: {
        flex: 1,
    },
    dataLabel: {
        ...TYPOGRAPHY.caption,
        marginBottom: 4,
    },
    dataValue: {
        ...TYPOGRAPHY.body,
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.secondary[800],
    },
    disclaimerCard: {
        marginBottom: SPACING.lg,
        backgroundColor: '#FFF5F5',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: '#FFE3E3',
    },
    disclaimerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    disclaimerTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: COLORS.error.main,
    },
    disclaimerText: {
        ...TYPOGRAPHY.caption,
        color: '#666',
        lineHeight: 18,
    },
    policyContainer: {
        marginTop: SPACING.lg,
        paddingTop: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    policyDesc: {
        ...TYPOGRAPHY.body,
        color: COLORS.text.secondary,
        marginBottom: SPACING.md,
    },
    policyRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    policyLabel: {
        ...TYPOGRAPHY.caption,
        fontWeight: 'bold',
        width: 80,
    },
    policyValue: {
        ...TYPOGRAPHY.caption,
        color: COLORS.text.primary,
        flex: 1,
    },
    policyNoteBox: {
        marginTop: SPACING.md,
        backgroundColor: '#F0F9FF',
        padding: SPACING.md,
        borderRadius: RADIUS.sm,
    },
    policyNoteTitle: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#0369A1',
        marginBottom: 2,
    },
    policyNoteText: {
        fontSize: 12,
        color: '#0C4A6E',
    },
    scanButton: {
        marginBottom: SPACING.md,
    },
    formSection: {
        marginBottom: SPACING.lg,
    },
    saveButton: {
        marginTop: SPACING.md,
        backgroundColor: COLORS.secondary[800],
    },
});
