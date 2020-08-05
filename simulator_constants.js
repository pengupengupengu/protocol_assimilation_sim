const InitialSystemSettings = Object.freeze({
  // Domain: natural numbers > 0
  numDaysPerPool: 28,
  // Domain: (0, inf]
  numDaysPerMapRefresh: 3,
  // Domain: natural numbers > 0
  mapSize: 3,
  // Domain: (0, inf]
  empsPerDay: 2,
  // Domain: natural numbers > 0
  empSoftcap: 14,
  // Domain: (0, 1]
  captureProbabilities: [1, 0.5, 0.25],
});

const ExtraEmpUsageTimings = Object.freeze({
  // Use extra EMPs whenever.
  WHENEVER: "WHENEVER",
  // Use extra EMPs only on last day.
  LAST_DAY: "LAST_DAY",
});

const InitialPlayerSettings = Object.freeze({
  // Domain: natural numbers > 0
  initialEmps: 0,
  // Domain: integers >= 0
  initialExtraEmps: 6,
  extraEmpUsageTiming: ExtraEmpUsageTimings.LAST_DAY,
});

const InitialSimulatorSettings = Object.freeze({
  // Domain: natural numbers > 0
  numRuns: 3000,
  // Domain: natural numbers > 0
  numRunBuckets: 20,
});

const SimulatorActionTypes = Object.freeze({
  CAPTURE: "CAPTURE",
  REFRESH: "REFRESH",
  RESET_BOX: "RESET_BOX",
});

const CaptureConditions = Object.freeze({
  // Only capture if hitting EMP softcap.
  SOFTCAP_ONLY: "SOFTCAP_ONLY",
  // Only capture if hitting EMP softcap, or on the last day.
  SOFTCAP_OR_LAST_DAY_ONLY: "SOFTCAP_OR_LAST_DAY_ONLY",
});

const RefreshConditions = Object.freeze({
  // Only refresh if no unit on map satisfies above conditions.
  NO_ELIGIBLE_UNIT: "NO_ELIGIBLE_UNIT",
});

const InitialStrategies = Object.freeze([{
  name: "Prioritize Ringleader (3* > 1* > Refresh > 2*)",
  prioritizedActions: [
    {type: SimulatorActionTypes.RESET_BOX},
    {type: SimulatorActionTypes.CAPTURE, rarity: 3},
    {type: SimulatorActionTypes.CAPTURE, rarity: 1},
    {type: SimulatorActionTypes.REFRESH, conditions: [RefreshConditions.NO_ELIGIBLE_UNIT]},
    {type: SimulatorActionTypes.CAPTURE, rarity: 2, conditions: [CaptureConditions.SOFTCAP_OR_LAST_DAY_ONLY]},
  ]
}, {
  name: "3* > 2* > Refresh > 1*",
  prioritizedActions: [
    {type: SimulatorActionTypes.RESET_BOX},
    {type: SimulatorActionTypes.CAPTURE, rarity: 3},
    {type: SimulatorActionTypes.CAPTURE, rarity: 2},
    {type: SimulatorActionTypes.REFRESH, conditions: [RefreshConditions.NO_ELIGIBLE_UNIT]},
    {type: SimulatorActionTypes.CAPTURE, rarity: 1, conditions: [CaptureConditions.SOFTCAP_OR_LAST_DAY_ONLY]},
  ]
}, {
  name: "3* > Manticore/Nemeum > Refresh > 2* > 1*",
  prioritizedActions: [
    {type: SimulatorActionTypes.RESET_BOX},
    {type: SimulatorActionTypes.CAPTURE, rarity: 3},
    {type: SimulatorActionTypes.CAPTURE, canonical_name: "Manticore"},
    {type: SimulatorActionTypes.CAPTURE, canonical_name: "Nemeum"},
    {type: SimulatorActionTypes.REFRESH, conditions: [RefreshConditions.NO_ELIGIBLE_UNIT]},
    {type: SimulatorActionTypes.CAPTURE, rarity: 2, conditions: [CaptureConditions.SOFTCAP_OR_LAST_DAY_ONLY]},
    {type: SimulatorActionTypes.CAPTURE, rarity: 1, conditions: [CaptureConditions.SOFTCAP_OR_LAST_DAY_ONLY]},
  ]
}, {
  name: "3* > Manticore/Nemeum > Refresh > 1* > 2*",
  prioritizedActions: [
    {type: SimulatorActionTypes.RESET_BOX},
    {type: SimulatorActionTypes.CAPTURE, rarity: 3},
    {type: SimulatorActionTypes.CAPTURE, canonical_name: "Manticore"},
    {type: SimulatorActionTypes.CAPTURE, canonical_name: "Nemeum"},
    {type: SimulatorActionTypes.REFRESH, conditions: [RefreshConditions.NO_ELIGIBLE_UNIT]},
    {type: SimulatorActionTypes.CAPTURE, rarity: 1, conditions: [CaptureConditions.SOFTCAP_OR_LAST_DAY_ONLY]},
    {type: SimulatorActionTypes.CAPTURE, rarity: 2, conditions: [CaptureConditions.SOFTCAP_OR_LAST_DAY_ONLY]},
  ]
},
/* {
  name: "2* > 3* > Refresh > 1*",
  prioritizedActions: [
    {type: SimulatorActionTypes.RESET_BOX},
    {type: SimulatorActionTypes.CAPTURE, rarity: 2},
    {type: SimulatorActionTypes.CAPTURE, rarity: 3},
    {type: SimulatorActionTypes.REFRESH, conditions: [RefreshConditions.NO_ELIGIBLE_UNIT]},
    {type: SimulatorActionTypes.CAPTURE, rarity: 1, conditions: [CaptureConditions.SOFTCAP_OR_LAST_DAY_ONLY]},
  ]
},
// */
]);

