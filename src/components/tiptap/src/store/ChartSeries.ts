import { create } from "zustand";

interface ChartState {
  series: any[]; // Use 'any' as requested, but consider proper typing
  chartData: any;
  setSeries: (series: any[]) => void;
  setChartData: (chartData: any) => void;
  getSeries: () => any[];
  getChartData: () => any;
  resetSeries: () => void;
}

export const useChartStore = create<ChartState>((set, get) => ({
  series: [],
  chartData: {},
  setSeries: (series) => set({ series }),
  setChartData: (chartData) => set({ chartData }),
  getSeries: () => get().series,
  getChartData: () => get().chartData,
  resetSeries: () => set({ series: [] }),
}));
