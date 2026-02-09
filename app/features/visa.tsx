import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../../components/ui/Card';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { TextField } from '../../components/ui/TextField';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/design-system';
import { calculateVisaScore } from '../../utils/visaCalculator';

export default function VisaScreen() {
    const { t } = useTranslation();

    const [age, setAge] = useState('');
    const [income, setIncome] = useState('');
    const [education, setEducation] = useState('bachelor');
    const [topik, setTopik] = useState('1');
    const [extraPoints, setExtraPoints] = useState('');

    const calculateResult = () => {
        const result = calculateVisaScore({
            age: parseInt(age) || 0,
            income: parseInt(income) || 0,
            education: education as any,
            topik: parseInt(topik) || 0,
            extraPoints: parseInt(extraPoints) || 0
        });
        return result;
    };

    const result = calculateResult();

    const EducationOption = ({ label, val }: { label: string, val: string }) => (
        <TouchableOpacity
            onPress={() => setEducation(val)}
            style={[
                styles.optionButton,
                education === val ? styles.optionButtonActive : styles.optionButtonInactive
            ]}
        >
            <Text style={[
                styles.optionText,
                education === val ? styles.optionTextActive : styles.optionTextInactive
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const TopikOption = ({ level }: { level: string }) => (
        <TouchableOpacity
            onPress={() => setTopik(level)}
            style={[
                styles.circleOption,
                topik === level ? styles.circleOptionActive : styles.circleOptionInactive
            ]}
        >
            <Text style={[
                styles.circleText,
                topik === level ? styles.circleTextActive : styles.circleTextInactive
            ]}>
                {level}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('visa.title')}
                subtitle={t('visa.subtitle')}
                colors={[COLORS.visa.main, COLORS.visa.dark]}
            />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Result Card */}
                <Card style={{ alignItems: 'center' }}>
                    <Text style={styles.resultLabel}>{t('visa.current_score')}</Text>
                    <View style={styles.scoreRow}>
                        <Text style={[styles.scoreText, result?.passed ? styles.textSuccess : styles.textNeutral]}>
                            {result?.totalScore || 0}
                        </Text>
                        <Text style={styles.scoreMax}>/ 120+</Text>
                    </View>

                    <View style={[styles.statusBadge, result?.passed ? styles.badgeSuccess : styles.badgeFail]}>
                        <Text style={[styles.statusText, result?.passed ? styles.textSuccessDark : styles.textFailDark]}>
                            {result?.passed ? 'PASS (Safe)' : 'FAIL (Needs more points)'}
                        </Text>
                    </View>

                    {/* Tips */}
                    {result?.tips && result.tips.length > 0 && (
                        <View style={styles.tipBox}>
                            <MaterialIcons name="lightbulb" size={20} color={COLORS.warning.dark} />
                            <Text style={styles.tipText}>{result.tips[0]}</Text>
                        </View>
                    )}
                </Card>

                {/* Input Section */}
                <Text style={styles.sectionTitle}>{t('visa.input_section')}</Text>

                <Card>
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <TextField
                                label={t('visa.age')}
                                placeholder="30"
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <TextField
                                label={t('visa.income')}
                                placeholder="35"
                                value={income}
                                onChangeText={setIncome}
                                keyboardType="numeric"
                                suffix={<Text style={{ fontSize: 12, color: COLORS.text.tertiary }}>M KRW</Text>}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>{t('visa.education')}</Text>
                    <View style={styles.optionContainer}>
                        <EducationOption label="Associate" val="associate" />
                        <EducationOption label="Bachelor" val="bachelor" />
                        <EducationOption label="Master" val="master" />
                        <EducationOption label="PhD" val="phd" />
                    </View>

                    <Text style={styles.label}>{t('visa.topik')}</Text>
                    <View style={styles.circleContainer}>
                        {['1', '2', '3', '4', '5', '6'].map((level) => (
                            <TopikOption key={level} level={level} />
                        ))}
                    </View>

                    <TextField
                        label={t('visa.extra')}
                        placeholder="e.g. KIIP (10), Volunteer (3)"
                        value={extraPoints}
                        onChangeText={setExtraPoints}
                        keyboardType="numeric"
                    />
                </Card>
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
        paddingBottom: SPACING.xxl,
    },
    resultLabel: {
        ...TYPOGRAPHY.label,
        textTransform: 'uppercase',
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: SPACING.md,
    },
    scoreText: {
        fontSize: 60,
        fontWeight: '800',
        lineHeight: 60,
    },
    scoreMax: {
        ...TYPOGRAPHY.h3,
        color: COLORS.text.tertiary,
        marginBottom: SPACING.sm,
        marginLeft: SPACING.xs,
    },
    textSuccess: {
        color: COLORS.primary[600],
    },
    textNeutral: {
        color: COLORS.text.primary,
    },
    statusBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.full,
    },
    badgeSuccess: {
        backgroundColor: COLORS.success.light,
    },
    badgeFail: {
        backgroundColor: COLORS.error.light,
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    textSuccessDark: {
        color: COLORS.success.dark,
    },
    textFailDark: {
        color: COLORS.error.dark,
    },
    tipBox: {
        marginTop: SPACING.md,
        backgroundColor: COLORS.warning.light,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: '#FEF08A', // Yellow 200
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    tipText: {
        color: COLORS.warning.dark,
        marginLeft: SPACING.sm,
        flex: 1,
        fontSize: 14,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        marginBottom: SPACING.md,
        marginTop: SPACING.md,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.md,
    },
    halfInput: {
        flex: 1,
    },
    label: {
        ...TYPOGRAPHY.label,
        marginBottom: SPACING.sm,
    },
    optionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: SPACING.lg,
    },
    optionButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        marginRight: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    optionButtonActive: {
        backgroundColor: COLORS.primary[600],
        borderColor: COLORS.primary[600],
    },
    optionButtonInactive: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.border,
    },
    optionText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    optionTextActive: {
        color: COLORS.white,
    },
    optionTextInactive: {
        color: COLORS.text.secondary,
    },
    circleContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.lg,
    },
    circleOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.sm,
        borderWidth: 1,
    },
    circleOptionActive: {
        backgroundColor: COLORS.visa.main,
        borderColor: COLORS.visa.main,
    },
    circleOptionInactive: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.border,
    },
    circleText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    circleTextActive: {
        color: COLORS.white,
    },
    circleTextInactive: {
        color: COLORS.text.secondary,
    },
});
