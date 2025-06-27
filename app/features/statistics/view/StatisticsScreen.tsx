import React, { useEffect } from 'react';
import { TitleText } from '@/app/util/widgets/CustomText';
import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingActionButton } from '@/app/util/widgets/CustomButton';
import { authenticate, useAuth } from '@/app/util/systemFunctions/AuthenticationUtil';
import { useStatisticViewModel } from '../../statistics/viewmodel/StatisticViewModel';
import { LegendPie } from '@/app/util/widgets/CustomChart';
import { ScrollView, View } from 'react-native';
import { SpacerVertical } from '@/app/util/widgets/CustomBox';
import { getMonthName } from '@/app/util/systemFunctions/DateUtil';

export default function StatisticsScreen() {
  const insets = useSafeAreaInsets();
  const statisticViewModel = useStatisticViewModel();
  const { expenseChartData, incomeChartData } = statisticViewModel.uiState;
  
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  var expenseChart = (isAuthenticated && expenseChartData.length > 0) ? expenseChartData : statisticViewModel.generateFakeChartData().expenseChart
  var incomeChart = (isAuthenticated && incomeChartData.length > 0) ? incomeChartData : statisticViewModel.generateFakeChartData().incomeChart

  const handleFabPress = () => {
      if (!isAuthenticated) {
        authenticate(() => {
          setIsAuthenticated(true);
          expenseChart = expenseChartData;
          incomeChart = incomeChartData;
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
      contentContainerStyle={{ paddingBottom: 60 }}
      >
      <LegendPie title={(getMonthName(new Date().getMonth()) + " Expense Summary").toUpperCase()} chart={expenseChart} theme={0}/>
      <LegendPie title={(getMonthName(new Date().getMonth()) + " Income Summary").toUpperCase()} chart={incomeChart} theme={1}/>
      
      </ScrollView>

      {!isAuthenticated && <FloatingActionButton
        onPress={handleFabPress}
        icon='fingerprint'
      />}
      
    </View>
  );
}