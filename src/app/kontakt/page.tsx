export default function KontaktPage() {
  return (
    <div className="bg-background flex flex-1 flex-col items-center font-sans">
      <main className="w-full max-w-2xl px-5 py-12 sm:px-6 sm:py-20">
        <header className="mb-10 text-center">
          <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">Kontakt</h1>
          <p className="text-muted mt-2 text-base sm:text-lg">Kontaktinformasjon</p>
        </header>

        <div className="flex flex-col gap-8">
          <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
            <h2 className="text-foreground mb-4 text-lg font-semibold">Kontakt</h2>
            <div className="text-foreground flex flex-col gap-2 text-sm">
              <p>
                Nydalens Skiklub
                <br />
                Postboks 32 Nydalen, 0409 Oslo, Norge
              </p>
              <div className="mt-2 flex flex-col gap-1">
                <a href="mailto:nsk@nydalen.idrett.no" className="text-accent hover:underline">
                  nsk@nydalen.idrett.no
                </a>
                <span className="text-muted text-xs">Postmottak</span>
              </div>
              <div className="flex flex-col gap-1">
                <a href="mailto:leder@nydalen.idrett.no" className="text-accent hover:underline">
                  leder@nydalen.idrett.no
                </a>
                <span className="text-muted text-xs">Leder</span>
              </div>
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
                <p className="text-muted text-xs">Lopsleder</p>
                <a
                  href="tel:+4748171882"
                  className="text-accent mt-1 block text-sm hover:underline"
                >
                  481 71 882
                </a>
              </li>
              <li className="border-border border-b pb-4 last:border-0 last:pb-0">
                <p className="text-foreground text-sm font-medium">Anne M. H. Nordberg</p>
                <p className="text-muted text-xs">Sponsor / okonomi</p>
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
                <div className="mt-1 flex flex-col gap-1">
                  <a href="tel:+4791138238" className="text-accent text-sm hover:underline">
                    911 38 238
                  </a>
                  <a
                    href="mailto:landstad@gmail.com"
                    className="text-accent text-sm hover:underline"
                  >
                    landstad@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
