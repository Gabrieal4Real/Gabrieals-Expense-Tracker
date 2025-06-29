import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { VictoryPie, VictoryLegend, VictoryTheme } from 'victory-native';

import { Colors } from '@/constants/Colors';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { SubtitleText, TinyText } from '@/app/util/widgets/CustomText';
import { RoundedBox } from '@/app/util/widgets/CustomBox';
import { ChartPageData } from '@/app/data/ChartData';

export function LegendPie({
  title,
  chart,
  theme
}: {
  title: string;
  chart: { x: string; y: number }[];
  theme: number;
}) {
  const selectedTheme = theme === 0 ? VictoryTheme.clean : VictoryTheme.material;
  const colorScale = selectedTheme.pie?.colorScale ?? [];

  return (
    <View style={{ alignItems: 'center', paddingTop: 8 }}>
      <TinyText text={title} color={Colors.textPrimary} textAlign="center" />

      <VictoryPie
        height={150}
        padAngle={6}
        data={chart}
        theme={selectedTheme}
        cornerRadius={4}
        startAngle={-6}
        innerRadius={65}
        labels={[]}
      />

      <VictoryLegend
        orientation="horizontal"
        width={SCREEN_WIDTH * 0.30}
        height={Math.ceil(chart.length / 2) * 60}
        itemsPerRow={1}
        gutter={20}
        style={{
          labels: {
            fill: Colors.white,
            fontFamily: 'PoppinsRegular',
            fontSize: 12,
          },
        }}
        data={chart.map((item, index) => ({
          name: item.x,
          symbol: { fill: colorScale[index] },
        }))}
      />
    </View>
  );
}

export function ChartPager({ chart }: { chart: ChartPageData[] }) {
  const [activeIndex, setActiveIndex] = useState(0);


  return (
    <RoundedBox style={{ marginBottom: 16, paddingHorizontal: 0, alignItems: 'center' }}>
      <FlatList
        data={chart}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{width: SCREEN_WIDTH * 0.915}}>
            <SubtitleText text={item.title} color={Colors.textPrimary} textAlign="center" />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              {item.expense.length > 0 && (
                <View style={{width: "49%"}}>
                  <LegendPie
                    title="Expenses"
                    chart={item.expense}
                    theme={0}
                  />
                </View>
              )}
              {item.income.length > 0 && (
                <View style={{width: "49%"}}>
                  <LegendPie
                    title="Income"
                    chart={item.income}
                    theme={1}
                  />
                </View>
              )}
            </View>
          </View>
        )}
        onViewableItemsChanged={({ viewableItems }) => {
          if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
          }
        }}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
        {chart.map((_, index) => (
          <View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              marginHorizontal: 4,
              backgroundColor: index === activeIndex ? Colors.white : Colors.placeholder,
            }}
          />
        ))}
      </View>
    </RoundedBox>
  );
}
