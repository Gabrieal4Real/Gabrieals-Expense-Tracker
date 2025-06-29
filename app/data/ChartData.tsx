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