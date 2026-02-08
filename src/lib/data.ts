// Historical global asset supply data (1913-2025)
// El Numerador: tracking the supply/stock of every asset class
// Sources: World Gold Council, WFE, UN-Habitat, BIS, SIFMA, blockchain data

export interface AssetDataPoint {
  date: string;

  // GOLD — Stock & Price
  gold_stock_tonnes: number;        // Above-ground gold stock (tonnes)
  gold_annual_production: number;   // Annual mine production (tonnes)
  gold_stock_to_flow: number;       // Stock / Annual production
  gold_price_usd: number;           // USD per troy ounce
  gold_mcap: number;                // Market cap (trillions USD)
  gold_supply_index: number;        // Stock indexed base 100 = 1913
  gold_price_index: number;         // Price indexed base 100 = 1913

  // EQUITIES — Shares & Price
  equities_shares_billion: number;  // Global shares outstanding (billions)
  equities_companies_listed: number; // Companies listed globally
  equities_mcap: number;            // Global market cap (trillions USD)
  sp500_price: number;              // S&P 500 level
  equities_supply_index: number;    // Shares indexed base 100 = 1913
  equities_price_index: number;     // S&P 500 indexed base 100 = 1913

  // REAL ESTATE — Units & Price
  realestate_units_million: number; // Global housing units (millions)
  realestate_median_usd: number;    // Median US home price (USD)
  realestate_mcap: number;          // Global real estate value (trillions USD)
  realestate_supply_index: number;  // Units indexed base 100 = 1913
  realestate_price_index: number;   // Median price indexed base 100 = 1913

  // BONDS — Outstanding
  bonds_outstanding: number;        // Global debt outstanding (trillions USD)
  bonds_us10y_yield: number;        // US 10Y yield (%)
  bonds_mcap: number;               // Global bond market (trillions USD)
  bonds_supply_index: number;       // Outstanding indexed base 100 = 1913

  // BITCOIN — Supply & Price
  btc_supply: number;               // BTC in circulation
  btc_max_supply: number;           // 21,000,000 always
  btc_pct_mined: number;            // % of max supply mined
  btc_price_usd: number;            // Price in USD
  btc_mcap: number;                 // Market cap (trillions USD)
  btc_stock_to_flow: number;        // Stock / Annual issuance
  btc_supply_index: number;         // Supply indexed base 100 = 2009

  // AGGREGATE
  numerator_index: number;          // Composite supply index
  total_mcap: number;               // Total market cap all assets
  dilution_yoy_gold: number;        // Annual supply growth % gold
  dilution_yoy_equities: number;    // Annual supply growth % equities
  dilution_yoy_realestate: number;  // Annual supply growth % real estate
  dilution_yoy_bonds: number;       // Annual supply growth % bonds
  dilution_yoy_btc: number;         // Annual supply growth % bitcoin
}

// Annual snapshots — anchor points for interpolation
interface AssetSnapshot {
  year: number;
  gold_stock_tonnes: number;
  gold_production: number;
  gold_price: number;
  gold_mcap: number;
  equities_shares_billion: number;
  equities_companies: number;
  equities_mcap: number;
  sp500: number;
  realestate_units_million: number;
  realestate_median_usd: number;
  realestate_mcap: number;
  bonds_outstanding: number;
  bonds_yield: number;
  bonds_mcap: number;
  btc_supply: number;
  btc_price: number;
  btc_mcap: number;
}

