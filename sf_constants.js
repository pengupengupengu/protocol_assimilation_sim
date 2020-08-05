const makeCoalitionUnit = (canonical_name, rarity) => Object.freeze({canonical_name, rarity});

const CoalitionUnits = Object.freeze({
  SCARECROW: makeCoalitionUnit("Scarecrow", 3),
  EXECUTIONER: makeCoalitionUnit("Executioner", 3),
  // This is a special "unit" to simulate the first fucked up pool.
  SCARECROW_OR_EXECUTIONER: makeCoalitionUnit("Scarecrow OR Executioner", 3),
  HUNTER: makeCoalitionUnit("Hunter", 3),
  INTRUDER: makeCoalitionUnit("Intruder", 3),
  DESTROYER: makeCoalitionUnit("Destroyer", 3),
  ARCHITECT: makeCoalitionUnit("Architect", 3),
  OUROBOROS: makeCoalitionUnit("Ouroboros", 3),
  
  BRUTE: makeCoalitionUnit("Brute", 2),
  DRAGOON: makeCoalitionUnit("Dragoon", 2),
  AEGIS: makeCoalitionUnit("Aegis", 2),
  NEMEUM: makeCoalitionUnit("Nemeum", 2),
  MANTICORE: makeCoalitionUnit("Manticore", 2),
  TARANTULA: makeCoalitionUnit("Tarantula", 2),
  SWAP_GUARD: makeCoalitionUnit("SWAP Guard", 2),
  SWAP_RIPPER: makeCoalitionUnit("SWAP Ripper", 2),
  SWAP_VESPID: makeCoalitionUnit("SWAP Vespid", 2),

  RIPPER: makeCoalitionUnit("Ripper", 1),
  VESPID: makeCoalitionUnit("Vespid", 1),
  GUARD: makeCoalitionUnit("Guard", 1),
  JAEGAR: makeCoalitionUnit("Jaegar", 1),
  STRIKER: makeCoalitionUnit("Striker", 1),
  SCOUT: makeCoalitionUnit("Scout", 1),
  PROWLER: makeCoalitionUnit("Prowler", 1),
  DINERGATE: makeCoalitionUnit("Dinergate", 1),
  JAGUAR: makeCoalitionUnit("Jaguar", 1),
});

const repeatUnitNTimes = (unit, times) => Array(times).fill(unit)

