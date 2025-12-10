import BarChart from "./BarChart";
import AreaChart from "./AreaChart/AreaChart";
import BubbleChart from "./BubbleChart/BubbleChart";
import PieChart from "./PieChart/PieChart";
import LineChart from "./LineChart/LineChart";
import ScatterPlot from "./ScatterPlot/ScatterPlot";
import CandlestickChart from "./CandlestickChart/CandlestickChart";
import ColumnChart from "./ColumnChart/ColumnChart";
import DonutChart from "./DonutChart/DonutChart";
import GaugeChart from "./GaugeChart/GaugeChart";
import Heatmap from "./Heatmap/Heatmap";
import HorizontalBarChart from "./HorizontalBar/HorizontalBarChart";
import RadarChart from "./RadarChart/RadarChart";
import RadialProgress from "./RadialProgress/RadialProgress";
import SparklineChart from "./SparklineChart/SparklineChart";
import TimelineChart from "./TimelineChart/TimelineChart";

const componentMap: Record<string, React.FC | null> = {
  none: null,
  bar: BarChart,
  area: AreaChart,
  bubble: BubbleChart,
  pie: PieChart,
  line: LineChart,
  scatter: ScatterPlot,
  candle: CandlestickChart,
  column: ColumnChart,
  donut: DonutChart,
  gauge: GaugeChart,
  heatmap: Heatmap,
  hbar: HorizontalBarChart,
  radar: RadarChart,
  radial: RadialProgress,
  spark: SparklineChart,
  timeline: TimelineChart,
};

export default componentMap;