// Historical anchor points
// Gold stock: WGC estimates ~35,000t in 1913 → ~212,000t in 2025
// Equities shares: estimated from market cap / avg price ratios, WFE data post-1990
// Housing units: UN-Habitat, census data, ~250M global in 1913 → ~2B+ in 2025
// Bonds: BIS, SIFMA, historical US Treasury data
// Bitcoin: exact blockchain data
const historicalAnchors: AssetSnapshot[] = [
  // 1913: Pre-war baseline
  { year: 1913, gold_stock_tonnes: 35000, gold_production: 690, gold_price: 20.67, gold_mcap: 0.04,
    equities_shares_billion: 5, equities_companies: 2000, equities_mcap: 0.001, sp500: 8.04,
    realestate_units_million: 250, realestate_median_usd: 3200, realestate_mcap: 0.9,
    bonds_outstanding: 0.03, bonds_yield: 4.0, bonds_mcap: 0.03,
    btc_supply: 0, btc_price: 0, btc_mcap: 0 },

  // 1929: Roaring 20s peak
  { year: 1929, gold_stock_tonnes: 42000, gold_production: 600, gold_price: 20.63, gold_mcap: 0.04,
    equities_shares_billion: 12, equities_companies: 4000, equities_mcap: 0.09, sp500: 21.45,
    realestate_units_million: 330, realestate_median_usd: 5500, realestate_mcap: 2.5,
    bonds_outstanding: 0.12, bonds_yield: 3.5, bonds_mcap: 0.12,
    btc_supply: 0, btc_price: 0, btc_mcap: 0 },

  // 1945: Post-WWII, Bretton Woods
  { year: 1945, gold_stock_tonnes: 50000, gold_production: 800, gold_price: 34.71, gold_mcap: 0.08,
    equities_shares_billion: 15, equities_companies: 5000, equities_mcap: 0.06, sp500: 17.36,
    realestate_units_million: 420, realestate_median_usd: 5500, realestate_mcap: 2.5,
    bonds_outstanding: 0.30, bonds_yield: 2.4, bonds_mcap: 0.30,
    btc_supply: 0, btc_price: 0, btc_mcap: 0 },

  // 1960: Post-war boom
  { year: 1960, gold_stock_tonnes: 60000, gold_production: 1050, gold_price: 35.27, gold_mcap: 0.09,
    equities_shares_billion: 25, equities_companies: 8000, equities_mcap: 0.30, sp500: 58.11,
    realestate_units_million: 550, realestate_median_usd: 11900, realestate_mcap: 6.0,
    bonds_outstanding: 0.60, bonds_yield: 4.1, bonds_mcap: 0.60,
    btc_supply: 0, btc_price: 0, btc_mcap: 0 },

  // 1971: Nixon shock — gold freed
  { year: 1971, gold_stock_tonnes: 70000, gold_production: 1250, gold_price: 41.25, gold_mcap: 0.12,
    equities_shares_billion: 35, equities_companies: 10000, equities_mcap: 0.70, sp500: 102.09,
    realestate_units_million: 650, realestate_median_usd: 24800, realestate_mcap: 10.0,
    bonds_outstanding: 1.20, bonds_yield: 6.2, bonds_mcap: 1.20,
    btc_supply: 0, btc_price: 0, btc_mcap: 0 },

  // 1980: Volcker, gold peak
  { year: 1980, gold_stock_tonnes: 85000, gold_production: 1220, gold_price: 615, gold_mcap: 2.08,
    equities_shares_billion: 50, equities_companies: 14000, equities_mcap: 2.50, sp500: 135.76,
    realestate_units_million: 780, realestate_median_usd: 63700, realestate_mcap: 20.0,
    bonds_outstanding: 3.50, bonds_yield: 12.5, bonds_mcap: 3.50,
    btc_supply: 0, btc_price: 0, btc_mcap: 0 },

  // 1990: Japan bubble, German reunification
  { year: 1990, gold_stock_tonnes: 105000, gold_production: 2180, gold_price: 383, gold_mcap: 1.54,
    equities_shares_billion: 80, equities_companies: 20000, equities_mcap: 9.40, sp500: 330.22,
    realestate_units_million: 950, realestate_median_usd: 122900, realestate_mcap: 40.0,
    bonds_outstanding: 11.00, bonds_yield: 8.1, bonds_mcap: 11.00,
    btc_supply: 0, btc_price: 0, btc_mcap: 0 },

  // 2000: Dot-com peak
  { year: 2000, gold_stock_tonnes: 130000, gold_production: 2590, gold_price: 273, gold_mcap: 1.27,
    equities_shares_billion: 150, equities_companies: 35000, equities_mcap: 31.00, sp500: 1320.28,
    realestate_units_million: 1150, realestate_median_usd: 165300, realestate_mcap: 75.0,
    bonds_outstanding: 30.00, bonds_yield: 5.1, bonds_mcap: 30.00,
    btc_supply: 0, btc_price: 0, btc_mcap: 0 },

  // 2009: GFC + Bitcoin genesis
  { year: 2009, gold_stock_tonnes: 165000, gold_production: 2600, gold_price: 1096, gold_mcap: 5.77,
    equities_shares_billion: 200, equities_companies: 42000, equities_mcap: 35.00, sp500: 1115.10,
    realestate_units_million: 1350, realestate_median_usd: 172500, realestate_mcap: 115.0,
    bonds_outstanding: 75.00, bonds_yield: 3.3, bonds_mcap: 75.00,
    btc_supply: 1623400, btc_price: 0.001, btc_mcap: 0 },

  // 2012: QE3, "whatever it takes"
  { year: 2012, gold_stock_tonnes: 175000, gold_production: 2860, gold_price: 1675, gold_mcap: 9.42,
    equities_shares_billion: 220, equities_companies: 43500, equities_mcap: 55.00, sp500: 1426.19,
    realestate_units_million: 1450, realestate_median_usd: 177200, realestate_mcap: 175.0,
    bonds_outstanding: 97.00, bonds_yield: 1.8, bonds_mcap: 97.00,
    btc_supply: 10625050, btc_price: 13.5, btc_mcap: 0.0001 },

  // 2015: ECB QE, Fed normalization
  { year: 2015, gold_stock_tonnes: 185000, gold_production: 3100, gold_price: 1060, gold_mcap: 6.23,
    equities_shares_billion: 240, equities_companies: 44000, equities_mcap: 65.00, sp500: 2043.94,
    realestate_units_million: 1530, realestate_median_usd: 222400, realestate_mcap: 210.0,
    bonds_outstanding: 100.00, bonds_yield: 2.3, bonds_mcap: 100.00,
    btc_supply: 15027800, btc_price: 430, btc_mcap: 0.007 },

  // 2017: Synchronized growth, BTC boom
  { year: 2017, gold_stock_tonnes: 190000, gold_production: 3300, gold_price: 1296, gold_mcap: 7.64,
    equities_shares_billion: 260, equities_companies: 45000, equities_mcap: 85.00, sp500: 2673.61,
    realestate_units_million: 1600, realestate_median_usd: 248800, realestate_mcap: 280.0,
    bonds_outstanding: 110.00, bonds_yield: 2.4, bonds_mcap: 110.00,
    btc_supply: 16774575, btc_price: 14000, btc_mcap: 0.24 },

  // 2020: COVID QE explosion
  { year: 2020, gold_stock_tonnes: 200000, gold_production: 3200, gold_price: 1898, gold_mcap: 11.26,
    equities_shares_billion: 290, equities_companies: 43000, equities_mcap: 93.00, sp500: 3756.07,
    realestate_units_million: 1700, realestate_median_usd: 329000, realestate_mcap: 310.0,
    bonds_outstanding: 128.00, bonds_yield: 0.9, bonds_mcap: 128.00,
    btc_supply: 18587000, btc_price: 29000, btc_mcap: 0.54 },

  // 2021: Peak stimulus, BTC ATH $69K
  { year: 2021, gold_stock_tonnes: 203000, gold_production: 3560, gold_price: 1829, gold_mcap: 11.62,
    equities_shares_billion: 300, equities_companies: 43500, equities_mcap: 121.00, sp500: 4766.18,
    realestate_units_million: 1740, realestate_median_usd: 374900, realestate_mcap: 390.0,
    bonds_outstanding: 135.00, bonds_yield: 1.5, bonds_mcap: 135.00,
    btc_supply: 18897000, btc_price: 47000, btc_mcap: 0.88 },

  // 2022: Tightening, crypto crash
  { year: 2022, gold_stock_tonnes: 205500, gold_production: 3612, gold_price: 1824, gold_mcap: 11.80,
    equities_shares_billion: 305, equities_companies: 42000, equities_mcap: 101.00, sp500: 3839.50,
    realestate_units_million: 1780, realestate_median_usd: 386300, realestate_mcap: 380.0,
    bonds_outstanding: 133.00, bonds_yield: 3.9, bonds_mcap: 133.00,
    btc_supply: 19240000, btc_price: 16500, btc_mcap: 0.32 },

  // 2023: QT continues, RRP drawdown
  { year: 2023, gold_stock_tonnes: 208500, gold_production: 3644, gold_price: 2063, gold_mcap: 12.93,
    equities_shares_billion: 310, equities_companies: 42500, equities_mcap: 112.00, sp500: 4769.83,
    realestate_units_million: 1820, realestate_median_usd: 392100, realestate_mcap: 385.0,
    bonds_outstanding: 141.00, bonds_yield: 3.9, bonds_mcap: 141.00,
    btc_supply: 19570000, btc_price: 42000, btc_mcap: 0.83 },

  // 2024: BTC ETF, gradual easing
  { year: 2024, gold_stock_tonnes: 212000, gold_production: 3700, gold_price: 2625, gold_mcap: 16.12,
    equities_shares_billion: 318, equities_companies: 43000, equities_mcap: 128.00, sp500: 5881.63,
    realestate_units_million: 1860, realestate_median_usd: 412300, realestate_mcap: 393.0,
    bonds_outstanding: 145.00, bonds_yield: 4.2, bonds_mcap: 145.00,
    btc_supply: 19790000, btc_price: 93000, btc_mcap: 1.85 },

  // 2025: Re-expansion
  { year: 2025, gold_stock_tonnes: 215000, gold_production: 3500, gold_price: 2850, gold_mcap: 18.90,
    equities_shares_billion: 325, equities_companies: 43500, equities_mcap: 148.00, sp500: 6040,
    realestate_units_million: 1900, realestate_median_usd: 425000, realestate_mcap: 405.0,
    bonds_outstanding: 150.00, bonds_yield: 4.5, bonds_mcap: 150.00,
    btc_supply: 19830000, btc_price: 97000, btc_mcap: 1.75 },
];

