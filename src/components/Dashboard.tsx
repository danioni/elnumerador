"use client";

import { useState } from "react";

interface AssetTier {
  name: string;
  icon: string;
  tier: string;
  description: string;
  supplyGrowth: string;
  example: string;
  highlight?: boolean;
}

const ASSET_TIERS: AssetTier[] = [
  {
    name: "Bitcoin",
    icon: "\u20bf",
    tier: "Nivel 5 \u2014 Escasez absoluta",
    description: "21 millones de unidades. Nunca habr\u00e1 m\u00e1s. Sin banco central, sin emisi\u00f3n discrecional, verificable por cualquiera.",
    supplyGrowth: "0% despu\u00e9s de 2140",
    example: "1 BTC en 2015 = $300. Hoy = ~$97,000. No es que BTC subi\u00f3 \u2014 es que el denominador se achic\u00f3.",
    highlight: true,
  },
  {
    name: "Oro",
    icon: "Au",
    tier: "Nivel 4 \u2014 Escasez natural",
    description: "Miner\u00eda agrega ~1.5% anual al stock existente. 5,000 a\u00f1os de historia monetaria. No se puede imprimir.",
    supplyGrowth: "~1.5% anual",
    example: "El oro pas\u00f3 de $270/oz (2000) a $2,850/oz (2025). Multiplic\u00f3 10x vs un denominador que multiplic\u00f3 7x.",
  },
  {
    name: "Inmuebles",
    icon: "\ud83c\udfe0",
    tier: "Nivel 3 \u2014 Escasez local",
    description: "No se pueden imprimir, pero s\u00ed construir. El suelo es finito, las regulaciones limitan oferta en las mejores ubicaciones.",
    supplyGrowth: "~2-3% anual",
    example: "En las mejores ciudades, los inmuebles capturan la expansi\u00f3n monetaria. En las peores, no.",
  },
  {
    name: "Acciones",
    icon: "\ud83d\udcc8",
    tier: "Nivel 2 \u2014 Escasez productiva",
    description: "Las mejores empresas tienen pricing power: suben precios con la inflaci\u00f3n. Generan flujos que crecen con el denominador.",
    supplyGrowth: "Variable (recompras vs emisiones)",
    example: "El S&P 500 subi\u00f3 ~750x desde 1913. Impresionante, pero el denominador subi\u00f3 ~3,400x.",
  },
  {
    name: "Cash / Bonos",
    icon: "\ud83d\udcb5",
    tier: "Nivel 1 \u2014 Sin protecci\u00f3n",
    description: "El efectivo ES el denominador. Los bonos pagan intereses que rara vez superan la expansi\u00f3n real. Ahorrar en fiat es perder en c\u00e1mara lenta.",
    supplyGrowth: "7-15% anual (M2 global)",
    example: "$100,000 ahorrados en 2000 compran hoy lo que $45,000 compraban entonces.",
  },
];

