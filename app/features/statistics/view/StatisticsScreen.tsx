import React, { useCallback, useEffect } from 'react';
import { SubtitleText, TinyText, TitleText } from '@/app/util/widgets/CustomText';
import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingActionButton } from '@/app/util/widgets/CustomButton';
import { authenticate, useAuth } from '@/app/util/systemFunctions/AuthenticationUtil';
import { useStatisticViewModel } from '../../statistics/viewmodel/StatisticViewModel';
import { ChartPager, LegendPie } from '@/app/util/widgets/CustomChart';
import { FlatList, ScrollView, View } from 'react-native';
import { CustomBlurView, RoundedBox, SpacerHorizontal, SpacerVertical } from '@/app/util/widgets/CustomBox';
import { getMonthName } from '@/app/util/systemFunctions/DateUtil';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';

export default function StatisticsScreen() {
  const insets = useSafeAreaInsets();
  const statisticViewModel = useStatisticViewModel();
  const { chartPages } = statisticViewModel.uiState;
  
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const fakeChart = statisticViewModel.generateFakeChartData();
  const categorySummary = statisticViewModel.getCategorySummary(chartPages);

  const handleFabPress = () => {
      if (!isAuthenticated) {
        authenticate(() => {
          setIsAuthenticated(true);
        });
      } else {
        
      }
    };

    useFocusEffect(
      useCallback(() => {
        statisticViewModel.getTransactions()
    
        return () => {
          
        };
      }, [])
    );

  return (
    <View style={[baseStyles.baseBackground, { paddingTop: 18 + insets.top}]}>
      <TitleText text="Statistics" color={Colors.textPrimary} textAlign="center" />
      <SpacerVertical size={16} />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 60 }}>
          <CustomBlurView isShowBlur={!isAuthenticated || chartPages.length === 0}>
            <ChartPager chart={(chartPages.length > 0 && isAuthenticated) ? chartPages : fakeChart} />
          </CustomBlurView>

          <CustomBlurView isShowBlur={!isAuthenticated || chartPages.length === 0}>
          <ChartPager chart={(chartPages.length > 0 && isAuthenticated) ? categorySummary : fakeChart} title=''/>
          </CustomBlurView>
      </ScrollView>

      {!isAuthenticated && <FloatingActionButton
        onPress={handleFabPress}
        icon='fingerprint'
      />}
      
    </View>
  );
}