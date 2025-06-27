import React from 'react';
import { VictoryPie, VictoryLegend, VictoryTheme } from 'victory-native';
import { Colors } from '@/constants/Colors';
import { SubtitleText } from '@/app/util/widgets/CustomText';
import { RoundedBox } from '@/app/util/widgets/CustomBox';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';

export function LegendPie({
  title,
  chart,
  theme
}: {
  title: string;
  chart: { x: string; y: number }[];
  theme: number;
}) {
    var selectedTheme = theme == 0 ? VictoryTheme.clean : VictoryTheme.material
    var colorScale = selectedTheme.pie;

    return (
    <RoundedBox style={{ marginBottom: 16, alignItems: 'center'}}>
      <SubtitleText text={title} color={Colors.textPrimary} textAlign="center" />

      <VictoryPie
        width={400}
        height={150}
        padAngle={6}
        data={chart}
        theme={selectedTheme}
        animate={{ duration: 1000 }}
        cornerRadius={4}
        startAngle={-6}
        innerRadius={60}
        labels={[]}
      />

      <VictoryLegend
        orientation="horizontal"
        x={48}
        height={Math.ceil(chart.length / 3) * 28}
        itemsPerRow={3}
        gutter={20}
        style={{
          labels: { fill: Colors.white, fontFamily: 'PoppinsRegular', fontSize: 12 },
        }}
        data={chart.map((item, index) => ({
          name: item.x,
          symbol: {
            fill: colorScale?.colorScale?.[index],
          },
        }))}
      />
    </RoundedBox>
  );
}