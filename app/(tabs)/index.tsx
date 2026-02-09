import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { auth } from '../../utils/firebase';

import { AIChatEntry } from '../../components/home/AIChatEntry';
import { HomeHeader } from '../../components/home/HomeHeader';
import { HomeNews } from '../../components/home/HomeNews';
import { QuickActions } from '../../components/home/QuickActions';
import { SecondaryActions } from '../../components/home/SecondaryActions';
import { VisaStatusCard } from '../../components/home/VisaStatusCard';
import { LiquidBackground } from '../../components/ui/LiquidBackground';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [userName, setUserName] = useState(t('dashboard.guest'));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user?.displayName) {
        setUserName(user.displayName);
      } else {
        setUserName(t('dashboard.guest'));
      }
    });

    return unsubscribe;
  }, [t]);

  return (
    <LiquidBackground style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HomeHeader userName={userName} />
        <VisaStatusCard />
        <QuickActions />
        <AIChatEntry />
        <SecondaryActions />
        <HomeNews />
      </ScrollView>
    </LiquidBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Background color handled by LiquidBackground
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
