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

export const blueScaleColors: string[] = [
  'rgba(15, 94, 130, 1)',    // #0f5e82 – Lapis lazuli
  'rgba(39, 109, 141, 1)',   // #276d8d – Cerulean
  'rgba(87, 140, 164, 1)',   // #578ca4 – Air force blue
  'rgba(111, 155, 175, 1)',  // #6f9baf – Air superiority blue
  'rgba(159, 185, 197, 1)',  // #9fb9c5 – Powder blue
  'rgba(183, 201, 209, 1)',  // #b7c9d1 – Columbia blue
  'rgba(207, 216, 220, 1)',  // #cfd8dc – Platinum
  'rgba(154, 181, 180, 1)',  // #9ab5b4 – Ash gray-2
  'rgba(129, 164, 163, 1)',  // #81a4a3 – Cambridge blue
  'rgba(103, 148, 146, 1)',  // #679492 – Dark cyan
  'rgba(52, 114, 112, 1)',   // #347270 – Myrtle green-2
  'rgba(27, 98, 95, 1)',     // #1b625f – Caribbean current
  'rgba(1, 81, 78, 1)',      // #01514e – Brunswick green
];