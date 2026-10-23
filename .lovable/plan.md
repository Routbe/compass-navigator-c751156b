# Sleutels vervangen eerst, daarna de openstaande punten

## Fase 0 — Beveiligingsaudit (klaar, alleen lezen)

### Hardcoded geheimen
Scan van `src/`, `scripts/`, `db/`, `docs/`, `supabase/` op Stripe-, Brevo-, GitHub- en webhook-sleutels, JWT's en database-URL's met wachtwoord: **geen echte geheimen gevonden.** De enige treffers zijn neppe testwaarden (in `tip-rules.test.ts`, `brevo-key.test.ts`, `auth-database-transport.test.ts`) en `<placeholder>`-voorbeelden op `/self-hosting`. Er is dus geen script nodig om iets te vervangen.

### Checklist: intrekken en opnieuw aanmaken bij de dienst zelf
1. **Neon**: wachtwoorden van de rollen `rout_app` en owner resetten, en daarna `DATABASE_URL` en `MIGRATION_URL` aanpassen.
2. **Stripe**: nieuwe restricted key (`rk_...`) aanmaken als `STRIPE_SECRET_KEY` en de oude key intrekken. Daarna het webhook-geheim vernieuwen (`STRIPE_WEBHOOK_SECRET`). `STRIPE_PUBLISHABLE_KEY` is openbaar.
3. **Brevo**: `BREVO_API_KEY` vervangen. Controleer ook de SMTP-sleutel en de afzenders.
4. **Inloggen via OAuth**: client secrets van Google, Apple, GitHub, GitLab, Infomaniak, Proton, Snapchat, OIDC, W-identity en bunq opnieuw aanmaken, plus `ROUT_CLIENT_SECRET` en `ROUT_API_KEY`.
5. **Bestanden**: S3 (`S3_ACCESS_KEY_ID` en `S3_SECRET_ACCESS_KEY`) en Scaleway (access key en secret key).
6. **Betalen en identiteit**: bunq (API key, private key, OAuth), Didit (API key en webhook-geheim), banking-webhook-geheimen, `PSP_ENCRYPTION_KEY`. Let op: data die met de oude `PSP_ENCRYPTION_KEY` versleuteld is, moet je eerst opnieuw versleutelen.
7. **Overige tokens**: `TELEGRAM_BOT_TOKEN` (via BotFather /revoke), `GITHUB_TOKEN`, `IMPROVMX_API_KEY`, `KCHAT_WEBHOOK_URL`, plus de tokens van Vercel en GitHub zelf.
8. **Eigen willekeurige geheimen** (overal nieuwe waarden van 32+ tekens):
   - `BETTER_AUTH_SECRET`, `APP_SESSION_SECRET`, `SESSION_SECRET`, `NEON_AUTH_COOKIE_SECRET`
   - `OAUTH_STATE_SECRET`, `MASTODON_STATE_SECRET`, `BOOKING_TOKEN_SECRET`, `GO_LINK_SECRET`
   - `ALTCHA_HMAC_KEY`, `ADMIN_BOOTSTRAP_TOKEN`, `LOVABLE_CRON_SECRET`, `CRON_SECRET`
   - Let op: als je `CONTACT_HASH_SALT` of `IDENTITY_HASH_PEPPER` verandert, kloppen bestaande opgeslagen hashes niet meer.
9. **Signing keys** van de eigen OIDC-provider (JWKS): nieuwe sleutel aanmaken en de oude intrekken.

### Bestaande inlogsessies
Een nieuwe `BETTER_AUTH_SECRET` maakt ondertekende cookies ongeldig, maar **is niet genoeg**. Sessies staan ook in de tabel `neon_auth.session`, en de eigen `rout_session`-cookie gebruikt `APP_SESSION_SECRET`. Als die ontbreekt, valt de code terug op `NEON_AUTH_COOKIE_SECRET` of zelfs op `DATABASE_URL`. Daarom:
- alle drie de geheimen vervangen;
- in de database alle sessierijen verwijderen, plus uitgegeven OAuth-tokens en refresh-tokens;
- de terugval op `DATABASE_URL` uit `app-session.server.ts` halen (codewijziging in fase 1).

**Hier stop ik tot jij bevestigt dat alle sleutels vervangen zijn.**

## Fase 1 — Na jouw bevestiging: inlogveiligheid en "Inloggen met ROUT"
- De sessieterugval op `DATABASE_URL` verwijderen en een eenmalig script toevoegen dat alle sessies en tokens wist.
- Fout: een app blijft in testmodus staan. De status komt voortaan altijd vers uit de database en wordt niet meer gecachet in het toestemmingsscherm.
- Fout: melding over meerdere redirect-URL's. De opgegeven redirect moet exact overeenkomen met één van de geregistreerde URL's.
- Accountkeuze: gekoppelde accounts (Google, e-mail, ...) zijn standaard aangevinkt, en je kunt ze uitvinken om een nieuw ROUT-account te maken.
- Een officiële "Connect ROUT"-knop met het juiste logo, een eigen component en vaste regels voor de AI-prompt.

## Fase 2 — Studio-weergave
- De tabbalk wordt weer een rustige segmented control.
- Eigen lijnicoontjes in plaats van emoji's bij alle genoemde secties (Subdomeinen, Bluesky, Statistieken, Avatar, Knoppen, Footer, Achtergrond, Lagen-studio, Live-status, Links, Favorieten, Geavanceerd, QR).
- Het instellingenicoon staat inline naast het label.
- De wisselknop voor pagina's verdwijnt als er maar één pagina actief is.
- Een wisselaar tussen profiel en steunpagina net onder de URL-balk.

## Fase 3 — Console en Workspaces
- Apps en sleutels werken in de persoonlijke scope en in een workspace (`workspace_id` mag leeg zijn).
- Een app overdragen naar een workspace. Dat mag alleen als je daar owner of admin bent, en de client-id blijft hetzelfde.
- Bij de onboarding kies je "Voor mezelf" of "Voor een bedrijf". Bij bedrijfsverificatie verschijnt een uitleg en er komen infopagina's.

## Fase 4 — Profiel en componenten
- Twee nieuwe componenten, Anonieme vragen en Gastenboek. Elk heeft een schakelaar die ook door de server wordt afgedwongen, en je kunt een vraag beantwoorden en vastpinnen als story.
- Badges klein naast de naam. De showcase-voorbeelden zien er precies uit als het echte profiel.

## Fase 5 — Beheer, domeinen en e-mail
- Beheerders kunnen handles beheren, gebruikers blokkeren voor nieuwe handles, verificaties intrekken en kiezen welke profielen "Net actief" en "Uitgelicht" tonen.
- Subdomeinen: `u.rout.be` (gratis) en `rout.be` (geverifieerd), met `r.rout.be` als noodoplossing en een e-mail zodra alles hersteld is.
- E-mails bij een nieuwe badge en bij een statuswijziging van een workspace-aanvraag.

## Technisch
- Elke fase houdt zich aan de regels in `AGENTS.md` en volgt de bestaande conventies.
- Er komen nieuwe idempotente `db/NN_*.sql`-migraties.
- Elke regel krijgt een test: scope-filter, rechten bij overdracht, componentschakelaar, redirect-match en testmodus.
- Na elke fase draaien `bunx vitest run` en `tsgo --noEmit`.
- De QR-editor blijft onaangeroerd. Externe afbeeldingen lopen alleen via de proxy.
