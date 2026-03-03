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
    name: "Cash / Bonos",
    icon: "\ud83d\udcb5",
    tier: "Nivel 1 \u2014 Es el denominador",
    description:
      "El efectivo ES la unidad que se diluye. Los bonos pagan intereses que rara vez superan la tasa de expansi\u00f3n. Ahorrar aqu\u00ed es diluirse al ritmo de la impresi\u00f3n.",
    supplyGrowth: "7-15% anual",
    example:
      "$100,000 ahorrados en 2000 compran hoy lo que $45,000 compraban entonces. No perdiste dinero \u2014 el denominador te lo quit\u00f3.",
  },
  {
    name: "Acciones",
    icon: "\ud83d\udcc8",
    tier: "Nivel 2 \u2014 Elasticidad alta",
    description:
      "IPOs, secundarias, stock options \u2014 la oferta total de equity crece. Las recompras compensan parcialmente, pero la emisi\u00f3n neta global es positiva.",
    supplyGrowth: "~3-5% anual",
    example:
      "El S&P 500 subi\u00f3 ~750x desde 1913. El denominador subi\u00f3 ~3,400x. Pero la oferta de acciones tambi\u00e9n se expandi\u00f3. Resultado neto: perdi\u00f3 contra la impresora.",
  },
  {
    name: "Inmuebles",
    icon: "\ud83c\udfe0",
    tier: "Nivel 3 \u2014 Elasticidad moderada",
    description:
      "El suelo es finito, pero la construcci\u00f3n no. Cuando los precios suben, los desarrolladores construyen m\u00e1s. La oferta responde al precio \u2014 eso es elasticidad.",
    supplyGrowth: "~2-3% anual",
    example:
      "Donde la regulaci\u00f3n restringe la oferta (Manhattan, Londres), los inmuebles capturan la expansi\u00f3n monetaria. Donde no, la construcci\u00f3n diluye las ganancias.",
  },
  {
    name: "Oro",
    icon: "Au",
    tier: "Nivel 4 \u2014 Elasticidad baja",
    description:
      "La geolog\u00eda limita la extracci\u00f3n, pero no la elimina. Cuando el precio sube, la miner\u00eda se expande. Stock-to-flow alto (~60 a\u00f1os), pero no infinito.",
    supplyGrowth: "~1.5% anual",
    example:
      "5,000 a\u00f1os de historia monetaria. Multiplic\u00f3 10x desde 2000 vs. un denominador que multiplic\u00f3 7x. La baja elasticidad de oferta explica la diferencia.",
  },
  {
    name: "Bitcoin",
    icon: "\u20bf",
    tier: "Nivel 5 \u2014 Elasticidad cero",
    description:
      "21 millones de unidades \u2014 no por decisi\u00f3n de un comit\u00e9, sino por funci\u00f3n matem\u00e1tica. La emisi\u00f3n se reduce a la mitad cada ~4 a\u00f1os hasta converger a cero. El \u00fanico activo cuyo numerador es matem\u00e1ticamente fijo.",
    supplyGrowth: "0%",
    example:
      "Cuando el oro sube, la miner\u00eda se expande. Cuando los inmuebles suben, la construcci\u00f3n se acelera. Cuando las acciones suben, las empresas emiten m\u00e1s. Bitcoin elimin\u00f3 ese mecanismo: ning\u00fan aumento de precio puede crear una sola unidad adicional.",
    highlight: true,
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
                Supply fijo
              </span>
            )}
          </div>
          <p className="text-[10px] tracking-wider uppercase mb-1" style={{ color: "var(--text-muted)" }}>
            {asset.tier}
          </p>
          {/* Supply growth rate — PRIMARY metric */}
          <div className="mb-3">
            <span
              className="font-serif text-lg sm:text-xl tabular-nums"
              style={{ color: asset.name === "Cash / Bonos" ? "var(--accent-red)" : "var(--accent)" }}
            >
              {asset.supplyGrowth}
            </span>
            <span className="text-[10px] tracking-wider uppercase ml-2" style={{ color: "var(--text-muted)" }}>
              expansi&oacute;n de oferta
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {asset.description}
          </p>
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
          El dinero se diluye.
          <br />
          <span className="glow-accent" style={{ color: "var(--accent)" }}>
            Tus activos tambi&eacute;n.
          </span>
        </p>
        <p
          className="mt-3 sm:mt-4 text-xs sm:text-sm max-w-2xl leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Todo precio es una fracci&oacute;n: activo &divide; moneda. Que la
          moneda se expanda es el problema visible &mdash; el denominador. Pero
          hay un segundo problema que casi nadie mide: la oferta de los activos
          tambi&eacute;n crece. Bonos se emiten al ritmo de la impresora.
          Acciones, 3-5% anual. Inmuebles, 2-3%. Oro, 1.5%. Cuando ambos lados
          de la fracci&oacute;n se expanden, el precio sube pero el poder
          adquisitivo no se mueve. La variable que separa protecci&oacute;n real
          de ilusi&oacute;n nominal tiene nombre: elasticidad de oferta.
        </p>
        <div className="divider-gradient mt-6 sm:mt-8" />
      </div>

      {/* Asset hierarchy */}
      <div className="mb-10 sm:mb-14">
        <h2 className="font-serif text-xl sm:text-2xl mb-2" style={{ color: "var(--text-primary)" }}>
          La jerarqu&iacute;a de la elasticidad
        </h2>
        <p className="text-xs sm:text-sm mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Cada activo tiene una tasa a la que se crean nuevas
          unidades &mdash; su elasticidad de oferta. No el precio, no el
          rendimiento hist&oacute;rico: esa tasa es lo que determina si un
          activo absorbe la diluci&oacute;n del denominador o simplemente la
          acompa&ntilde;a. Cuanto menor la elasticidad, mayor la
          proporci&oacute;n de expansi&oacute;n monetaria que el activo captura
          en vez de disipar.
        </p>
        <div className="space-y-3 sm:space-y-4">
          {ASSET_TIERS.map((asset, i) => (
            <AssetCard key={asset.name} asset={asset} index={i} />
          ))}
        </div>
      </div>

      {/* Why supply elasticity zero matters */}
      <div className="mb-10 sm:mb-14 fade-in-up">
        <div className="card-glass card-accent-left rounded-xl p-6 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl mb-4" style={{ color: "var(--text-primary)" }}>
            El caso l&iacute;mite: elasticidad cero
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {[
              { title: "Oferta inel\u00e1stica", desc: "Cuando el precio sube, no se produce m\u00e1s Bitcoin. En cualquier otro activo, el alza incentiva producci\u00f3n y diluye a los tenedores existentes." },
              { title: "Schedule predeterminado", desc: "La emisi\u00f3n sigue una funci\u00f3n matem\u00e1tica: se reduce a la mitad cada 210,000 bloques (~4 a\u00f1os). No hay comit\u00e9 que vote cambiar la tasa." },
              { title: "Auditable en tiempo real", desc: "Cualquiera verifica la oferta total en cualquier momento. No depende de estimaciones geol\u00f3gicas, reportes corporativos ni estad\u00edsticas gubernamentales." },
              { title: "Sin emisor", desc: "No existe un agente que pueda crear m\u00e1s unidades para financiarse. La oferta no responde a incentivos econ\u00f3micos ni a presiones pol\u00edticas." },
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
              <span className="font-medium" style={{ color: "var(--accent)" }}>El mecanismo: </span>
              el oro sube &rarr; la miner&iacute;a se expande. Los inmuebles
              suben &rarr; la construcci&oacute;n se acelera. Las acciones
              suben &rarr; las empresas emiten m&aacute;s. Todo activo con
              elasticidad de oferta &gt; 0 tiene un mecanismo que diluye a sus
              tenedores cuando el precio sube. Bitcoin elimin&oacute; ese
              mecanismo. Su oferta es una funci&oacute;n del tiempo, no del precio.
            </p>
          </div>
        </div>
      </div>

      {/* Central insight — double illusion */}
      <div className="mb-10 sm:mb-14 fade-in-up">
        <div className="card-glass rounded-xl p-6 sm:p-8 text-center">
          <p className="font-serif text-lg sm:text-xl mb-3" style={{ color: "var(--text-primary)" }}>
            La doble ilusi&oacute;n
          </p>
          <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Si el denominador se expande y la oferta del numerador
            tambi&eacute;n crece, el precio sube &mdash; pero el valor real no
            se mueve. Es medir con una regla que se encoge algo que se estira.
            Dos distorsiones opuestas, una sola cifra nominal que las esconde.
            La pregunta correcta no es &ldquo;&iquest;cu&aacute;nto
            subi&oacute; mi activo?&rdquo; sino &ldquo;&iquest;cu&aacute;nto
            creci&oacute; su oferta?&rdquo;
          </p>
        </div>
      </div>

      {/* CTA to Los Ratios */}
      <div className="mt-12 sm:mt-16 text-center fade-in-up">
        <div className="card-glass rounded-xl p-8 sm:p-12 max-w-2xl mx-auto">
          <p className="font-serif text-lg sm:text-xl mb-3" style={{ color: "var(--text-primary)" }}>
            Dos ilusiones, una salida
          </p>
          <p className="text-xs sm:text-sm mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Si el denominador se encoge y la oferta del numerador crece, ninguno
            sirve como unidad de medida. El precio en pesos te enga&ntilde;a por
            abajo &mdash; la moneda se diluye. El rendimiento nominal te
            enga&ntilde;a por arriba &mdash; la oferta del activo
            creci&oacute;. La salida: medir un activo contra otro &mdash; un
            ratio que cancela ambas distorsiones. BTC/Oro, Casa/Salario,
            S&amp;P/M2 &mdash; cada ratio elimina la ilusi&oacute;n del
            denominador y la del numerador.
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
            Explora los ratios
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
