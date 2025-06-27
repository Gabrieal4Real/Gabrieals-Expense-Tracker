import React, { useEffect } from 'react';
import { TitleText } from '@/app/util/widgets/CustomText';
import { Colors } from '@/constants/Colors';
import { Dimensions, View } from 'react-native';
import { baseStyles } from '@/constants/Styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingActionButton } from '@/app/util/widgets/CustomButton';
import { authenticate, useAuth } from '@/app/util/systemFunctions/AuthenticationUtil';
import { useStatisticViewModel } from '../../statistics/viewmodel/StatisticViewModel';
import { PieChart } from 'react-native-chart-kit';


export default function StatisticsScreen() {
  const insets = useSafeAreaInsets();
  const statisticViewModel = useStatisticViewModel();
  const { chartData } = statisticViewModel.uiState;
  const screenWidth = Dimensions.get("window").width;
  
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleFabPress = () => {
      if (!isAuthenticated) {
        authenticate(() => {
          setIsAuthenticated(true);
        });
      } else {
        
      }
    };

  useEffect(() => {
    statisticViewModel.getTransactions();
  }, [statisticViewModel.getTransactions]);

  console.log(chartData);

  return (
    <View style={[baseStyles.baseBackground, { paddingTop: 18 + insets.top }]}>
      <TitleText text="Statistics" color={Colors.textPrimary} textAlign="center" />
      {!isAuthenticated && <FloatingActionButton
        onPress={handleFabPress}
        icon='fingerprint'
      />}
      
      <PieChart
        data={isAuthenticated ? chartData : statisticViewModel.generateFakeChartData()}
        width={screenWidth - 18*2}
        height={(isAuthenticated ? chartData.length : statisticViewModel.generateFakeChartData().length) * 28}
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={{
          marginVertical: 16,
          borderRadius: 12,
          elevation: 4
        }}
        accessor={"population"}
        backgroundColor={Colors.navigationBar}
        paddingLeft={"8"}
      />
    </View>
  );
}