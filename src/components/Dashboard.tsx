"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from "recharts";
import { assetData, getLatestMetrics } from "@/lib/data";
import MetricCard from "./MetricCard";
import ChartSection from "./ChartSection";

type TimeRange = "10Y" | "25Y" | "50Y" | "ALL";

const DEFAULT_COLORS = {
  blue: "#00aaff", blueDim: "#0088cc", green: "#00ff88",
  purple: "#aa55ff", amber: "#ffaa00", red: "#ff3355",
  cyan: "#00ddff", orange: "#ff8800", muted: "#55556a",
};

function useThemeColors() {
  const getColors = useCallback(() => {
    if (typeof window === "undefined") return DEFAULT_COLORS;
    const s = getComputedStyle(document.documentElement);
    const g = (v: string, fb: string) => s.getPropertyValue(v).trim() || fb;
    return {
      blue: g("--accent-blue", "#00aaff"),
      blueDim: g("--accent-blue-dim", "#0088cc"),
      green: g("--accent-green", "#00ff88"),
      purple: g("--accent-purple", "#aa55ff"),
      amber: g("--accent-amber", "#ffaa00"),
      red: g("--accent-red", "#ff3355"),
      cyan: g("--accent-cyan", "#00ddff"),
      orange: "#ff8800",
      muted: g("--text-muted", "#55556a"),
    };
  }, []);

  const [colors, setColors] = useState(DEFAULT_COLORS);

  useEffect(() => {
    setColors(getColors());
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "data-theme") {
          requestAnimationFrame(() => setColors(getColors()));
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [getColors]);

  return colors;
}

function formatValue(v: number): string {
  if (v >= 1) return `$${v.toFixed(2)}T`;
  if (v >= 0.001) return `$${(v * 1000).toFixed(1)}B`;
  return `$${(v * 1000000).toFixed(0)}M`;
}

function IndexTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div
      className="rounded-lg px-4 py-3 text-xs"
      style={{
        background: "var(--bg-tooltip)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(10px)",
      }}
    >
      <p className="mb-2 font-medium" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span style={{ color: "var(--text-muted)" }}>{entry.name}:</span>
          <span className="font-medium tabular-nums" style={{ color: entry.color }}>
            {typeof entry.value === "number" ? (entry.value >= 1000 ? `${(entry.value / 1000).toFixed(1)}K` : entry.value.toFixed(1)) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div
      className="rounded-lg px-4 py-3 text-xs"
      style={{
        background: "var(--bg-tooltip)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(10px)",
      }}
    >
      <p className="mb-2 font-medium" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span style={{ color: "var(--text-muted)" }}>{entry.name}:</span>
          <span className="font-medium tabular-nums" style={{ color: entry.color }}>
            {formatValue(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function TimeRangeSelector({
  range,
  onChange,
}: {
  range: TimeRange;
  onChange: (r: TimeRange) => void;
}) {
  const options: TimeRange[] = ["10Y", "25Y", "50Y", "ALL"];
  return (
    <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--controls-bg)", border: "1px solid var(--border-subtle)" }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="px-2.5 sm:px-3.5 py-1.5 rounded-md text-[9px] sm:text-[10px] tracking-wider uppercase transition-all"
          style={{
            background:
              range === opt
                ? "var(--accent-blue-bg-active)"
                : "transparent",
            color:
              range === opt
                ? "var(--accent-blue)"
                : "var(--text-muted)",
            border:
              range === opt
                ? "1px solid var(--accent-blue-border-active)"
                : "1px solid transparent",
            boxShadow:
              range === opt
                ? "var(--accent-blue-glow)"
                : "none",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ScaleToggle({ isLog, onToggle }: { isLog: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="px-3.5 py-1.5 rounded-md text-[10px] tracking-wider uppercase transition-all"
      style={{
        background: isLog ? "var(--accent-blue-bg-active)" : "transparent",
        color: isLog ? "var(--accent-blue)" : "var(--text-muted)",
        border: isLog ? "1px solid var(--accent-blue-border-active)" : "1px solid var(--border-subtle)",
      }}
    >
      LOG
    </button>
  );
}

export default function Dashboard() {
  const [range, setRange] = useState<TimeRange>("ALL");
  const [logScale, setLogScale] = useState(false);
  const COLORS = useThemeColors();
  const metrics = useMemo(() => getLatestMetrics(), []);

  const filteredData = useMemo(() => {
    if (range === "10Y") return assetData.slice(-10);
    if (range === "25Y") return assetData.slice(-25);
    if (range === "50Y") return assetData.slice(-50);
    return assetData;
  }, [range]);

  const xTicks = useMemo(() => {
    const dates = filteredData.map(d => d.date);
    const span = dates.length;
    if (span <= 12) return undefined;
    const yearStep = span <= 25 ? 5 : span <= 60 ? 10 : 20;
    const firstYear = parseInt(dates[0]);
    const lastYear = parseInt(dates[dates.length - 1]);
    const startYear = Math.ceil(firstYear / yearStep) * yearStep;
    const ticks: string[] = [];
    for (let y = startYear; y <= lastYear; y += yearStep) {
      const d = `${y}`;
      if (dates.includes(d)) ticks.push(d);
    }
    if (!ticks.includes(dates[0])) ticks.unshift(dates[0]);
    if (!ticks.includes(dates[dates.length - 1])) ticks.push(dates[dates.length - 1]);
    return ticks;
  }, [filteredData]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
      {/* Thesis banner */}
      <div className="mb-8 sm:mb-12 fade-in-up pt-4">
        <p
          className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.15] tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Los activos tambi&eacute;n se diluyen.
          <br />
          <span className="glow-blue" style={{ color: "var(--accent-blue)" }}>
            Unos m&aacute;s que otros.
          </span>
        </p>
        <p
          className="mt-3 sm:mt-4 text-xs sm:text-sm max-w-2xl leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Todo precio es una fracci&oacute;n. El numerador es la cantidad de activos
          &mdash; cu&aacute;ntas acciones, onzas de oro, casas, bonos y bitcoins existen.
          Cuando la oferta de un activo crece r&aacute;pido, cada unidad vale menos.
          Los activos que m&aacute;s resisten la diluci&oacute;n son los que mejor
          preservan valor. La escasez no es opcional &mdash; es la &uacute;nica defensa
          contra la expansi&oacute;n monetaria.
        </p>
        <div className="divider-gradient mt-6 sm:mt-8" />
      </div>

      {/* Time range + scale toggle */}
      <div className="flex justify-end items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <ScaleToggle isLog={logScale} onToggle={() => setLogScale(!logScale)} />
        <TimeRangeSelector range={range} onChange={setRange} />
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-10">
        <MetricCard
          label={metrics.numeratorIndex.label}
          value={metrics.numeratorIndex.value}
          change={metrics.numeratorIndex.change}
          unit={metrics.numeratorIndex.unit}
          delay={1}
        />
        <MetricCard
          label={metrics.totalMcap.label}
          value={metrics.totalMcap.value}
          change={metrics.totalMcap.change}
          unit={metrics.totalMcap.unit}
          delay={2}
        />
        <MetricCard
          label={metrics.goldS2F.label}
          value={metrics.goldS2F.value}
          change={metrics.goldS2F.change}
          unit={metrics.goldS2F.unit}
          delay={3}
        />
      </div>

      {/* 1. Numerator Index — Hero Chart */}
      <ChartSection
        title="Índice Numerador — Cuánto se diluyó la oferta de activos"
        subtitle="Compuesto ponderado por market cap de la oferta de cada clase de activo. Base 100 = 1913. Más alto = más unidades de activos existen."
        delay={3}
      >
        <div className="h-[250px] sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="gradNum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 10 }} ticks={xTicks} axisLine={false} tickLine={false} />
              <YAxis
                stroke="var(--text-muted)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}
                scale={logScale ? "log" : "auto"} domain={logScale ? ["auto", "auto"] : ["auto", "auto"]}
                allowDataOverflow={logScale}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`}
              />
              <Tooltip content={<IndexTooltip />} />
              <Area type="monotone" dataKey="numerator_index" name="Índice" stroke={COLORS.blue} fill="url(#gradNum)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartSection>

      {/* 2. Two column: Supply Indexed */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 mt-4 sm:mt-6">
        {/* Supply Indexed — All assets */}
        <ChartSection
          title="Supply Indexado — ¿Qué se diluye más rápido?"
          subtitle="Oferta de cada activo indexada a base 100 en 1913. Los bonos son los que más crecen; el oro, el que menos."
          delay={4}
        >
          <div className="h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredData}>
                <defs>
                  <linearGradient id="gradGoldS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.1} />
                    <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 10 }} ticks={xTicks} axisLine={false} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}
                  scale={logScale ? "log" : "auto"} domain={logScale ? ["auto", "auto"] : [0, "auto"]}
                  allowDataOverflow={logScale}
                  tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`}
                />
                <Tooltip content={<IndexTooltip />} />
                <Line type="monotone" dataKey="bonds_supply_index" name="Bonos" stroke={COLORS.cyan} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="equities_supply_index" name="Acciones" stroke={COLORS.purple} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="realestate_supply_index" name="Inmuebles" stroke={COLORS.red} strokeWidth={1.5} dot={false} />
                <Area type="monotone" dataKey="gold_supply_index" name="Oro" stroke={COLORS.amber} fill="url(#gradGoldS)" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <ChartLegend
            items={[
              { color: COLORS.cyan, label: "Bonos" },
              { color: COLORS.purple, label: "Acciones" },
              { color: COLORS.red, label: "Inmuebles" },
              { color: COLORS.amber, label: "Oro" },
            ]}
          />
        </ChartSection>

        {/* Stock-to-Flow: Gold vs Bitcoin */}
        <ChartSection
          title="Stock-to-Flow — La escasez programada"
          subtitle="Ratio stock / producción anual. Mayor S2F = más escaso. El oro mantiene ~60x; Bitcoin supera al oro post-halving."
          delay={5}
        >
          <div className="h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredData.filter(d => parseInt(d.date) >= 2009)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}
                  scale={logScale ? "log" : "auto"} domain={logScale ? ["auto", "auto"] : [0, "auto"]}
                  allowDataOverflow={logScale}
                />
                <Tooltip content={<IndexTooltip />} />
                <Line type="monotone" dataKey="gold_stock_to_flow" name="Oro S2F" stroke={COLORS.amber} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="btc_stock_to_flow" name="BTC S2F" stroke={COLORS.orange} strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <ChartLegend
            items={[
              { color: COLORS.amber, label: "Oro S2F" },
              { color: COLORS.orange, label: "Bitcoin S2F" },
            ]}
          />
        </ChartSection>
      </div>

      {/* 3. Oferta vs Precio — Elasticidad */}
      <div className="mt-4 sm:mt-6">
        <ChartSection
          title={`\u00bfC\u00f3mo reacciona la oferta al precio?`}
          subtitle={`Oferta indexada (l\u00ednea s\u00f3lida) vs precio indexado (l\u00ednea punteada) para cada activo. Base 100 = 1913. Cuando el precio sube, \u00bfcu\u00e1nto crece la oferta?`}
          delay={5}
        >
          <div className="h-[250px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 10 }} ticks={xTicks} axisLine={false} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}
                  scale={logScale ? "log" : "auto"} domain={logScale ? ["auto", "auto"] : [0, "auto"]}
                  allowDataOverflow={logScale}
                  tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`}
                />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (!active || !payload) return null;
                    const point = filteredData.find((d: any) => d.date === label);
                    return (
                      <div
                        className="rounded-lg px-4 py-3 text-xs"
                        style={{
                          background: "var(--bg-tooltip)",
                          border: "1px solid var(--border)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <p className="mb-2 font-medium" style={{ color: "var(--text-secondary)" }}>{label}</p>
                        {payload.map((entry: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 py-0.5">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ background: entry.color }}
                            />
                            <span style={{ color: "var(--text-muted)" }}>{entry.name}:</span>
                            <span className="font-medium tabular-nums" style={{ color: entry.color }}>
                              {entry.value >= 1000 ? `${(entry.value / 1000).toFixed(1)}K` : entry.value.toFixed(0)}
                            </span>
                          </div>
                        ))}
                        {point && (
                          <div className="mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                            <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Elasticidad oferta-precio</p>
                            {point.elasticity_gold !== undefined && point.elasticity_gold !== 0 && (
                              <div className="flex items-center gap-2 py-0.5">
                                <span style={{ color: COLORS.amber }}>{point.elasticity_gold.toFixed(2)}</span>
                                <span style={{ color: "var(--text-muted)" }}>Oro</span>
                              </div>
                            )}
                            {point.elasticity_equities !== undefined && point.elasticity_equities !== 0 && (
                              <div className="flex items-center gap-2 py-0.5">
                                <span style={{ color: COLORS.purple }}>{point.elasticity_equities.toFixed(2)}</span>
                                <span style={{ color: "var(--text-muted)" }}>Acciones</span>
                              </div>
                            )}
                            {point.elasticity_realestate !== undefined && point.elasticity_realestate !== 0 && (
                              <div className="flex items-center gap-2 py-0.5">
                                <span style={{ color: COLORS.red }}>{point.elasticity_realestate.toFixed(2)}</span>
                                <span style={{ color: "var(--text-muted)" }}>Inmuebles</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                {/* Oro — oferta s\u00f3lida, precio punteado */}
                <Line type="monotone" dataKey="gold_supply_index" name="Oro Oferta" stroke={COLORS.amber} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="gold_price_index" name="Oro Precio" stroke={COLORS.amber} strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                {/* Acciones — oferta s\u00f3lida, precio punteado */}
                <Line type="monotone" dataKey="equities_supply_index" name="Acciones Oferta" stroke={COLORS.purple} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="equities_price_index" name="S&P 500 Precio" stroke={COLORS.purple} strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                {/* Inmuebles — oferta s\u00f3lida, precio punteado */}
                <Line type="monotone" dataKey="realestate_supply_index" name="Inmuebles Oferta" stroke={COLORS.red} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="realestate_price_index" name="Inmuebles Precio" stroke={COLORS.red} strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <ChartLegend
            items={[
              { color: COLORS.amber, label: "Oro Oferta" },
              { color: COLORS.amber, label: "Oro Precio", dashed: true },
              { color: COLORS.purple, label: "Acciones Oferta" },
              { color: COLORS.purple, label: "S&P 500 Precio", dashed: true },
              { color: COLORS.red, label: "Inmuebles Oferta" },
              { color: COLORS.red, label: "Inmuebles Precio", dashed: true },
            ]}
          />
        </ChartSection>
      </div>

      {/* 4. Market Cap — Absolute Wealth */}
      <div className="mt-4 sm:mt-6">
        <ChartSection
          title="Riqueza Global — Más activos, más unidades, más denominador"
          subtitle="Capitalización total por clase de activo en USD nominales. El crecimiento refleja tanto creación de riqueza real como dilución monetaria."
          delay={5}
        >
          <div className="h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="gradGoldMcap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradEqMcap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.purple} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={COLORS.purple} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradREMcap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.red} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={COLORS.red} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradBondsMcap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradBTCMcap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.orange} stopOpacity={0.6} />
                    <stop offset="100%" stopColor={COLORS.orange} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 10 }} ticks={xTicks} axisLine={false} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `$${v}T`}
                />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (!active || !payload) return null;
                    const point = filteredData.find((d: any) => d.date === label);
                    if (!point) return null;
                    const total = point.realestate_mcap + point.bonds_mcap + point.equities_mcap + point.gold_mcap + point.btc_mcap;
                    const items = [
                      { label: "Inmuebles", value: point.realestate_mcap, color: COLORS.red },
                      { label: "Bonos", value: point.bonds_mcap, color: COLORS.cyan },
                      { label: "Acciones", value: point.equities_mcap, color: COLORS.purple },
                      { label: "Oro", value: point.gold_mcap, color: COLORS.amber },
                      ...(point.btc_mcap > 0.001 ? [{ label: "Bitcoin", value: point.btc_mcap, color: COLORS.orange }] : []),
                    ];
                    return (
                      <div
                        className="rounded-lg px-4 py-3 text-xs"
                        style={{ background: "var(--bg-tooltip)", border: "1px solid var(--border)", backdropFilter: "blur(10px)" }}
                      >
                        <p className="mb-2 font-medium" style={{ color: "var(--text-secondary)" }}>{label}</p>
                        {items.map((item) => (
                          <div key={item.label} className="flex items-center gap-2 py-0.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                            <span style={{ color: "var(--text-muted)" }}>{item.label}:</span>
                            <span className="font-medium tabular-nums" style={{ color: item.color }}>
                              ${item.value.toFixed(1)}T
                            </span>
                          </div>
                        ))}
                        <div className="mt-1 pt-1" style={{ borderTop: "1px solid var(--border)" }}>
                          <div className="flex items-center gap-2 py-0.5">
                            <span style={{ color: "var(--text-muted)" }}>Total:</span>
                            <span className="font-medium tabular-nums" style={{ color: "var(--text-primary)" }}>
                              ${total.toFixed(1)}T
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Area type="monotone" dataKey="realestate_mcap" name="Inmuebles" stackId="1" stroke={COLORS.red} fill="url(#gradREMcap)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="bonds_mcap" name="Bonos" stackId="1" stroke={COLORS.cyan} fill="url(#gradBondsMcap)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="equities_mcap" name="Acciones" stackId="1" stroke={COLORS.purple} fill="url(#gradEqMcap)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="gold_mcap" name="Oro" stackId="1" stroke={COLORS.amber} fill="url(#gradGoldMcap)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="btc_mcap" name="Bitcoin" stackId="1" stroke={COLORS.orange} fill="url(#gradBTCMcap)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <ChartLegend
            items={[
              { color: COLORS.red, label: "Inmuebles" },
              { color: COLORS.cyan, label: "Bonos" },
              { color: COLORS.purple, label: "Acciones" },
              { color: COLORS.amber, label: "Oro" },
              { color: COLORS.orange, label: "Bitcoin" },
            ]}
          />
        </ChartSection>
      </div>

      {/* 5. Annual Dilution Rate */}
      <div className="mt-4 sm:mt-6">
        <ChartSection
          title="Dilución Anual — Cuánto crece la oferta cada año"
          subtitle="Crecimiento anual (%) del supply de cada activo. Oro ~1.5%/año, Bitcoin decreciente post-halving, bonos y acciones crecen más rápido."
          delay={5}
        >
          <div className="h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 10 }} ticks={xTicks} axisLine={false} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (!active || !payload) return null;
                    return (
                      <div
                        className="rounded-lg px-4 py-3 text-xs"
                        style={{ background: "var(--bg-tooltip)", border: "1px solid var(--border)", backdropFilter: "blur(10px)" }}
                      >
                        <p className="mb-2 font-medium" style={{ color: "var(--text-secondary)" }}>{label}</p>
                        {payload.map((entry: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 py-0.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                            <span style={{ color: "var(--text-muted)" }}>{entry.name}:</span>
                            <span className="font-medium tabular-nums" style={{ color: entry.color }}>
                              {entry.value.toFixed(2)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
                <Line type="monotone" dataKey="dilution_yoy_gold" name="Oro" stroke={COLORS.amber} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="dilution_yoy_equities" name="Acciones" stroke={COLORS.purple} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="dilution_yoy_realestate" name="Inmuebles" stroke={COLORS.red} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="dilution_yoy_bonds" name="Bonos" stroke={COLORS.cyan} strokeWidth={1.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <ChartLegend
            items={[
              { color: COLORS.amber, label: "Oro (~1.5%)" },
              { color: COLORS.purple, label: "Acciones (~3-5%)" },
              { color: COLORS.red, label: "Inmuebles (~2%)" },
              { color: COLORS.cyan, label: "Bonos (~5-8%)" },
            ]}
          />
        </ChartSection>
      </div>

      {/* 6. Bitcoin Supply */}
      <div className="mt-4 sm:mt-6">
        <ChartSection
          title="Bitcoin Supply — Escasez verificable"
          subtitle="Supply en circulación vs máximo de 21M. Cada halving reduce la emisión a la mitad. Ya se minó el 94.4% del supply total."
          delay={5}
        >
          <div className="h-[220px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData.filter(d => parseInt(d.date) >= 2009)}>
                <defs>
                  <linearGradient id="gradBTCSupply" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.orange} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={COLORS.orange} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}M`}
                  domain={[0, 21000000]}
                />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (!active || !payload) return null;
                    const point = filteredData.find((d: any) => d.date === label);
                    if (!point) return null;
                    return (
                      <div
                        className="rounded-lg px-4 py-3 text-xs"
                        style={{ background: "var(--bg-tooltip)", border: "1px solid var(--border)", backdropFilter: "blur(10px)" }}
                      >
                        <p className="mb-2 font-medium" style={{ color: "var(--text-secondary)" }}>{label}</p>
                        <div className="flex items-center gap-2 py-0.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: COLORS.orange }} />
                          <span style={{ color: "var(--text-muted)" }}>Supply:</span>
                          <span className="font-medium tabular-nums" style={{ color: COLORS.orange }}>
                            {(point.btc_supply / 1000000).toFixed(2)}M BTC
                          </span>
                        </div>
                        <div className="flex items-center gap-2 py-0.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: COLORS.muted }} />
                          <span style={{ color: "var(--text-muted)" }}>Minado:</span>
                          <span className="font-medium tabular-nums" style={{ color: "var(--text-primary)" }}>
                            {point.btc_pct_mined.toFixed(1)}%
                          </span>
                        </div>
                        {point.btc_price_usd > 0 && (
                          <div className="flex items-center gap-2 py-0.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: COLORS.amber }} />
                            <span style={{ color: "var(--text-muted)" }}>Precio:</span>
                            <span className="font-medium tabular-nums" style={{ color: COLORS.amber }}>
                              ${point.btc_price_usd.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                <Area type="monotone" dataKey="btc_supply" name="BTC Supply" stroke={COLORS.orange} fill="url(#gradBTCSupply)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>

        {/* Closing message */}
        <div className="mt-10 mb-10 sm:mt-16 sm:mb-16 fade-in-up text-center">
          <div className="divider-gradient mb-6 sm:mb-8" />
          <p
            className="font-serif text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            La escasez no se imprime.{" "}
            <span className="glow-blue" style={{ color: "var(--accent-blue)" }}>
              Se defiende.
            </span>
          </p>
          <div className="divider-gradient mt-6 sm:mt-8" />
        </div>

        {/* Sources */}
        <div className="mt-10 sm:mt-16 fade-in-up">
          <div className="divider-gradient mb-8" />
          <h3
            className="font-serif text-lg tracking-wide mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Fuentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <div>
              <p className="uppercase tracking-widest mb-2" style={{ color: "var(--text-secondary)", fontSize: "10px" }}>
                Oro
              </p>
              <ul className="space-y-1">
                <li>
                  <a href="https://www.gold.org/goldhub/data/gold-prices" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--accent-blue)" }}>World Gold Council</a> &mdash; Stock sobre tierra, producci&oacute;n anual, precio del oro
                </li>
              </ul>

              <p className="uppercase tracking-widest mb-2 mt-6" style={{ color: "var(--text-secondary)", fontSize: "10px" }}>
                Bitcoin
              </p>
              <ul className="space-y-1">
                <li>
                  <a href="https://coinmarketcap.com/currencies/bitcoin/" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--accent-blue)" }}>CoinMarketCap</a> &mdash; Supply, precio, capitalizaci&oacute;n
                </li>
                <li>
                  <a href="https://blockchain.com/explorer" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--accent-blue)" }}>Blockchain.com</a> &mdash; Supply exacto on-chain
                </li>
              </ul>

              <p className="uppercase tracking-widest mb-2 mt-6" style={{ color: "var(--text-secondary)", fontSize: "10px" }}>
                Acciones
              </p>
              <ul className="space-y-1">
                <li>
                  <a href="https://data.worldbank.org/indicator/CM.MKT.LCAP.CD" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--accent-blue)" }}>World Bank</a> &mdash; Capitalizaci&oacute;n burs&aacute;til global
                </li>
                <li>
                  <a href="https://www.world-exchanges.org/" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--accent-blue)" }}>WFE</a> &mdash; Acciones outstanding, empresas listadas
                </li>
              </ul>
            </div>

            <div>
              <p className="uppercase tracking-widest mb-2" style={{ color: "var(--text-secondary)", fontSize: "10px" }}>
                Inmuebles
              </p>
              <ul className="space-y-1">
                <li>
                  <a href="https://www.savills.com/impacts/market-trends/the-total-value-of-global-real-estate.html" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--accent-blue)" }}>Savills</a> &mdash; Valor total del mercado inmobiliario global
                </li>
                <li>
                  <a href="https://unhabitat.org/" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--accent-blue)" }}>UN-Habitat</a> &mdash; Unidades de vivienda globales
                </li>
              </ul>

              <p className="uppercase tracking-widest mb-2 mt-6" style={{ color: "var(--text-secondary)", fontSize: "10px" }}>
                Bonos
              </p>
              <ul className="space-y-1">
                <li>
                  <a href="https://www.bis.org/statistics/secstats.htm" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--accent-blue)" }}>BIS</a> &mdash; Estad&iacute;sticas de deuda internacional
                </li>
                <li>
                  <a href="https://www.sifma.org/resources/research/fact-book/" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--accent-blue)" }}>SIFMA</a> &mdash; Mercados globales de renta fija
                </li>
              </ul>

              <p className="uppercase tracking-widest mb-2 mt-6" style={{ color: "var(--text-secondary)", fontSize: "10px" }}>
                Metodolog&iacute;a
              </p>
              <p>
                Datos hist&oacute;ricos pre-1970 interpolados con crecimiento exponencial entre
                puntos ancla verificados. &Iacute;ndice numerador: ponderado por market cap relativo
                de cada clase de activo, base 100&nbsp;=&nbsp;1913. Stock-to-flow calculado como
                stock&nbsp;/&nbsp;producci&oacute;n anual.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small legend component */
function ChartLegend({
  items,
}: {
  items: { color: string; label: string; dashed?: boolean }[];
}) {
  return (
    <div className="flex flex-wrap gap-4 mt-4 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          {item.dashed ? (
            <div
              className="w-4 h-0"
              style={{
                borderTop: `2px dashed ${item.color}`,
              }}
            />
          ) : (
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: item.color }}
            />
          )}
          <span className="text-[10px] tracking-wider" style={{ color: "var(--text-muted)" }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