// Interpolate between anchor points
function interpolate(a: AssetSnapshot, b: AssetSnapshot, year: number): AssetSnapshot {
  const t = (year - a.year) / (b.year - a.year);
  const expInterp = (v1: number, v2: number) => {
    if (v1 <= 0 || v2 <= 0) return v1 + (v2 - v1) * t; // linear for zero-crossing
    return v1 * Math.pow(v2 / v1, t);
  };
  const linInterp = (v1: number, v2: number) => v1 + (v2 - v1) * t;
  return {
    year,
    gold_stock_tonnes: expInterp(a.gold_stock_tonnes, b.gold_stock_tonnes),
    gold_production: expInterp(Math.max(a.gold_production, 1), Math.max(b.gold_production, 1)),
    gold_price: expInterp(a.gold_price, b.gold_price),
    gold_mcap: expInterp(Math.max(a.gold_mcap, 0.001), Math.max(b.gold_mcap, 0.001)),
    equities_shares_billion: expInterp(a.equities_shares_billion, b.equities_shares_billion),
    equities_companies: expInterp(a.equities_companies, b.equities_companies),
    equities_mcap: expInterp(Math.max(a.equities_mcap, 0.001), Math.max(b.equities_mcap, 0.001)),
    sp500: expInterp(a.sp500, b.sp500),
    realestate_units_million: expInterp(a.realestate_units_million, b.realestate_units_million),
    realestate_median_usd: expInterp(a.realestate_median_usd, b.realestate_median_usd),
    realestate_mcap: expInterp(a.realestate_mcap, b.realestate_mcap),
    bonds_outstanding: expInterp(Math.max(a.bonds_outstanding, 0.001), Math.max(b.bonds_outstanding, 0.001)),
    bonds_yield: linInterp(a.bonds_yield, b.bonds_yield), // yields move linearly
    bonds_mcap: expInterp(Math.max(a.bonds_mcap, 0.001), Math.max(b.bonds_mcap, 0.001)),
    btc_supply: a.btc_supply === 0 && b.btc_supply === 0 ? 0 : linInterp(a.btc_supply, b.btc_supply),
    btc_price: a.btc_price === 0 && b.btc_price === 0 ? 0 : expInterp(Math.max(a.btc_price, 0.0000001), Math.max(b.btc_price, 0.0000001)),
    btc_mcap: a.btc_mcap === 0 && b.btc_mcap === 0 ? 0 : expInterp(Math.max(a.btc_mcap, 0.0000001), Math.max(b.btc_mcap, 0.0000001)),
  };
}

