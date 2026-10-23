# Steunpagina vernieuwen + beheer via de profielknop

## 1. Wisselen tussen profiel- en steunpagina-beheer
- In de Studio staat bovenaan de knop "Geverifieerd profiel · rout.be/handle". Is de steunpagina actief, dan wordt die knop een schakelaar: nog eens klikken wisselt naar "Steunpagina · rout.be/handle/tip". Alle tabbladen (Inhoud, Ontwerp, ...) beheren dan de steunpagina; de voorbeeldweergave toont de steunpagina.
- Zet je de steunpagina voor het eerst op actief, dan start een korte rondleiding op het scherm (3–4 stapjes): waar de schakelaar zit, waar je betaalmethodes kiest, waar je foto's toevoegt, en hoe je terugwisselt. Eén keer per account, later opnieuw te starten.

## 2. Betaalmethodes kiezen (tab Inhoud)
De maker zet per methode aan of uit, en kiest de volgorde:
- **Overschrijving / QR-code** (IBAN, zoals nu) — altijd gratis, geen bedrijf nodig.
- **Stripe, direct op de pagina** — de bezoeker betaalt met kaart, Bancontact, Apple/Google Pay zonder de pagina te verlaten (ingebouwd betaalvenster in plaats van doorsturen). Het geld gaat rechtstreeks naar het Stripe-account van de maker; ROUT raakt geen geld aan.
- **Mollie** (bestaat al) blijft beschikbaar.
- **Externe links**: Buy Me a Coffee, Ko-fi, PayPal.me, bunq.me, Patreon, Liberapay — enkel gebruikersnaam of link invullen, met herkenbaar logo.

Over bunq: een volledig ingebouwde bunq-betaling per maker vraagt dat elke maker een eigen bunq-koppeling goedkeurt. Dat nemen we niet mee in deze stap; bunq.me-link werkt meteen.

## 3. Veiligheid van de Stripe-sleutels
Dit kan veilig, op deze voorwaarden (bestaande opslag wordt aangescherpt):
- Sleutels worden versleuteld bewaard (AES-256-GCM) met een hoofdsleutel die enkel op de server bestaat; nooit terug naar de browser, enkel "•••• 1234" zichtbaar.
- We vragen bij voorkeur een **beperkte sleutel** (rk_live) met enkel recht op betalingen aanmaken. Een volledige geheime sleutel krijgt een duidelijke waarschuwing.
- Bij opslaan controleren we de sleutel bij Stripe; ongeldige sleutels worden geweigerd.
- Betalingen worden op de server aangemaakt met het bedrag dat de server controleert (min/max), nooit wat de browser zegt.
- Ontsleutelen gebeurt enkel op het moment van een betaling, nooit in logs. Ontkoppelen wist de sleutel definitief.
- Bevestiging van een betaling gebeurt via Stripe zelf (webhook met eigen geheim per maker), zodat niemand een betaling kan vervalsen.

## 4. Foto's (max. 6)
- Tot **6 foto's** (nu 3). Elke upload wordt in de browser automatisch verkleind naar max. 2000 px en omgezet naar WebP van hoge kwaliteit — het verschil ziet niemand, het bestand is vaak 10x kleiner. Limiet per foto na verkleinen: 1,5 MB.
- Volgorde aanpassen en verwijderen.

## 5. Foto's van Bluesky of Mastodon
- Maker vult enkel gebruikersnaam in (bv. `naam.bsky.social` of `@naam@mastodon.social`). Openbare berichten met foto's worden opgehaald via de open API's.
- Twee keuzes: **"Toon altijd mijn nieuwste foto's"** (automatisch bijgewerkt, max. 6) of **"Enkel deze kiezen"** (raster met recente foto's, aanvinken).
- Foto's lopen via onze beveiligde afbeeldingsproxy, zodat bezoekers niet gevolgd worden door die servers. Enkel openbare berichten, geen gevoelige/gemarkeerde media.

## 6. Steunpagina zelf verbeterd
- Rustiger opbouw: foto-strook bovenaan, naam + bericht, bedragknoppen, daaronder de gekozen betaalmethodes in volgorde, externe links als nette knoppen.
- Dankjewel-scherm na een geslaagde betaling.
- De pagina rout.be/handle/donate verwijst naar dezelfde steunpagina.

## Technische details
- Migratie db/1xx: `tip_settings` uitbreiden met `methods jsonb` (aan/uit + volgorde), `external_links jsonb`, `social_source jsonb` ({network, handle, mode: latest|picked, picked_uris[]}); images-check van 3 naar 6. `psp_credentials` krijgt `webhook_secret_cipher`, `publishable_key`, `key_kind` (restricted|secret).
- Studio: `ProfileEditor` krijgt een `editTarget: 'profile' | 'tip'`-staat op de identiteitsknop; tour-status in `display_prefs.tours.tip`.
- Stripe: server functie maakt PaymentIntent met ontsleutelde makersleutel (`secretbox.server.ts`), Payment Element met makers publishable key in de browser. Webhook-route `/api/public/tip/stripe/$userId` verifieert handtekening met per-maker geheim.
- Beeldverkleining client-side via canvas → WebP (q≈0.85, max 2000 px), daarna bestaande upload.
- Bluesky: `app.bsky.feed.getAuthorFeed` (public AppView); Mastodon: `/api/v1/accounts/lookup` + `/statuses?only_media=true`; host via `isPublicHost`, beelden via `proxy-image` allowlist.
- Tests: max 6 foto's, bedrag-validatie server-side, sleutel nooit in respons, methode-volgorde opgeslagen.