function AssetCard({ asset, index }: { asset: AssetTier; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`card-glass rounded-xl p-5 sm:p-6 cursor-pointer fade-in-up fade-in-up-${Math.min(index + 1, 5)}`}
      onClick={() => setExpanded(!expanded)}
      style={asset.highlight ? { border: "1px solid var(--accent-border-active)" } : undefined}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0"
          style={{
            background: asset.highlight ? "var(--accent-bg-active)" : "var(--accent-bg)",
            border: `1px solid ${asset.highlight ? "var(--accent-border-active)" : "var(--accent-border)"}`,
          }}
        >
          {asset.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-serif text-base sm:text-lg" style={{ color: "var(--text-primary)" }}>
              {asset.name}
            </h3>
            {asset.highlight && (
              <span
                className="text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full"
                style={{ background: "var(--accent-bg-active)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
              >
                M&aacute;xima protecci&oacute;n
              </span>
            )}
          </div>
          <p className="text-[10px] tracking-wider uppercase mb-2" style={{ color: "var(--text-muted)" }}>
            {asset.tier}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {asset.description}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>
              Crecimiento de supply:
            </span>
            <span className="text-[10px] font-medium tabular-nums" style={{ color: asset.name === "Cash / Bonos" ? "var(--accent-red)" : "var(--accent)" }}>
              {asset.supplyGrowth}
            </span>
          </div>
          {expanded && (
            <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <p className="text-xs italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {asset.example}
              </p>
            </div>
          )}
        </div>
        <span className="text-xs shrink-0 mt-1" style={{ color: "var(--text-muted)" }}>
          {expanded ? "\u2212" : "+"}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
      {/* Hero */}
      <div className="mb-10 sm:mb-14 fade-in-up pt-4">
        <p
          className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.15] tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Construye el numerador
          <br />
          <span className="glow-accent" style={{ color: "var(--accent)" }}>
            que el sistema no puede tocar.
          </span>
        </p>
        <p
          className="mt-3 sm:mt-4 text-xs sm:text-sm max-w-2xl leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Si el denominador de cada precio &mdash; la moneda &mdash; se destruye por dise&ntilde;o,
          la &uacute;nica defensa es acumular activos en el numerador que no se puedan
          diluir. No es especulaci&oacute;n. Es protecci&oacute;n del poder adquisitivo frente
          a la expansi&oacute;n monetaria inevitable.
        </p>
        <div className="divider-gradient mt-6 sm:mt-8" />
      </div>

      {/* Asset hierarchy */}
      <div className="mb-10 sm:mb-14">
        <h2 className="font-serif text-xl sm:text-2xl mb-2" style={{ color: "var(--text-primary)" }}>
          &iquest;Qu&eacute; protege tu numerador?
        </h2>
        <p className="text-xs sm:text-sm mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          No todos los activos son iguales. La jerarqu&iacute;a depende de una variable: qu&eacute; tan dif&iacute;cil es crear m&aacute;s unidades. Mientras m&aacute;s escaso, mejor protege.
        </p>
        <div className="space-y-3 sm:space-y-4">
          {ASSET_TIERS.map((asset, i) => (
            <AssetCard key={asset.name} asset={asset} index={i} />
          ))}
        </div>
      </div>

      {/* Why Bitcoin */}
      <div className="mb-10 sm:mb-14 fade-in-up">
        <div className="card-glass card-accent-left rounded-xl p-6 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl mb-4" style={{ color: "var(--text-primary)" }}>
            Por qu&eacute; Bitcoin espec&iacute;ficamente
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {[
              { title: "Oferta fija", desc: "21 millones. No hay comit\u00e9, junta directiva ni banco central que pueda cambiar esta regla. Es matem\u00e1tica, no pol\u00edtica." },
              { title: "Verificable", desc: "Cualquiera puede auditar la oferta total en tiempo real. No necesitas confiar en nadie \u2014 solo en el c\u00f3digo abierto." },
              { title: "Sin banco central", desc: "No hay un emisor que pueda decidir imprimir m\u00e1s. Es el primer activo monetario verdaderamente descentralizado." },
              { title: "Portabilidad perfecta", desc: "Puedes mover miles de millones de d\u00f3lares en minutos, a cualquier parte del mundo, sin pedir permiso." },
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <h3 className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="divider-gradient mb-5" />
          <div className="card-glass rounded-lg p-4 sm:p-5">
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <span className="font-medium" style={{ color: "var(--accent)" }}>El contraste: </span>
              1 BTC en 2015 = $300. Hoy = ~$97,000. En el mismo per&iacute;odo, el M2 de EE.UU. pas&oacute; de $12.3T a $22.3T &mdash; el denominador casi se duplic&oacute;. El numerador (BTC) se multiplic&oacute; 320x. Esto no es rendimiento especulativo &mdash; es un activo escaso capturando la destrucci&oacute;n del denominador.
            </p>
          </div>
        </div>
      </div>

      {/* Central insight */}
      <div className="mb-10 sm:mb-14 fade-in-up">
        <div className="card-glass rounded-xl p-6 sm:p-8 text-center">
          <p className="font-serif text-lg sm:text-xl mb-3" style={{ color: "var(--text-primary)" }}>
            El insight central
          </p>
          <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            No necesitas &ldquo;ganarle al mercado.&rdquo; Solo necesitas que tu numerador crezca m&aacute;s r&aacute;pido que el denominador. Si ahorras en efectivo, pierdes. Si acumulas activos escasos, proteges. Es as&iacute; de simple.
          </p>
        </div>
      </div>

      {/* CTA to Los Ratios */}
      <div className="mt-12 sm:mt-16 text-center fade-in-up">
        <div className="card-glass rounded-xl p-8 sm:p-12 max-w-2xl mx-auto">
          <p className="font-serif text-lg sm:text-xl mb-3" style={{ color: "var(--text-primary)" }}>
            Ya entiendes el numerador. Ahora aprende a medirlo.
          </p>
          <p className="text-xs sm:text-sm mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Los ratios entre activos revelan qu&eacute; est&aacute; caro, qu&eacute; est&aacute; barato, y cu&aacute;ndo acumular. BTC/Oro, Casa/Salario, S&amp;P/M2 &mdash; cada ratio cuenta una historia.
          </p>
          <a
            href="https://losratios.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
            style={{
              background: "var(--accent-bg-active)",
              border: "1px solid var(--accent-border-active)",
              color: "var(--accent)",
            }}
          >
            Aprende a leer los ratios
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
