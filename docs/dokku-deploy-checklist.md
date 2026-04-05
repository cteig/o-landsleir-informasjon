# Dokku deploy-sjekkliste for O-landsleir

Dette er en konkret sjekkliste for å deploye appen i dette repoet til Dokku på UpCloud.

Appen er allerede nesten klar for Dokku fordi repoet har:

- en fungerende `Dockerfile`
- Next.js standalone-build
- `EXPOSE 3000`
- persistent data i `data/` som kan mountes til `/app/data`

### Viktig om Docker og Dokku-host

Feilen vi støtte på under deploy viste seg å være et **server-/nettverksproblem**, ikke et varig problem i appens Dockerfile.

Det viktigste funnet var:

- hosten hadde nett
- Docker-containerne manglet fungerende DNS / egress
- `npm ci` feilet derfor sekundært med `EAI_AGAIN` / `Exit handler never called!`

Kort sagt: hvis Dokku-bygg feiler under `npm ci`, bør du først feilsøke **Docker/DNS/firewall på serveren** før du endrer appens Dockerfile.

---

## Før du starter

Du trenger:

- server-IP eller hostname til Dokku-serveren
- domenet du vil bruke
- VAPID-nøklene dine
- SSH-tilgang til serveren
- git-tilgang til dette repoet lokalt

Plassholdere brukt under:

- `DIN_SERVER_IP`
- `DITT_DOMENE`
- `DIN_EPOST`
- `DIN_PUBLIC_KEY`
- `DIN_PRIVATE_KEY`

---

## 1. Sett opp appen på Dokku-serveren

Kjør dette på serveren:

```bash
dokku apps:create o-landsleir
dokku domains:set o-landsleir DITT_DOMENE
dokku config:set o-landsleir \
  VAPID_PUBLIC_KEY=DIN_PUBLIC_KEY \
  VAPID_PRIVATE_KEY=DIN_PRIVATE_KEY \
  NEXT_PUBLIC_VAPID_PUBLIC_KEY=DIN_PUBLIC_KEY
dokku storage:ensure-directory o-landsleir
dokku storage:mount o-landsleir /var/lib/dokku/data/storage/o-landsleir:/app/data
dokku ports:set o-landsleir http:80:3000 https:443:3000
```

### Hvorfor dette er nødvendig

- `domains:set` kobler appen til domenet ditt
- `config:set` setter env-variablene appen trenger for push-varsler
- `storage:mount` gjør at innholdet i `data/` overlever deploys
- `ports:set` forteller Dokku at containeren lytter på port `3000`

---

## 2. Sett opp DNS

Hos DNS-leverandøren din, legg inn:

- `A` record: `DITT_DOMENE` → `DIN_SERVER_IP`

Hvis du også vil ha `www`:

- `A` record: `www.DITT_DOMENE` → `DIN_SERVER_IP`

Vent til DNS faktisk peker riktig før du setter opp HTTPS.

---

## 3. Sett opp HTTPS med Let's Encrypt

Kjør dette på serveren:

```bash
dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
dokku letsencrypt:set o-landsleir email DIN_EPOST
dokku letsencrypt:enable o-landsleir
dokku letsencrypt:cron-job --add
```

Dette gir deg automatisk sertifikat og automatisk fornyelse.

---

## 4. Deploy fra denne maskinen

Stå i dette repoet lokalt og kjør:

```bash
git remote add dokku dokku@DIN_SERVER_IP:o-landsleir
git push dokku main
```

Hvis du allerede har en `dokku`-remote:

```bash
git remote set-url dokku dokku@DIN_SERVER_IP:o-landsleir
git push dokku main
```

Dokku vil da:

1. oppdage `Dockerfile`
2. bygge imaget
3. starte appen
4. koble appen til Nginx-proxyen

---

## 5. Verifiser at deployen fungerer

Kjør på serveren:

```bash
dokku ps:report o-landsleir
dokku logs o-landsleir -t
dokku config:show o-landsleir
dokku storage:list o-landsleir
```

Sjekk deretter i nettleseren at:

- forsiden laster
- programmet vises
- push-varsler kan aktiveres
- appen kjører på `https://DITT_DOMENE`

---

## 6. Viktig for akkurat denne appen

Denne appen lagrer data lokalt på disk i `data/`.

Det gjelder blant annet:

- `data/push-subscriptions.json`
- `data/push-messages.json`

Derfor er denne mounten kritisk:

```bash
dokku storage:mount o-landsleir /var/lib/dokku/data/storage/o-landsleir:/app/data
```

Uten den mister du lagrede subscriptions og meldinger ved hver deploy.

---

## 7. Feilsøking hvis noe ikke virker

### Appen starter ikke

```bash
dokku logs o-landsleir -t
```

### Domenet virker ikke

Sjekk at DNS peker til riktig IP.

### HTTPS virker ikke

Sjekk at:

- domenet peker riktig
- port 80 og 443 er åpne
- `dokku letsencrypt:enable o-landsleir` fullførte uten feil

### Push-varsler virker ikke

Sjekk at disse env-variablene er satt:

```bash
dokku config:show o-landsleir
```

Du må ha:

- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`

---

## 8. Kort oppsummert

Minimal rekkefølge:

1. opprett app i Dokku
2. sett domain
3. sett env-variabler
4. mount `/app/data`
5. sett portmapping
6. sett opp DNS
7. aktiver Let's Encrypt
8. `git push dokku main`
