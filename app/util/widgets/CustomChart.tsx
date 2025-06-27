import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { VictoryPie, VictoryLegend, VictoryTheme } from 'victory-native';

import { Colors } from '@/constants/Colors';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { SubtitleText } from '@/app/util/widgets/CustomText';
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
    <View style={{ alignItems: 'center' }}>
      <SubtitleText text={title} color={Colors.textPrimary} textAlign="center" />

      <VictoryPie
        width={SCREEN_WIDTH * 0.915}
        height={150}
        padAngle={6}
        data={chart}
        theme={selectedTheme}
        cornerRadius={4}
        startAngle={-6}
        innerRadius={60}
        labels={[]}
      />

      <VictoryLegend
        orientation="horizontal"
        width={SCREEN_WIDTH * 0.78}
        height={Math.ceil(chart.length / 3) * 28}
        itemsPerRow={3}
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
          <LegendPie
            title={item.title}
            chart={item.data}
            theme={item.type === 'expense' ? 0 : 1}
          />
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
