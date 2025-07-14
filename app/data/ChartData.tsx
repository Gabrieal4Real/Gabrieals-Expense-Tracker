export interface ChartData {
  x: string;
  y: number;
}

export interface ChartPageData {
  title: string;
  expense: ChartData[];
  income: ChartData[];
  month: number;
  year: number;
}

export const combinedColorScale = [
  // Clean Theme (Extended)
  [
    "#2D7FF9", // Blue
    "#18BFFF", // Cyan
    "#20C933", // Green
    "#FCB400", // Yellow-Orange
    "#FF6F2C", // Orange
    "#F82B60", // Pink
    "#8B46FF", // Purple
    "#20D9D2", // Teal
    "#FF94C2", // Light Pink
    "#A0A0A0", // Neutral Gray
  ],

  // Material Theme (Extended)
  [
    "#F4511E", // Deep Orange
    "#FFF59D", // Light Yellow
    "#DCE775", // Lime Green
    "#8BC34A", // Light Green
    "#00796B", // Teal
    "#006064", // Cyan
    "#AB47BC", // Violet
    "#FF7043", // Light Orange
    "#81D4FA", // Sky Blue
    "#5D4037", // Brown/Neutral
  ],
];
