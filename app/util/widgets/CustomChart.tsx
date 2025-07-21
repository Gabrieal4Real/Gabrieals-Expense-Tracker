import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { VictoryPie, VictoryLegend, VictoryTheme } from "victory-native";

import { Colors } from "@/constants/Colors";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { SubtitleText, TinyText } from "@/app/util/widgets/CustomText";
import { RoundedBox } from "@/app/util/widgets/CustomBox";
import { ChartPageData } from "@/app/data/ChartData";
import { combinedColorScale } from "@/app/data/ChartData";

export function LegendPie({
  title,
  chart,
  theme = 0,
  dualCharts = false,
}: {
  title: string;
  chart: { x: string; y: number }[];
  theme?: number;
  dualCharts?: boolean;
}) {
  const colorScale = combinedColorScale[theme ?? 0];

  const width = dualCharts ? SCREEN_WIDTH * 0.4 : SCREEN_WIDTH * 0.76;
  const itemsPerRow = dualCharts ? 1 : 2;
  const height = Math.ceil(chart.length / itemsPerRow) * 28;
  const totalY = chart.reduce((acc, { y }) => acc + y, 0);

  return (
    <View style={{ alignItems: "center", paddingTop: 8 }}>
      {title != "" && (
        <TinyText text={title} color={Colors.textPrimary} textAlign="center" />
      )}

      <VictoryPie
        height={150}
        padAngle={6}
        data={chart}
        colorScale={colorScale}
        cornerRadius={6}
        innerRadius={65}
        labels={[]}
      />

      <VictoryLegend
        orientation="horizontal"
        width={width}
        height={height}
        itemsPerRow={itemsPerRow}
        gutter={32}
        style={{
          labels: {
            fill: Colors.white,
            fontFamily: "PoppinsRegular",
            fontSize: 12,
          },
        }}
        data={chart.map((item, index) => ({
          name: ((item.y / totalY) * 100).toFixed(1) + "% " + item.x,
          symbol: { fill: colorScale[index] },
        }))}
      />
    </View>
  );
}

export function ChartPager({
  chart,
  title,
}: {
  chart: ChartPageData[];
  title?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (<RoundedBox
    
      style={{ marginBottom: 12, paddingHorizontal: 0, alignItems: "center" }}
    >
      <FlatList
        data={chart}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const checkIfExpenseAndIncomeExist =
            item.expense.length > 0 && item.income.length > 0;

          return (
            <View style={{ width: SCREEN_WIDTH * 0.915 }}>
              <SubtitleText
                text={item.title}
                color={Colors.textPrimary}
                textAlign="center"
              />
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                {item.expense.length > 0 && (
                  <View style={{ width: "48%" }}>
                    <LegendPie
                      title={title ?? "Expense"}
                      chart={item.expense}
                      dualCharts={checkIfExpenseAndIncomeExist}
                    />
                  </View>
                )}
                {item.income.length > 0 && (
                  <View style={{ width: "48%" }}>
                    <LegendPie
                      title={title ?? "Income"}
                      chart={item.income}
                      theme={1}
                      dualCharts={checkIfExpenseAndIncomeExist}
                    />
                  </View>
                )}
              </View>
            </View>
          );
        }}
        onViewableItemsChanged={({ viewableItems }) => {
          if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
          }
        }}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={{ flexDirection: "row", marginTop: 12 }}>
        {chart.map((_, index) => (
          <View
            key={index}
            style={{
              width: index === activeIndex ? 16 : 8,
              height: 4,
              borderRadius: 8,
              marginHorizontal: 4,
              backgroundColor:
                index === activeIndex ? Colors.white : Colors.placeholder,
            }}
          />
        ))}
      </View>
    </RoundedBox>
  );
}
