// Shamelessly copied: https://stackoverflow.com/a/2450976
const shufflePool = function (pool) {
  var currentIndex = pool.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = pool[currentIndex];
    pool[currentIndex] = pool[randomIndex];
    pool[randomIndex] = temporaryValue;
  }

  return pool;
};

const findIndexOfMapUnit = function (map, captureAction) {
  if (!isNaN(captureAction.rarity)) {
    return map.findIndex((unit) => unit.rarity == captureAction.rarity);
  } else if (!!captureAction.canonical_name) {
    return map.findIndex((unit) => unit.canonical_name == captureAction.canonical_name);
  }
  return -1;
};

const recordUsedEmpResults = function (results, runBucketNumber, usedEmpCount, boxNumber, remainingPool, capturedUnits) {
  if (!(usedEmpCount in results.by_used_emp_count)) {
    results.by_used_emp_count[usedEmpCount] = {
      buckets: [],
      total_stats: {
        samples: 0,
        samples_with_at_least_one_ringleader: 0,
        by_canonical_name: {},
        by_rarity: {},
        first_box_remaining_sizes: [],
      }
    }
  }
  if (!(runBucketNumber in results.by_used_emp_count[usedEmpCount].buckets)) {
    results.by_used_emp_count[usedEmpCount].buckets[runBucketNumber] = {
      samples: 0,
      samples_with_at_least_one_ringleader: 0,
    };
  }
  let total_stats = results.by_used_emp_count[usedEmpCount].total_stats;
  let bucket = results.by_used_emp_count[usedEmpCount].buckets[runBucketNumber];
  bucket.samples++;
  total_stats.samples++;
  if (countUnitsWithRarity(capturedUnits, 3) > 0) {
    bucket.samples_with_at_least_one_ringleader++;
    total_stats.samples_with_at_least_one_ringleader++;
  }
  total_stats.first_box_remaining_sizes.push(boxNumber == 1 ? remainingPool.length : 0);
  for (const capturedUnit of capturedUnits) {
    total_stats.by_canonical_name[capturedUnit.canonical_name] = (total_stats.by_canonical_name[capturedUnit.canonical_name] || 0) + 1;
    total_stats.by_rarity[capturedUnit.rarity] = (total_stats.by_rarity[capturedUnit.rarity] || 0) + 1;
  }
};

