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

import BarStatCard from "./BarStatCard/BarStatCard";
import SegmentedStatCard from "./SegmentedStatCard/SegmentedStatCard";
import WaveformStatCard from "./WaveformStatCard/WaveformStatCard";

import SummaryCard from "./SummaryCard/SummaryCard";
import DotMatrixImage from "./DotMatrixImage/DotMatrixImage";
import InfoCard from "./InfoCard/InfoCard";

import ApiModule from "../networkComponents/ApiModule/ApiModule";

// const componentMap: Record<string, React.FC | null> = {
//   none: null,
//   bar: BarChart,
//   area: AreaChart,
//   bubble: BubbleChart,
//   pie: PieChart,
//   line: LineChart,
//   scatter: ScatterPlot,
//   candle: CandlestickChart,
//   column: ColumnChart,
//   donut: DonutChart,
//   gauge: GaugeChart,
//   heatmap: Heatmap,
//   hbar: HorizontalBarChart,
//   radar: RadarChart,
//   radial: RadialProgress,
//   spark: SparklineChart,
//   timeline: TimelineChart,

//   barStatCard: BarStatCard,
//   segmentedStatCard: SegmentedStatCard,
//   waveformStatCard: WaveformStatCard,

//   summaryCard: SummaryCard,
//   dotMatrixImage: DotMatrixImage,
//   infoCard: InfoCard,
// };

// export default componentMap;

interface ComponentDefinition {
  component: React.FC<any>;
  defaultProps: Record<string, any>;
}

