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
import PlainImage from "./PlainImage";
import InfoCard from "./InfoCard/InfoCard";
import TextDisplay from "./TextDisplay/TextDisplay";

import BreedCard from "../tayloredCotent/BreedCard";

import ApiModule from "../networkComponents/ApiModule/ApiModule";
import ParserModule from "../networkComponents/ParserModule/ParserModule";



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
      // api: {
      id: "2xx",
      name: "",
      url: "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1s&limit=24",
      method: "GET",
      headers: {},
      enabled: false,
      refreshIntervalMs: 60000,
      responseSchema: null,
      transformPath: "",
      // },
      // status: {
      isFetching: false,
      lastFetchedAt: null,
      lastFetchError: null,
      // },
      lastData: null,
    }
  },

  parser: {
    component: ParserModule,
    defaultProps: {
      sourceModuleId: undefined,
      schema: { type: "passthrough" },
      lastData: null,
      lastParseError: null,
      lastParsedAt: null
    }
  },

  textDisplay: {
    component: TextDisplay,
    defaultProps: {
      text: "",
      size: "md",
      weight: "normal",
      color: "hsl(var(--foreground))",
      backgroundColor: "transparent",
      align: "left",
      italic: false,
      underline: false,
      strikethrough: false,
      uppercase: false,
      truncate: false,
      maxLines: undefined,
    },
  },

  plainImage: {
    component: PlainImage,
    defaultProps: {
      imgSource: "",
    },
  },

  breedCard: {
    component: BreedCard,
    defaultProps: {
      data: {
        id: "0XYvRd7oD",
        url: "https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg",
        breeds: [{
          weight: { imperial: "7 - 10", metric: "3 - 5" },
          id: "abys",
          name: "Abyssinian",
          temperament: "Active, Energetic, Independent, Intelligent, Gentle",
          origin: "Egypt",
          country_codes: "EG",
          country_code: "EG",
          description: "The Abyssinian is easy to care for, and a joy to have in your home.",
          life_span: "14 - 15",
          indoor: 0,
          lap: 1,
          adaptability: 5,
          affection_level: 5,
          child_friendly: 3,
          dog_friendly: 4,
          energy_level: 5,
          grooming: 1,
          health_issues: 2,
          intelligence: 5,
          shedding_level: 2,
          social_needs: 5,
          stranger_friendly: 5,
          vocalisation: 1,
          experimental: 0,
          hairless: 0,
          natural: 1,
          rare: 0,
          rex: 0,
          suppressed_tail: 0,
          short_legs: 0,
          hypoallergenic: 0,
          reference_image_id: "0XYvRd7oD",
          wikipedia_url: "https://en.wikipedia.org/wiki/Abyssinian_(cat)"
        }],
        width: 1204,
        height: 1445
      },
      size: "md",
      variant: "default",
      showImage: true,
      showStats: true,
      maxTraits: 6,
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
    defaultProps: {
      values: [],
      labels: [],
      barCount: 3,
      showLabels: true,
    },
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