const simulateStrategyResults = function (pool, strategy, playerSettings, simulatorSettings, systemSettings) {
  let results = {
    // Data sliced by number of used EMPs.
    by_used_emp_count: {},
    // Data from the first ringleader captured.
    by_first_ringleader_capture: {
      used_emp_counts: []
    }
  };
  for (let run = 0; run < simulatorSettings.numRuns; run++) {
    // The results are put into buckets to compute the standard deviation of the distribution of P(at least one ringleader).
    const runBucketNumber = run % simulatorSettings.numRunBuckets;
    
    let capturedUnits = [];
    // The first three (or less) elements are assumed to be the map.
    let remainingPool = shufflePool([...pool.units]);
    let cachedMap = remainingPool.slice(0, systemSettings.mapSize);
    
    let day = 1;
    let nextRefreshDay = 1 + systemSettings.numDaysPerMapRefresh;
    let usedEmpCount = 0;
    let empCount = playerSettings.initialEmps + systemSettings.empsPerDay;
    let extraEmps = playerSettings.initialExtraEmps;
    let boxNumber = 1;
    
    // Run capture simulation.
    while (day <= systemSettings.numDaysPerPool) {
      let executedAction = false;
      let someUnitSatisifiedSomePreviousCondition = false;
      for (const action of strategy.prioritizedActions) {
        if (executedAction) {
          break;
        }
        switch (action.type) {
          case SimulatorActionTypes.CAPTURE:
            let unitIndex = findIndexOfMapUnit(cachedMap, action);
            let satisifiedAdditionalCaptureConditions = true;
            if (!!action.conditions) {
              for (const captureCondition of action.conditions) {
                switch (captureCondition) {
                  case CaptureConditions.SOFTCAP_ONLY:
                    if (empCount < systemSettings.empSoftcap) {
                      satisifiedAdditionalCaptureConditions = false;
                    }
                    break;
                  case CaptureConditions.SOFTCAP_OR_LAST_DAY_ONLY:
                    if (empCount < systemSettings.empSoftcap && day != systemSettings.numDaysPerPool) {
                      satisifiedAdditionalCaptureConditions = false;
                    }
                    break;
                  default:
                    console.error("Unknown capture condition: ", captureCondition);
                }
              }
            }
            if (unitIndex != -1 && satisifiedAdditionalCaptureConditions) {
              someUnitSatisifiedSomePreviousCondition = true;
              
              if (empCount > 0) {
                empCount--;
              } else if (extraEmps > 0 && 
                           (playerSettings.extraEmpUsageTiming == ExtraEmpUsageTimings.WHENEVER ||
                            (playerSettings.extraEmpUsageTiming == ExtraEmpUsageTimings.LAST_DAY && day == systemSettings.numDaysPerPool))) {
                extraEmps--;
              } else {
                break;
              }
              usedEmpCount++;
              
              let unit = remainingPool.splice(unitIndex, 1)[0];
              const isCaptureSuccessful = Math.random() < systemSettings.captureProbabilities[unit.rarity - 1];
              if (isCaptureSuccessful) {
                // Capture success!
                capturedUnits.push(unit);
              } else {
                // Capture failure.
                // ASSUMPTION:
                //   If the map size is greater than or equal to the remaining pool size (including the attempted unit),
                //   the attempted unit will simply be displayed again on the map.
                //   Otherwise, we **ASSUME** that the attempted unit CANNOT be immediately seen on the map again.
                //   Therefore, the unit will be spliced into a random spot between mapSize and remainingPool.length + 1.
                if (remainingPool.length + 1 <= systemSettings.mapSize) {
                  remainingPool.push(unit);
                } else {
                  remainingPool.splice(Math.floor(Math.random() * (remainingPool.length + 1 - systemSettings.mapSize) + systemSettings.mapSize), 0, unit);
                }
              }
              
              cachedMap = remainingPool.slice(0, systemSettings.mapSize);
              executedAction = true;
              
              if (usedEmpCount % 5 == 0) {
                recordUsedEmpResults(results, runBucketNumber, usedEmpCount, boxNumber, remainingPool, capturedUnits);
              }
              if (boxNumber == 1 && isCaptureSuccessful && unit.rarity == 3) {
                results.by_first_ringleader_capture.used_emp_counts.push(usedEmpCount);
              }
            }
            break;

          case SimulatorActionTypes.REFRESH:
            if (nextRefreshDay <= day) {
              let satisifiedAdditionalRefreshConditions = true;
              if (!!action.conditions) {
                for (const refreshCondition of action.conditions) {
                  switch (refreshCondition) {
                    case RefreshConditions.NO_ELIGIBLE_UNIT:
                      if (someUnitSatisifiedSomePreviousCondition) {
                        satisifiedAdditionalRefreshConditions = false;
                      }
                      break;
                    default:
                      console.error("Unknown refresh condition: ", refreshCondition);
                  }
                }
              }
              if (satisifiedAdditionalRefreshConditions) {
                //console.log("Refreshing map...");
                shufflePool(remainingPool);
                cachedMap = remainingPool.slice(0, systemSettings.mapSize);
                nextRefreshDay += systemSettings.numDaysPerMapRefresh;
                executedAction = true;
              }
            }
            break;

          case SimulatorActionTypes.RESET_BOX:
            if (countUnitsWithRarity(remainingPool, 3) == 0) {
              //console.log("Resetting box...");
              remainingPool = shufflePool([...pool.units]);
              cachedMap = remainingPool.slice(0, systemSettings.mapSize);
              boxNumber++;
              executedAction = true;
            }
            break;

          default:
            console.error("Unknown action: ", action);
        }
      }
      
      if (!executedAction) {
        day++;
        if (day <= systemSettings.numDaysPerPool) {
          empCount += systemSettings.empsPerDay;
        }
      }
    }
    
    // Record stats for the final EMP count if it's not a multiple of five.
    if (usedEmpCount % 5 != 0) {
      recordUsedEmpResults(results, runBucketNumber, usedEmpCount, boxNumber, remainingPool, capturedUnits);
    }
  }
  
  // Post processing for stats based on used EMP counts.
  for (let key in results.by_used_emp_count) {
    let result = results.by_used_emp_count[key];
    // Produce aggregate stats.
    result.total_stats.ringleader_probability_standard_deviation =
      Math.sqrt(
        result.buckets.reduce(
          (sum, bucket) => sum +
            Math.pow(
              bucket.samples_with_at_least_one_ringleader / bucket.samples
                - result.total_stats.samples_with_at_least_one_ringleader / result.total_stats.samples, 2),
          0)
          / result.buckets.length);
    result.total_stats.first_box_remaining_sizes.sort();
    result.total_stats.median_first_box_remaining_sizes = result.total_stats.first_box_remaining_sizes[result.total_stats.first_box_remaining_sizes.length / 2];
  }

  console.log(results);
  return results;
};

