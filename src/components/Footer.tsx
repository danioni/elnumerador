"use client";

const ECOSYSTEM_LINKS = [
  { label: "El Denominador", href: "https://eldenominador.com", desc: "El dinero que se encoge" },
  { label: "El Numerador", href: "https://elnumerador.com", desc: "Los activos que protegen", current: true },
  { label: "Los Ratios", href: "https://losratios.com", desc: "Cómo medir en términos reales" },
];

export default function Footer() {
  return (
    <footer className="relative mt-16">
      <div className="h-[1px]" style={{ background: "linear-gradient(90deg, transparent, var(--accent-border) 50%, transparent)" }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="text-center">
          <p className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase" style={{ color: "var(--text-muted)" }}>
            Todo precio es una fracción: Numerador &divide; Denominador
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-3">
          {ECOSYSTEM_LINKS.map((link) => (
            <div key={link.label} className="flex items-center gap-2">
              <a
                href={link.href}
                target={link.current ? undefined : "_blank"}
                rel={link.current ? undefined : "noopener noreferrer"}
                className="text-[10px] sm:text-[11px] tracking-wider uppercase font-medium transition-opacity hover:opacity-80"
                style={{ color: link.current ? "var(--accent)" : "var(--text-secondary)" }}
              >
                {link.label}
              </a>
              <span className="text-[9px] hidden sm:inline" style={{ color: "var(--text-muted)" }}>
                {link.desc}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <span className="text-[10px] tracking-wider" style={{ color: "var(--text-muted)" }}>
            Parte del ecosistema eldenominador · elnumerador · losratios
          </span>
          <span className="text-[9px] tabular-nums" style={{ color: "var(--text-muted)" }}>
            {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
