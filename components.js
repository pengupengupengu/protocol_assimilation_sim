const isPositiveNumber = (x) => !isNaN(x) && x > 0;
const isPositiveInteger = (x) => isPositiveNumber(x) && Number.isInteger(x);
const isNonnegativeInteger = (x) => !isNaN(x) && x >= 0 && Number.isInteger(x);
const isValidCaptureProbability = (x) => !isNaN(x) && x > 0 && x <= 1;

Vue.component("player-settings", {
  template: "#player-settings-template",
  props: ["settings"],
  data: () => ({
    initialSettings: InitialPlayerSettings,
    extraEmpUsageOptions: [
      {value: ExtraEmpUsageTimings.WHENEVER, text: "Use extra EMPs whenever"},
      {value: ExtraEmpUsageTimings.LAST_DAY, text: "Use extra EMPs only on the last day"},
    ],
  }),
  computed: {
    // Form validation functions.
    initialEmpsValidation() {
      return isNonnegativeInteger(this.settings.initialEmps);
    },
    initialExtraEmpsValidation() {
      return isNonnegativeInteger(this.settings.initialExtraEmps);
    },
  }
});

Vue.component("simulator-settings", {
  template: "#simulator-settings-template",
  props: ["settings"],
  data: () => ({
    initialSettings: InitialSimulatorSettings,
  }),
  computed: {
    // Form validation functions.
    numRunsValidation() {
      return isPositiveInteger(this.settings.numRuns);
    },
    numRunBucketsValidation() {
      return isPositiveInteger(this.settings.numRunBuckets);
    },
  }
});

Vue.component("system-settings", {
  template: "#system-settings-template",
  props: ["settings"],
  data: () => ({
    initialSettings: InitialSystemSettings,
  }),
  computed: {
    // Form validation functions.
    numDaysPerPoolValidation() {
      return isPositiveInteger(this.settings.numDaysPerPool);
    },
    numDaysPerRefreshValidation() {
      return isPositiveNumber(this.settings.numDaysPerMapRefresh);
    },
    mapSizeValidation() {
      return isPositiveInteger(this.settings.mapSize);
    },
    empsPerDayValidation() {
      return isPositiveNumber(this.settings.empsPerDay);
    },
    empSoftcapValidation() {
      return isPositiveInteger(this.settings.empSoftcap);
    },
    oneStarCaptureProbabilityValidation() {
      return isValidCaptureProbability(this.settings.captureProbabilities[0]);
    },
    twoStarCaptureProbabilityValidation() {
      return isValidCaptureProbability(this.settings.captureProbabilities[1]);
    },
    threeStarCaptureProbabilityValidation() {
      return isValidCaptureProbability(this.settings.captureProbabilities[2]);
    },
  }
});

Vue.component("results-graph", {
  extends: VueChartJs.Line,
  mixins: [VueChartJs.mixins.reactiveProp],
  props: ["title", "xAxisLabel", "yAxisLabel"],
  mounted() {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          type: "linear",
          scaleLabel: {
            display: true,
            labelString: this.xAxisLabel,
          },
          ticks: {
            autoSkip: true
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: this.yAxisLabel,
          },
        }],
      },
      plugins: {
        colorschemes: {
          scheme: 'brewer.SetTwo8'
        }
      }
    });
  }
});