export const componentRegistry: Record<string, ComponentDefinition> = {
  none: {
    component: () => null,
    defaultProps: {},
  },

  api: {
    component: ApiModule,
    defaultProps: {
      api: {
        name: "",
        url: "",
        method: "GET",
        headers: {},
        enabled: false,
        refreshIntervalMs: 60000,
        responseSchema: null,
        transformPath: "",
      },
      status: {
        isFetching: false,
        lastFetchedAt: null,
        lastFetchError: null,
      },
      lastData: null,
    }
  },

  bar: {
    component: BarChart,
    defaultProps: {
      values: [],
      barCount: 8,
      maxHeight: 100,
      barColor: "hsl(64, 85%, 59%)",
      animate: true,
    },
  },

  line: {
    component: LineChart,
    defaultProps: {
      values: [],
      pointCount: 12,
      maxValue: undefined,
      lineColor: "hsl(64, 85%, 59%)",
      showDots: true,
      showGrid: true,
      animate: true,
    },
  },

  area: {
    component: AreaChart,
    defaultProps: {
      values: [],
      pointCount: 12,
      maxValue: undefined,
      fillColor: "hsl(64, 85%, 59%)",
      strokeColor: "hsl(64, 85%, 59%)",
      showGrid: true,
      animate: true,
    },
  },

  donut: {
    component: DonutChart,
    defaultProps: {
      values: [],
      colors: [
        "hsl(64, 85%, 59%)",
        "hsl(180, 70%, 50%)",
        "hsl(280, 70%, 60%)",
        "hsl(340, 70%, 55%)",
        "hsl(30, 80%, 55%)",
      ],
      innerRadius: 25,
      centerLabel: undefined,
      centerValue: undefined,
      animate: true,
    },
  },

  bubble: {
    component: BubbleChart,
    defaultProps: {
      data: undefined,
      bubbleCount: 15,
      color: "hsl(64, 85%, 59%)",
      showGrid: true,
      animate: true,
    },
  },

  radial: {
    component: RadialProgress,
    defaultProps: {
      value: 75,
      maxValue: 100,
      size: undefined,
      strokeWidth: 8,
      color: "hsl(64, 85%, 59%)",
      trackColor: "hsl(0, 0%, 20%)",
      showValue: true,
      animate: true,
    },
  },

  barStatCard: {
    component: BarStatCard,
    defaultProps: {
      title: "Sales Report",
      value: "$9,134",
      change: 2.5,
      subtitle: "Avg. score $185,301",
      values: [],
      barCount: 12,
      accentColor: "hsl(80, 70%, 50%)",
      variant: "default",
      barShape: "rounded",
      size: "md",
      layout: "vertical",
      animate: true,
    },
  },

  segmentedStatCard: {
    component: SegmentedStatCard,
    defaultProps: {
      title: "Sales Report",
      value: "$9,134",
      change: 2.5,
      subtitle: "Avg. score $185,301",
      rows: [80, 60, 40, 100],
      segmentsPerRow: 8,
      accentColor: "hsl(100, 70%, 50%)",
      inactiveColor: "hsl(0, 0%, 25%)",
      variant: "default",
      segmentShape: "rounded",
      size: "md",
      animate: true,
    },
  },

  waveformStatCard: {
    component: WaveformStatCard,
    defaultProps: {
      title: "Sales Report",
      value: "$9,134",
      change: 2.5,
      subtitle: "Avg. score $185,301",
      values: [],
      barCount: 24,
      accentColor: "hsl(150, 60%, 45%)",
      variant: "default",
      barShape: "rounded",
      size: "md",
      animate: true,
    },
  },

  heatmap: {
    component: Heatmap,
    defaultProps: {
      data: undefined,
      rows: 7,
      cols: 12,
      colors: [
        "hsl(0, 0%, 15%)",
        "hsl(64, 60%, 40%)",
        "hsl(64, 85%, 59%)",
      ],
      animate: true,
    },
  },

  timeline: {
    component: TimelineChart,
    defaultProps: {
      events: undefined,
      lineColor: "hsl(0, 0%, 30%)",
      dotColor: "hsl(64, 85%, 59%)",
      animate: true,
    },
  },

  candle: {
    component: CandlestickChart,
    defaultProps: {
      data: undefined,
      candleCount: 20,
      upColor: "hsl(140, 70%, 45%)",
      downColor: "hsl(0, 70%, 50%)",
      animate: true,
    },
  },

  summaryCard: {
    component: SummaryCard,
    defaultProps: {
      dayLabel: "Fri",
      date: "January 17 2024",
      content: "Good morning! You have a productive day ahead.",
      showIndicator: true,
      indicatorColor: "hsl(0, 70%, 50%)",
      variant: "default",
      cornerStyle: "rounded",
      size: "md",
      maxHeight: 200,
    },
  },

  dotMatrixImage: {
    component: DotMatrixImage,
    defaultProps: {
      imageSrc:
        "https://cdn.pixabay.com/photo/2014/11/21/03/26/neist-point-540119_1280.jpg",
      dotSpacing: 7,
      dotSize: 4,
      dotStyle: "square",
      backgroundColor: "hsl(60, 10%, 85%)",
    },
  },

  infoCard: {
    component: InfoCard,
    defaultProps: {
      title: "Info",
      value: "Value",
      subtitle: "Subtitle",
      icon: undefined,
      accentColor: "hsl(64, 85%, 59%)",
      variant: "default",
      size: "md",
      animate: true,
    },
  },

  gauge: {
    component: GaugeChart,
    defaultProps: {
      value: 65,
      minValue: 0,
      maxValue: 100,
      colors: [
        "hsl(0, 70%, 55%)",
        "hsl(40, 80%, 55%)",
        "hsl(64, 85%, 59%)",
      ],
      label: undefined,
      animate: true,
    },
  },

  // These existed in componentMap but had NO props in your data list:
  scatter: {
    component: ScatterPlot,
    defaultProps: {},
  },

  column: {
    component: ColumnChart,
    defaultProps: {},
  },

  hbar: {
    component: HorizontalBarChart,
    defaultProps: {},
  },

  radar: {
    component: RadarChart,
    defaultProps: {},
  },

  spark: {
    component: SparklineChart,
    defaultProps: {},
  },
};

export const componentMap: Record<string, React.FC<any>> = Object.fromEntries(
  Object.entries(componentRegistry).map(([key, def]) => [key, def.component])
);
