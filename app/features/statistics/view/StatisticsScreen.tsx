import React, { useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { TitleText } from '@/app/util/widgets/CustomText';
import { FloatingActionButton } from '@/app/util/widgets/CustomButton';
import { CustomBlurView, SpacerVertical } from '@/app/util/widgets/CustomBox';
import { ChartPager } from '@/app/util/widgets/CustomChart';

import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';

import { authenticate, useAuth } from '@/app/util/systemFunctions/AuthenticationUtil';
import { useStatisticViewModel } from '../../statistics/viewmodel/StatisticViewModel';

export default function StatisticsScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const statisticViewModel = useStatisticViewModel();

  const { chartPages } = statisticViewModel.uiState;
  const fakeChart = statisticViewModel.generateFakeChartData();
  const categorySummary = statisticViewModel.getCategorySummary(chartPages);

  const handleFabPress = () => {
    if (!isAuthenticated) {
      authenticate(() => setIsAuthenticated(true));
    }
  };

  useFocusEffect(
    useCallback(() => {
      statisticViewModel.getTransactions();
      return () => {};
    }, [])
  );

  const shouldShowCharts = isAuthenticated && chartPages.length > 0;
  const charts = shouldShowCharts ? chartPages : fakeChart;
  const summaryCharts = shouldShowCharts ? categorySummary : fakeChart;

  return (
    <View style={[baseStyles.baseBackground, { paddingTop: insets.top + 18 }]}>
      <TitleText text="Statistics" color={Colors.textPrimary} textAlign="center" />
      <SpacerVertical size={16} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <CustomBlurView isShowBlur={!shouldShowCharts}>
          <ChartPager chart={charts} />
        </CustomBlurView>

        <CustomBlurView isShowBlur={!shouldShowCharts}>
          <ChartPager chart={summaryCharts} title="" />
        </CustomBlurView>
      </ScrollView>

      {!isAuthenticated && (
        <FloatingActionButton onPress={handleFabPress} icon="finger-print" />
      )}
    </View>
  );
}