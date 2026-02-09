import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { NoticeCard } from '../../components/ui/NoticeCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { TextField } from '../../components/ui/TextField';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/design-system';
import { PENSION_COUNTRIES, PENSION_PROCEDURES, PENSION_RATES, SPECIAL_VISA_ELIGIBILITY } from '../../constants/pension-policy-data';

export default function PensionScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [income, setIncome] = useState('');
  const [months, setMonths] = useState('');
  const [nationality, setNationality] = useState<{ code: string, name: string, status: string } | null>(null);
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<{ eligible: boolean; amount: number; reason?: string } | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleCalculate = () => {
    if (!income || !months || !nationality) {
      // Simple alert fallback if needed, or better UI feedback
      return;
    }

    const numericIncome = parseInt(income.replace(/[^0-9]/g, ''));
    const numericMonths = parseInt(months);

    // 1. Check Eligibility
    let isEligible = false;
    let reason = '';

    // Check if E-9/H-2 (Special Exception)
    if (selectedVisa && SPECIAL_VISA_ELIGIBILITY.includes(selectedVisa)) {
      isEligible = true;
      reason = t('pension.eligible_visa_exception', { visa: selectedVisa });
    }
    // Check Country Agreement
    else if (nationality.status === 'eligible') {
      isEligible = true;
      reason = t('pension.eligible_agreement', { country: nationality.name });
    } else if (nationality.status === 'conditional') {
      // Hardcoded check for > 1 year (12 months)
      if (numericMonths >= 12) {
        isEligible = true;
        reason = t('pension.eligible_conditional_met');
      } else {
        reason = t('pension.ineligible_conditional_fail');
      }
    } else {
      reason = t('pension.ineligible_country', { country: nationality.name });
    }

    // 2. Calculate Amount
    let totalAmount = 0;
    if (isEligible) {
      const principal = (numericIncome * PENSION_RATES.contributionRate) * numericMonths;
      // Simplified Interest Calculation (Compound estimate)
      // Using 2025 rate as baseline for projection
      const interestMultiplier = Math.pow(1 + PENSION_RATES.interestRate2025, numericMonths / 12);
      totalAmount = principal * interestMultiplier;
    }

    setResult({
      eligible: isEligible,
      amount: Math.floor(totalAmount),
      reason
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t('pension.title')}
        colors={[COLORS.primary[600], COLORS.primary[700]]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Disclaimer Section */}
        <NoticeCard
          variant="warning"
          title={t('pension.disclaimer_title')}
          icon="warning"
          style={{ marginBottom: SPACING.lg }}
        >
          {t('pension.disclaimer_text')}{'\n'}
          <Text style={{ fontWeight: 'bold' }}>{t('pension.disclaimer_contact')}</Text>
        </NoticeCard>

        <Card style={styles.inputCard}>
          <Text style={styles.sectionTitle}>{t('pension.calculator_title')}</Text>

          {/* Nationality Selector */}
          <Text style={styles.label}>{t('pension.input_nationality')}</Text>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={styles.dropdownButton}
          >
            <Text style={[styles.dropdownText, !nationality && styles.placeholderText]}>
              {nationality ? nationality.name : t('pension.select_nationality')}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color={COLORS.text.secondary} />
          </TouchableOpacity>

          {/* Visa Type Selector (Simplified for now - Yes/No or Common types) */}
          <Text style={styles.label}>{t('pension.input_visa_type')}</Text>
          <View style={styles.visaRow}>
            {[
              { value: 'E-9', label: t('pension.visaTypes.e9') },
              { value: 'H-2', label: t('pension.visaTypes.h2') },
              { value: 'D-2', label: t('pension.visaTypes.d2') },
              { value: 'Other', label: t('pension.visaTypes.other') }
            ].map((v) => (
              <TouchableOpacity
                key={v.value}
                style={[styles.visaChip, selectedVisa === v.value && styles.visaChipSelected]}
                onPress={() => setSelectedVisa(v.value)}
              >
                <Text style={[styles.visaChipText, selectedVisa === v.value && styles.visaChipTextSelected]}>{v.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextField
            label={t('pension.input_income')}
            value={income}
            onChangeText={setIncome} // Should maximize/format currency
            placeholder="2,500,000"
            keyboardType="numeric"
            suffix={<Text style={styles.suffixText}>{t('pension.krwSuffix')}</Text>}
          />

          <TextField
            label={t('pension.input_months')}
            value={months}
            onChangeText={setMonths}
            placeholder="36"
            keyboardType="numeric"
            suffix={<Text style={styles.suffixText}>{t('pension.monthsSuffix')}</Text>}
          />

          <Button
            title={t('pension.check_refund')}
            onPress={handleCalculate}
            variant="primary"
            style={styles.calculateButton}
          />
        </Card>

        {/* Result Section */}
        {result && (
          <Card style={[styles.resultCard, result.eligible ? styles.resultSuccess : styles.resultFail]}>
            <View style={styles.resultHeader}>
              <MaterialIcons
                name={result.eligible ? "check-circle" : "error"}
                size={24}
                color={result.eligible ? COLORS.success.main : COLORS.error.main}
              />
              <Text style={[styles.resultTitle, result.eligible ? styles.textSuccess : styles.textError]}>
                {result.eligible ? t('pension.eligible') : t('pension.not_eligible')}
              </Text>
            </View>

            {result.eligible && (
              <View style={styles.amountBox}>
                <Text style={styles.amountLabel}>{t('pension.est_amount')}</Text>
                <View style={styles.amountRow}>
                  <Text style={styles.amountPrefix}>{t('pension.approx')}</Text>
                  <Text style={styles.amountValue}> ₩{result.amount.toLocaleString()}</Text>
                </View>
                <Text style={styles.amountSub}>{t('pension.principalPlusInterest')}</Text>
              </View>
            )}

            <Text style={styles.reasonText}>{result.reason}</Text>
          </Card>
        )}



        {/* Procedures Info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>{t('pension.procedures')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
            {PENSION_PROCEDURES.map((proc, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.tabButton, activeTab === index && styles.tabActive]}
                onPress={() => setActiveTab(index)}
              >
                <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
                  {t(proc.title)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Card style={styles.infoCard}>
            {PENSION_PROCEDURES[activeTab].items.map((item, idx) => (
              <View key={idx} style={styles.infoItem}>
                <MaterialIcons name="chevron-right" size={20} color={COLORS.primary[500]} />
                <Text style={styles.infoText}>{t(item)}</Text>
              </View>
            ))}
          </Card>
        </View>

      </ScrollView>

      {/* Nationality Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('pension.select_nationality')}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {PENSION_COUNTRIES.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={styles.countryOption}
                  onPress={() => {
                    setNationality(country);
                    setShowModal(false);
                  }}
                >
                  <Text style={styles.countryText}>{country.name}</Text>
                  {country.status === 'eligible' && <MaterialIcons name="check" size={16} color={COLORS.success.main} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: 120, // Clear absolute header
    paddingBottom: 40,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
    color: COLORS.text.primary,
  },
  inputCard: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...TYPOGRAPHY.label,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  dropdownText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  placeholderText: {
    color: COLORS.text.tertiary,
  },
  visaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  visaChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  visaChipSelected: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary[500],
  },
  visaChipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  visaChipTextSelected: {
    color: COLORS.primary[700],
    fontWeight: 'bold',
  },
  suffixText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    fontWeight: 'bold',
  },
  calculateButton: {
    marginTop: SPACING.md,
  },
  resultCard: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
    padding: SPACING.lg,
  },
  resultSuccess: {
    backgroundColor: COLORS.success.light,
    borderColor: COLORS.success.main,
    borderWidth: 1,
  },
  resultFail: {
    backgroundColor: COLORS.error.light,
    borderColor: COLORS.error.main,
    borderWidth: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  resultTitle: {
    ...TYPOGRAPHY.h4, // Reduced from h3 for better balance
    fontWeight: 'bold',
  },
  textSuccess: { color: COLORS.success.main },
  textError: { color: COLORS.error.main },
  amountBox: {
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
  },
  amountLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.xs,
  },
  amountPrefix: {
    ...TYPOGRAPHY.h3, // Reduced from h2 to h3
    color: COLORS.primary[700],
    fontWeight: '800',
    marginRight: 4, // Adjusted margin
  },
  amountValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary[700],
    fontWeight: '800',
  },
  amountSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.tertiary,
  },
  reasonText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    color: COLORS.text.primary,
  },
  infoSection: {
    marginTop: SPACING.md,
  },
  tabScroll: {
    marginBottom: SPACING.sm,
  },
  tabButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: {
    backgroundColor: COLORS.primary[600],
    borderColor: COLORS.primary[600],
  },
  tabText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: COLORS.surface,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  infoText: {
    ...TYPOGRAPHY.body,
    flex: 1,
    marginLeft: SPACING.sm,
    color: COLORS.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    height: '60%',
    padding: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
  },
  countryOption: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countryText: {
    ...TYPOGRAPHY.body,
  },

});