const Pools = Object.freeze({
  // https://i.imgur.com/lCUuNqS.jpg
  SCARECROW_OR_EXECUTIONER: {
    canonical_name: "[1] Area S09 SF Base - Scarecrow or Executioner",
    units: [CoalitionUnits.SCARECROW_OR_EXECUTIONER]
      .concat(repeatUnitNTimes(CoalitionUnits.BRUTE, 9))
      .concat(repeatUnitNTimes(CoalitionUnits.DRAGOON, 9))
      .concat(repeatUnitNTimes(CoalitionUnits.AEGIS, 10))
      
      .concat(repeatUnitNTimes(CoalitionUnits.RIPPER, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.VESPID, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.GUARD, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.JAEGAR, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.STRIKER, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.SCOUT, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.PROWLER, 11))
  },
  
  // These exist because I was thinking of a multi-pool planner feature.
  /*
  SCARECROW_ONLY: {
    canonical_name: "[1] Area S09 SF Base - Scarecrow ONLY (**HYPOTHETICAL**)",
    units: [CoalitionUnits.SCARECROW]
      .concat(repeatUnitNTimes(CoalitionUnits.BRUTE, 9))
      .concat(repeatUnitNTimes(CoalitionUnits.DRAGOON, 9))
      .concat(repeatUnitNTimes(CoalitionUnits.AEGIS, 10))
      
      .concat(repeatUnitNTimes(CoalitionUnits.RIPPER, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.VESPID, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.GUARD, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.JAEGAR, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.STRIKER, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.SCOUT, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.PROWLER, 11))
  },
  EXECUTIONER_ONLY: {
    canonical_name: "[1] Area S09 SF Base - Executioner ONLY (**HYPOTHETICAL**)",
    units: [CoalitionUnits.EXECUTIONER]
      .concat(repeatUnitNTimes(CoalitionUnits.BRUTE, 9))
      .concat(repeatUnitNTimes(CoalitionUnits.DRAGOON, 9))
      .concat(repeatUnitNTimes(CoalitionUnits.AEGIS, 10))
      
      .concat(repeatUnitNTimes(CoalitionUnits.RIPPER, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.VESPID, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.GUARD, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.JAEGAR, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.STRIKER, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.SCOUT, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.PROWLER, 11))
  },
  // */
  
  // https://i.imgur.com/vseap8I.jpg
  HUNTER: {
    canonical_name: "[2] SP721 Command Center - Hunter",
    units: [CoalitionUnits.HUNTER]
      .concat(repeatUnitNTimes(CoalitionUnits.NEMEUM, 5))
      .concat(repeatUnitNTimes(CoalitionUnits.MANTICORE, 5))
      .concat(repeatUnitNTimes(CoalitionUnits.BRUTE, 6))
      .concat(repeatUnitNTimes(CoalitionUnits.DRAGOON, 6))
      .concat(repeatUnitNTimes(CoalitionUnits.AEGIS, 6))
      
      .concat(repeatUnitNTimes(CoalitionUnits.RIPPER, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.VESPID, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.GUARD, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.JAEGAR, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.STRIKER, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.SCOUT, 10))
      .concat(repeatUnitNTimes(CoalitionUnits.PROWLER, 11))
  },
  // https://i.imgur.com/gU5awhl.jpg
  INTRUDER: {
    canonical_name: "[3] Sector SP914 - Intruder",
    units: [CoalitionUnits.INTRUDER]
      .concat(repeatUnitNTimes(CoalitionUnits.BRUTE, 4))
      .concat(repeatUnitNTimes(CoalitionUnits.DRAGOON, 4))
      .concat(repeatUnitNTimes(CoalitionUnits.AEGIS, 5))
      .concat(repeatUnitNTimes(CoalitionUnits.TARANTULA, 5))
      .concat(repeatUnitNTimes(CoalitionUnits.NEMEUM, 5))
      .concat(repeatUnitNTimes(CoalitionUnits.MANTICORE, 5))
      
      .concat(repeatUnitNTimes(CoalitionUnits.RIPPER, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.VESPID, 9))
      .concat(repeatUnitNTimes(CoalitionUnits.GUARD, 9))
      .concat(repeatUnitNTimes(CoalitionUnits.JAEGAR, 9))
      .concat(repeatUnitNTimes(CoalitionUnits.STRIKER, 9))
      .concat(repeatUnitNTimes(CoalitionUnits.DINERGATE, 9))
      .concat(repeatUnitNTimes(CoalitionUnits.SCOUT, 9))
      .concat(repeatUnitNTimes(CoalitionUnits.PROWLER, 9))
  },
  // https://i.imgur.com/9kXEXpf.jpg
  DESTROYER: {
    canonical_name: "[4] Sector SP5NANO - Destroyer",
    units: [CoalitionUnits.DESTROYER]
      .concat(repeatUnitNTimes(CoalitionUnits.NEMEUM, 4))
      .concat(repeatUnitNTimes(CoalitionUnits.MANTICORE, 4))
      .concat(repeatUnitNTimes(CoalitionUnits.TARANTULA, 4))
      .concat(repeatUnitNTimes(CoalitionUnits.AEGIS, 4))
      .concat(repeatUnitNTimes(CoalitionUnits.BRUTE, 4))
      .concat(repeatUnitNTimes(CoalitionUnits.DRAGOON, 4))
      .concat(repeatUnitNTimes(CoalitionUnits.SWAP_GUARD, 4))
      
      .concat(repeatUnitNTimes(CoalitionUnits.RIPPER, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.VESPID, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.GUARD, 7))
      .concat(repeatUnitNTimes(CoalitionUnits.JAEGAR, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.STRIKER, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.SCOUT, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.DINERGATE, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.JAGUAR, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.PROWLER, 8))
  },
  // https://i.imgur.com/slH4wvA.jpg
  ARCHITECT: {
    canonical_name: "[5] Sector SPzh3000 - Architect",
    units: [CoalitionUnits.ARCHITECT]
      .concat(repeatUnitNTimes(CoalitionUnits.NEMEUM, 3))
      .concat(repeatUnitNTimes(CoalitionUnits.MANTICORE, 4))
      .concat(repeatUnitNTimes(CoalitionUnits.TARANTULA, 4))
      .concat(repeatUnitNTimes(CoalitionUnits.AEGIS, 3))
      .concat(repeatUnitNTimes(CoalitionUnits.BRUTE, 3))
      .concat(repeatUnitNTimes(CoalitionUnits.DRAGOON, 3))
      .concat(repeatUnitNTimes(CoalitionUnits.SWAP_GUARD, 4))
      .concat(repeatUnitNTimes(CoalitionUnits.SWAP_RIPPER, 4))
      
      .concat(repeatUnitNTimes(CoalitionUnits.RIPPER, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.VESPID, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.GUARD, 7))
      .concat(repeatUnitNTimes(CoalitionUnits.JAEGAR, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.STRIKER, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.SCOUT, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.DINERGATE, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.JAGUAR, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.PROWLER, 8))
  },
  // https://i.imgur.com/RFFry2n.jpg
  OUROBOROS: {
    canonical_name: "[6] Sector SP24WR - Ouroboros",
    units: [CoalitionUnits.OUROBOROS]
      .concat(repeatUnitNTimes(CoalitionUnits.BRUTE, 3))
      .concat(repeatUnitNTimes(CoalitionUnits.DRAGOON, 3))
      .concat(repeatUnitNTimes(CoalitionUnits.AEGIS, 3))
      .concat(repeatUnitNTimes(CoalitionUnits.NEMEUM, 3))
      .concat(repeatUnitNTimes(CoalitionUnits.MANTICORE, 3))
      .concat(repeatUnitNTimes(CoalitionUnits.TARANTULA, 3))
      .concat(repeatUnitNTimes(CoalitionUnits.SWAP_GUARD, 3))
      .concat(repeatUnitNTimes(CoalitionUnits.SWAP_RIPPER, 3))
      .concat(repeatUnitNTimes(CoalitionUnits.SWAP_VESPID, 4))
      
      .concat(repeatUnitNTimes(CoalitionUnits.RIPPER, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.VESPID, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.GUARD, 7))
      .concat(repeatUnitNTimes(CoalitionUnits.JAEGAR, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.STRIKER, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.SCOUT, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.DINERGATE, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.JAGUAR, 8))
      .concat(repeatUnitNTimes(CoalitionUnits.PROWLER, 8))
  },
});

const countUnitsWithRarity = (units, rarity) => units.filter((unit) => unit.rarity == rarity).length;
const countUnitsWithCanonicalName = (units, canonical_name) => units.filter((unit) => unit.canonical_name == canonical_name).length;

