import React, { useEffect } from 'react';
import { TinyText, TitleText } from '@/app/util/widgets/CustomText';
import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingActionButton } from '@/app/util/widgets/CustomButton';
import { authenticate, useAuth } from '@/app/util/systemFunctions/AuthenticationUtil';
import { useStatisticViewModel } from '../../statistics/viewmodel/StatisticViewModel';
import { ChartPager, LegendPie } from '@/app/util/widgets/CustomChart';
import { FlatList, ScrollView, View } from 'react-native';
import { RoundedBox, SpacerHorizontal, SpacerVertical } from '@/app/util/widgets/CustomBox';
import { getMonthName } from '@/app/util/systemFunctions/DateUtil';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';


export default function StatisticsScreen() {
  const insets = useSafeAreaInsets();
  const statisticViewModel = useStatisticViewModel();
  const { chartPages } = statisticViewModel.uiState;
  
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  var expenseChart = ((isAuthenticated && chartPages.length > 0) ? chartPages : statisticViewModel.generateFakeChartData()).filter(c => c.type === 'expense')
  var incomeChart = ((isAuthenticated && chartPages.length > 0) ? chartPages : statisticViewModel.generateFakeChartData()).filter(c => c.type === 'income')

  console.log(statisticViewModel.generateFakeChartData());

  const handleFabPress = () => {
      if (!isAuthenticated) {
        authenticate(() => {
          setIsAuthenticated(true);
          expenseChart = chartPages.filter(c => c.type === 'expense');
          incomeChart = chartPages.filter(c => c.type === 'income');
        });
      } else {
        
      }
    };

  useEffect(() => {
    statisticViewModel.getTransactions();
  }, [statisticViewModel.getTransactions]);

  return (
    <View style={[baseStyles.baseBackground, { paddingTop: 18 + insets.top}]}>
      <TitleText text="Statistics" color={Colors.textPrimary} textAlign="center" />
      <SpacerVertical size={16} />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 60 }}>
        <ChartPager chart={expenseChart} />     
        <ChartPager chart={incomeChart} />     
      </ScrollView>

      {!isAuthenticated && <FloatingActionButton
        onPress={handleFabPress}
        icon='fingerprint'
      />}
      
    </View>
  );
}