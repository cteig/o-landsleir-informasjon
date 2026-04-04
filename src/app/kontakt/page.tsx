export default function KontaktPage() {
  return (
    <div className="bg-background flex flex-1 flex-col items-center font-sans">
      <main className="w-full max-w-2xl px-5 py-12 sm:px-6 sm:py-20">
        <header className="mb-10 text-center">
          <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">Kontakt</h1>
          <p className="text-muted mt-2 text-base sm:text-lg">Kontaktinformasjon</p>
        </header>

        <div className="flex flex-col gap-8">
          <section className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm sm:p-6 dark:border-red-900 dark:bg-red-950">
            <h2 className="text-foreground mb-4 text-lg font-semibold">Nødnummer</h2>
            <div className="flex flex-col gap-3">
              <a
                href="tel:113"
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-red-900/30"
              >
                <div>
                  <p className="text-foreground text-sm font-semibold">Ambulanse</p>
                  <p className="text-muted text-xs">Medisinsk nødhjelp</p>
                </div>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">113</span>
              </a>
              <a
                href="tel:110"
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-red-900/30"
              >
                <div>
                  <p className="text-foreground text-sm font-semibold">Brann</p>
                  <p className="text-muted text-xs">Brannvesenet</p>
                </div>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">110</span>
              </a>
              <a
                href="tel:112"
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-red-900/30"
              >
                <div>
                  <p className="text-foreground text-sm font-semibold">Politi</p>
                  <p className="text-muted text-xs">Politiet</p>
                </div>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">112</span>
              </a>
              <a
                href="tel:116117"
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-red-900/30"
              >
                <div>
                  <p className="text-foreground text-sm font-semibold">Legevakt</p>
                  <p className="text-muted text-xs">Akutt, men ikke livstruende</p>
                </div>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">116 117</span>
              </a>
            </div>
          </section>

          <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
            <h2 className="text-foreground mb-4 text-lg font-semibold">Hovedkomite HL 2026</h2>
            <ul className="flex flex-col gap-4">
              <li className="border-border border-b pb-4 last:border-0 last:pb-0">
                <p className="text-foreground text-sm font-medium">Rune Scheele</p>
                <p className="text-muted text-xs">Leder hovedkomite</p>
                <a
                  href="tel:+4795120231"
                  className="text-accent mt-1 block text-sm hover:underline"
                >
                  951 20 231
                </a>
              </li>
              <li className="border-border border-b pb-4 last:border-0 last:pb-0">
                <p className="text-foreground text-sm font-medium">Knut Aalde</p>
                <p className="text-muted text-xs">Nestleder</p>
                <a
                  href="tel:+4790204918"
                  className="text-accent mt-1 block text-sm hover:underline"
                >
                  902 04 918
                </a>
              </li>
              <li className="border-border border-b pb-4 last:border-0 last:pb-0">
                <p className="text-foreground text-sm font-medium">Christine Teig</p>
                <p className="text-muted text-xs">O-landsleir</p>
                <a
                  href="tel:+4791389950"
                  className="text-accent mt-1 block text-sm hover:underline"
                >
                  913 89 950
                </a>
              </li>
              <li className="border-border border-b pb-4 last:border-0 last:pb-0">
                <p className="text-foreground text-sm font-medium">Esten Koren</p>
                <p className="text-muted text-xs">Løpsleder</p>
                <a
                  href="tel:+4748171882"
                  className="text-accent mt-1 block text-sm hover:underline"
                >
                  481 71 882
                </a>
              </li>
              <li className="border-border border-b pb-4 last:border-0 last:pb-0">
                <p className="text-foreground text-sm font-medium">Anne M. H. Nordberg</p>
                <p className="text-muted text-xs">Sponsor / økonomi</p>
                <a
                  href="tel:+4741905556"
                  className="text-accent mt-1 block text-sm hover:underline"
                >
                  419 05 556
                </a>
              </li>
              <li className="border-border border-b pb-4 last:border-0 last:pb-0">
                <p className="text-foreground text-sm font-medium">Knut Landstad</p>
                <p className="text-muted text-xs">Informasjon</p>
                <a
                  href="tel:+4791138238"
                  className="text-accent mt-1 block text-sm hover:underline"
                >
                  911 38 238
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
