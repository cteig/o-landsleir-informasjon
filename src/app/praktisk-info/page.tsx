const links = [
  {
    title: "Detaljert program",
    href: "https://eventor.orientering.no/Documents/Event/45995/9/Detaljert-program",
  },
  {
    title: "Pakkeliste",
    href: "https://eventor.orientering.no/Documents/Event/46788/3/Pakkeliste",
  },
  {
    title: "Treningsgrupper",
    href: "https://eventor.orientering.no/Documents/Event/46888/5/Treningsgrupper",
  },
  {
    title: "Ordensregler under Hovedløpet og O-landsleiren",
    href: "https://eventor.orientering.no/Documents/Event/46769/1/Ordensregler-under-Hovedl-pet-og-O-landsleiren",
  },
  {
    title: "Brann og evakuering",
    href: "https://eventor.orientering.no/Documents/Event/46847/1/Brann-og-evakuering",
  },
  {
    title: "Prosedyre ved uønsket hendelse",
    href: "https://eventor.orientering.no/Documents/Event/46770/1/Prosedyre-ved-u-nsket-hendelse",
  },
];

export default function PraktiskInfoPage() {
  return (
    <div className="bg-background flex flex-1 flex-col items-center font-sans">
      <main className="w-full max-w-2xl px-5 py-12 sm:px-6 sm:py-20">
        <header className="mb-10 text-center">
          <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Praktisk info
          </h1>
          <p className="text-muted mt-2 text-base sm:text-lg">Alt du trenger å vite</p>
        </header>

        <ul className="flex flex-col gap-3">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border bg-card hover:border-border-hover flex min-h-[44px] items-center justify-between gap-3 rounded-2xl border px-5 py-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
              >
                <span className="text-foreground text-sm font-medium sm:text-base">
                  {link.title}
                </span>
                <span className="text-muted shrink-0 text-sm" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
