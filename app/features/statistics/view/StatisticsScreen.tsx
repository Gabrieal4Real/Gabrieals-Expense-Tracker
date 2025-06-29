import React, { useCallback, useEffect } from 'react';
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
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';

export default function StatisticsScreen() {
  const insets = useSafeAreaInsets();
  const statisticViewModel = useStatisticViewModel();
  const { chartPages } = statisticViewModel.uiState;
  
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  var expenseChart = chartPages.filter(c => c.type === 'expense')
  var fakeExpenseChart = statisticViewModel.generateFakeChartData().filter(c => c.type === 'expense')
  var incomeChart = chartPages.filter(c => c.type === 'income')
  var fakeIncomeChart = statisticViewModel.generateFakeChartData().filter(c => c.type === 'income')

  console.log(statisticViewModel.generateFakeChartData());

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
          <View>
            <ChartPager chart={isAuthenticated && expenseChart.length !== 0 ? expenseChart : fakeExpenseChart} />

            {(!isAuthenticated || expenseChart.length === 0) && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding:16,
                  marginBottom: 16,
                  ...StyleSheet.absoluteFillObject,
                }}
              >
              <BlurView
                intensity={20}
                experimentalBlurMethod="dimezisBlurView"
                tint="dark"
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  ...StyleSheet.absoluteFillObject,
                }}
              />
              <TitleText
                text="Add an expense type to see your pie"
                color={Colors.white}
                textAlign="center"
                style={{
                  backgroundColor: Colors.lightMaroon,
                  padding: 16,
                  borderRadius: 12,
                }}
              />
            </View>
          )}
        </View>
          <View>
            <ChartPager chart={isAuthenticated && incomeChart.length !== 0 ? incomeChart : fakeIncomeChart} />

            {(!isAuthenticated || incomeChart.length === 0) && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding:16,
                  marginBottom: 16,
                  ...StyleSheet.absoluteFillObject,
                }}
              >
              <BlurView
                intensity={18}
                tint="dark"
                experimentalBlurMethod="dimezisBlurView"
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  ...StyleSheet.absoluteFillObject,
                }}
              />
              <TitleText
                text="Add an income type to see your pie"
                color={Colors.white}
                textAlign="center"
                style={{
                  backgroundColor: Colors.lightMaroon,
                  padding: 16,
                  borderRadius: 12,
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {!isAuthenticated && <FloatingActionButton
        onPress={handleFabPress}
        icon='fingerprint'
      />}
      
    </View>
  );
}