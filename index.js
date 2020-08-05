const makeInitialAppData = function() {
  return {
    chosenPool: Pools.OUROBOROS,
    poolOptions: Object.keys(Pools).map((key) => ({value: Pools[key], text: Pools[key].canonical_name})),
    
    strategies: [...InitialStrategies],
    playerSettings: Object.assign({}, InitialPlayerSettings),
    simulatorSettings: Object.assign({}, InitialSimulatorSettings),
    systemSettings: {...InitialSystemSettings, captureProbabilities: [...InitialSystemSettings.captureProbabilities]},

    hasSimulationResults: false,
    ringleaderProbabilityChartData: {},
    ringleaderProbabilityTableData: [],
    firstRingleaderTableData: [],
    ringleaderExpectedValueChartData: {},
    manticoreExpectedValueChartData: {},
    twoStarExpectedValueChartData: {},
  };
};

const makeChartDataWithDataByUsedEmpCount = function(strategies, allStrategyResults, totalStatsToValueCallback) {
  let empUsed = Object.keys(allStrategyResults[0].by_used_emp_count);
  return {
    labels: empUsed,
    datasets: allStrategyResults.map((result, index) => ({
      label: strategies[index].name,
      data: empUsed.map((x) => ({
        x: x,
        y: Math.trunc(1000000 * totalStatsToValueCallback(result.by_used_emp_count[x].total_stats)) / 1000000,
      })),
      fill: false,
    }))
  };
};

const app = new Vue({
  el: "#app",
  data: {
    ...makeInitialAppData(),
  },
  methods: {
    simulate: function() {
      let allStrategyResults = this.strategies.map((strategy) => simulateStrategyResults(this.chosenPool, strategy, this.playerSettings, this.simulatorSettings, this.systemSettings));
      this.ringleaderProbabilityChartData = makeChartDataWithDataByUsedEmpCount(
        this.strategies,
        allStrategyResults,
        (total_stats) => total_stats.samples_with_at_least_one_ringleader / total_stats.samples);
      this.ringleaderProbabilityTableData = allStrategyResults.map((result, index) => {
        let row = {strategy: this.strategies[index].name};
        for (let empUsed in result.by_used_emp_count) {
          const probability = result.by_used_emp_count[empUsed].total_stats.samples_with_at_least_one_ringleader / result.by_used_emp_count[empUsed].total_stats.samples;
          const standardDeviation = result.by_used_emp_count[empUsed].total_stats.ringleader_probability_standard_deviation;
          row[`${empUsed} EMPs`] = `${Math.trunc(probability * 10000) / 100}% (${Math.trunc(standardDeviation * 10000) / 100}%)`;
        }
        return row;
      });
      this.medianRemainingPoolSizesChartData = makeChartDataWithDataByUsedEmpCount(
        this.strategies,
        allStrategyResults,
        (total_stats) => total_stats.median_first_box_remaining_sizes);
      this.medianSvarogsNeededIfEmpFailedChartData = makeChartDataWithDataByUsedEmpCount(
        this.strategies,
        allStrategyResults,
        (total_stats) => Math.floor(Math.log(0.5) / Math.log(1 - 1 / total_stats.median_first_box_remaining_sizes)));
      this.medianSvarogsNeededTotalChartData = makeChartDataWithDataByUsedEmpCount(
        this.strategies,
        allStrategyResults,
        (total_stats) => Math.floor(Math.log(0.5 / (1 - total_stats.samples_with_at_least_one_ringleader / total_stats.samples)) / Math.log(1 - 1 / total_stats.median_first_box_remaining_sizes)));
      this.ringleaderExpectedValueChartData = makeChartDataWithDataByUsedEmpCount(
        this.strategies,
        allStrategyResults,
        (total_stats) => total_stats.by_rarity[3] / total_stats.samples);
      this.manticoreExpectedValueChartData = makeChartDataWithDataByUsedEmpCount(
        this.strategies,
        allStrategyResults,
        (total_stats) => total_stats.by_canonical_name[CoalitionUnits.MANTICORE.canonical_name] / total_stats.samples);
      this.twoStarExpectedValueChartData = makeChartDataWithDataByUsedEmpCount(
        this.strategies,
        allStrategyResults,
        (total_stats) => total_stats.by_rarity[2] / total_stats.samples);
      this.hasSimulationResults = true;
    },
    describeSimulatorAction: function(action) {
      switch (action.type) {
        case SimulatorActionTypes.CAPTURE:
          let captureDescription = "Capture";
          if (!isNaN(action.rarity)) {
            captureDescription += ` ${action.rarity}*`;
          } else if (!!action.canonical_name) {
            captureDescription += ` "${action.canonical_name}"`;
          }
          if (!!action.conditions) {
            for (const captureCondition of action.conditions) {
              switch (captureCondition) {
                case CaptureConditions.SOFTCAP_ONLY:
                  captureDescription += " (Only when EMPs hit softcap)";
                  break;
                case CaptureConditions.SOFTCAP_OR_LAST_DAY_ONLY:
                  captureDescription += " (Only when EMPs hit softcap, or on the last day)";
                  break;
                default:
                  console.error("Unknown capture condition: ", captureCondition);
              }
            }
          }
          return captureDescription;
        case SimulatorActionTypes.REFRESH:
          let refreshDescription = "Refresh Map";
          if (!!action.conditions) {
            for (const refreshCondition of action.conditions) {
              switch (refreshCondition) {
                case RefreshConditions.NO_ELIGIBLE_UNIT:
                  refreshDescription += " (Only if no unit satisfies previous capture conditions)";
                  break;
                default:
                  console.error("Unknown refresh condition: ", refreshCondition);
              }
            }
          }
          return refreshDescription;
          
        case SimulatorActionTypes.RESET_BOX:
          return "Reset Box (if Ringleader is captured)";
          
        default:
          console.error("Unknown action: ", action);
      }
    }
  }
});
