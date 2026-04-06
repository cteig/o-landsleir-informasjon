# O-landsleir informasjon

Informasjonsapp for O-landsleiren med Hovedløp 2026 (30. juli – 5. august). Viser dagsprogram, praktisk info, kart, kontaktinformasjon og støtter push-varsler.

## Kom i gang

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Tester

```bash
npm test
```

## Kjør med Docker lokalt

```bash
docker compose up --build
```

Appen blir tilgjengelig på [http://localhost:3000](http://localhost:3000). Push-varsler krever at VAPID-nøkler er satt som miljøvariabler (se under).

## Deploy

Appen kjører på [Dokku](https://dokku.com) hostet på [UpCloud](https://upcloud.com).

```bash
git push dokku main
```

### Miljøvariabler

Disse må være satt på serveren (`dokku config:set o-landsleir ...`):

| Variabel            | Beskrivelse                   |
| ------------------- | ----------------------------- |
| `VAPID_PUBLIC_KEY`  | VAPID-nøkkel for push-varsler |
| `VAPID_PRIVATE_KEY` | Privat VAPID-nøkkel           |

### Persistent data

Appen lagrer push-abonnementer og meldinger i `/app/data`. Denne mappen er mountet til serveren slik at data overlever deploys:

```bash
dokku storage:mount o-landsleir /var/lib/dokku/data/storage/o-landsleir:/app/data
```

### Feilsøking

```bash
dokku logs o-landsleir -t     # Logger (live)
dokku ps:report o-landsleir   # App-status
dokku config:show o-landsleir # Sjekk env-variabler
```