function generateData(): AssetDataPoint[] {
  const data: AssetDataPoint[] = [];
  const base = historicalAnchors[0]; // 1913

  const baseGoldStock = base.gold_stock_tonnes;
  const baseGoldPrice = base.gold_price;
  const baseShares = base.equities_shares_billion;
  const baseSP500 = base.sp500;
  const baseUnits = base.realestate_units_million;
  const baseMedian = base.realestate_median_usd;
  const baseBonds = base.bonds_outstanding;

  // BTC base: first year with supply (2009)
  const btcBaseYear = historicalAnchors.find(a => a.btc_supply > 0);
  const baseBTCSupply = btcBaseYear ? btcBaseYear.btc_supply : 1;

  const lastYear = historicalAnchors[historicalAnchors.length - 1].year;

  for (let year = 1913; year <= lastYear; year++) {
    // Find surrounding anchors
    let aIdx = 0;
    for (let i = 0; i < historicalAnchors.length - 1; i++) {
      if (year >= historicalAnchors[i].year && year <= historicalAnchors[i + 1].year) {
        aIdx = i;
        break;
      }
    }
    const a = historicalAnchors[aIdx];
    const b = historicalAnchors[aIdx + 1];
    const snap = year === a.year ? a : year === b.year ? b : interpolate(a, b, year);

    // Supply indices (base 100 = 1913)
    const goldSupplyIdx = (snap.gold_stock_tonnes / baseGoldStock) * 100;
    const goldPriceIdx = (snap.gold_price / baseGoldPrice) * 100;
    const equitiesSupplyIdx = (snap.equities_shares_billion / baseShares) * 100;
    const equitiesPriceIdx = (snap.sp500 / baseSP500) * 100;
    const realestateSupplyIdx = (snap.realestate_units_million / baseUnits) * 100;
    const realestatePriceIdx = (snap.realestate_median_usd / baseMedian) * 100;
    const bondsSupplyIdx = (snap.bonds_outstanding / baseBonds) * 100;

    // BTC indices (base 100 = 2009, 0 before)
    const btcSupplyIdx = snap.btc_supply > 0 ? (snap.btc_supply / baseBTCSupply) * 100 : 0;

    // Stock-to-flow
    const goldS2F = snap.gold_production > 0 ? snap.gold_stock_tonnes / snap.gold_production : 0;

    // BTC annual issuance estimate (simplified: ~328,500/year in early days, halving ~every 4 years)
    let btcAnnualIssuance = 0;
    let btcS2F = 0;
    if (snap.btc_supply > 0 && year >= 2009) {
      const halvings = Math.floor((year - 2009) / 4);
      btcAnnualIssuance = 328500 / Math.pow(2, Math.min(halvings, 6));
      btcS2F = btcAnnualIssuance > 0 ? snap.btc_supply / btcAnnualIssuance : 0;
    }

    // Composite Numerator Index
    // Weighted by approximate market cap share of total (dynamic weighting)
    const totalMcap = snap.gold_mcap + snap.equities_mcap + snap.realestate_mcap + snap.bonds_mcap + (snap.btc_mcap > 0.0000001 ? snap.btc_mcap : 0);
    const wGold = snap.gold_mcap / totalMcap;
    const wEquities = snap.equities_mcap / totalMcap;
    const wRE = snap.realestate_mcap / totalMcap;
    const wBonds = snap.bonds_mcap / totalMcap;
    const wBTC = snap.btc_mcap > 0.0000001 ? snap.btc_mcap / totalMcap : 0;

    const numeratorIdx = (
      goldSupplyIdx * wGold +
      equitiesSupplyIdx * wEquities +
      realestateSupplyIdx * wRE +
      bondsSupplyIdx * wBonds +
      (wBTC > 0 ? btcSupplyIdx * wBTC : 0)
    );

    // Dilution YoY — computed in a second pass below
    data.push({
      date: `${year}`,
      gold_stock_tonnes: +snap.gold_stock_tonnes.toFixed(0),
      gold_annual_production: +snap.gold_production.toFixed(0),
      gold_stock_to_flow: +goldS2F.toFixed(1),
      gold_price_usd: +snap.gold_price.toFixed(0),
      gold_mcap: +snap.gold_mcap.toFixed(2),
      gold_supply_index: +goldSupplyIdx.toFixed(1),
      gold_price_index: +goldPriceIdx.toFixed(1),

      equities_shares_billion: +snap.equities_shares_billion.toFixed(0),
      equities_companies_listed: +snap.equities_companies.toFixed(0),
      equities_mcap: +snap.equities_mcap.toFixed(2),
      sp500_price: +snap.sp500.toFixed(0),
      equities_supply_index: +equitiesSupplyIdx.toFixed(1),
      equities_price_index: +equitiesPriceIdx.toFixed(1),

      realestate_units_million: +snap.realestate_units_million.toFixed(0),
      realestate_median_usd: +snap.realestate_median_usd.toFixed(0),
      realestate_mcap: +snap.realestate_mcap.toFixed(2),
      realestate_supply_index: +realestateSupplyIdx.toFixed(1),
      realestate_price_index: +realestatePriceIdx.toFixed(1),

      bonds_outstanding: +snap.bonds_outstanding.toFixed(2),
      bonds_us10y_yield: +snap.bonds_yield.toFixed(1),
      bonds_mcap: +snap.bonds_mcap.toFixed(2),
      bonds_supply_index: +bondsSupplyIdx.toFixed(1),

      btc_supply: +snap.btc_supply.toFixed(0),
      btc_max_supply: 21000000,
      btc_pct_mined: +(snap.btc_supply / 21000000 * 100).toFixed(1),
      btc_price_usd: +snap.btc_price.toFixed(0),
      btc_mcap: snap.btc_mcap > 0.0000001 ? +snap.btc_mcap.toFixed(4) : 0,
      btc_stock_to_flow: +btcS2F.toFixed(1),
      btc_supply_index: +btcSupplyIdx.toFixed(1),

      numerator_index: +numeratorIdx.toFixed(1),
      total_mcap: +totalMcap.toFixed(2),

      // Placeholder — will be computed in second pass
      dilution_yoy_gold: 0,
      dilution_yoy_equities: 0,
      dilution_yoy_realestate: 0,
      dilution_yoy_bonds: 0,
      dilution_yoy_btc: 0,
    });
  }

  // Second pass: compute YoY dilution
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const curr = data[i];
    const yoy = (curr_val: number, prev_val: number) =>
      prev_val > 0 ? +((curr_val / prev_val - 1) * 100).toFixed(2) : 0;

    curr.dilution_yoy_gold = yoy(curr.gold_stock_tonnes, prev.gold_stock_tonnes);
    curr.dilution_yoy_equities = yoy(curr.equities_shares_billion, prev.equities_shares_billion);
    curr.dilution_yoy_realestate = yoy(curr.realestate_units_million, prev.realestate_units_million);
    curr.dilution_yoy_bonds = yoy(curr.bonds_outstanding, prev.bonds_outstanding);
    curr.dilution_yoy_btc = prev.btc_supply > 0 ? yoy(curr.btc_supply, prev.btc_supply) : 0;
  }

  return data;
}

export const assetData = generateData();

// CAGR: Compound Annual Growth Rate
function cagr(initial: number, final: number, years: number): number {
  if (initial <= 0 || final <= 0 || years <= 0) return 0;
  return +((Math.pow(final / initial, 1 / years) - 1) * 100).toFixed(1);
}

// Get latest metrics with CAGR
export function getLatestMetrics() {
  const latest = assetData[assetData.length - 1];
  const first = assetData[0]; // 1913
  const years = 112; // 1913-2025

  return {
    numeratorIndex: {
      value: latest.numerator_index,
      change: cagr(first.numerator_index, latest.numerator_index, years),
      label: "Índice Numerador",
      unit: "",
    },
    totalMcap: {
      value: latest.total_mcap,
      change: cagr(first.total_mcap, latest.total_mcap, years),
      label: "Market Cap Total",
      unit: "T",
    },
    goldS2F: {
      value: latest.gold_stock_to_flow,
      change: cagr(first.gold_stock_to_flow, latest.gold_stock_to_flow, years),
      label: "Oro Stock-to-Flow",
      unit: "x",
    },
  };
}

export type MetricData = ReturnType<typeof getLatestMetrics>[keyof ReturnType<typeof getLatestMetrics>];
