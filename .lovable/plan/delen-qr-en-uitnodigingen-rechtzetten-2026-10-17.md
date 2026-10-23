# Delen-QR en uitnodigingen rechtzetten

## 1. Delen toont jouw eigen QR-ontwerp
- Probleem: het Delen-menu tekent de code opnieuw met een vereenvoudigde stijl (alleen effen kleur + vorm). Jouw vulling (verloop/kleuren) gaat verloren, en er wordt automatisch een konijn in het midden gezet.
- Oplossing: het Delen-menu, het volledig-scherm-venster en de PNG/SVG-download gebruiken exact hetzelfde ontwerp en dezelfde tekenmotor als in de QR-ontwerper (vulling, vormen, hoeken, jouw gekozen logo).
- Het konijn verdwijnt: er komt alleen een logo in het midden als jij er zelf een gekozen hebt. Zonder keuze: geen logo.
- Het visitekaartje (PNG/PDF) krijgt dezelfde QR.

## 2. Uitnodigen: link maar één keer
- Nu wordt bij "Delen" zowel de link als een tekst mét de link meegestuurd, waardoor de link dubbel verschijnt.
- "Link kopiëren" kopieert voortaan alleen de link (zonder tekst) — dat werkt het netst overal.
- "Delen" stuurt de korte uitnodigingstekst + de link één keer.

## 3. Uitnodigingslink leidt naar de Over-pagina
- `rout.be/r/<gebruikersnaam>` (en `rout.be/r/u/<alias>` voor gratis leden) sturen door naar `rout.be/about?ref=<gebruikersnaam>` in plaats van naar het profiel.
- De uitnodiger wordt via de link zelf onthouden (geen tracking-cookies): de `ref` blijft in de link staan bij doorklikken naar "Registreren" (`/signup?ref=…`).
- Op de Over-pagina een klein bandje: "Uitgenodigd door @gebruikersnaam".
- Bij registratie wordt de nieuwe persoon gekoppeld aan de uitnodiger, zodat diens teller "uitgenodigd" met één stijgt. Dit gebeurt alleen bij een echte nieuwe registratie en nooit dubbel.

## Technische details
- `ShareMenu.tsx`: vervang `profileQrSvg` + verborgen `QRCodeCanvas` door de generator-renderer (`qrGenerator.ts` / `qr-design-bridge.ts`) met het volledige opgeslagen ontwerp; `routRabbitMarkup` niet meer standaard gebruiken (`emblem` default false, alleen eigen logo).
- `ReferralPanel.tsx`: clipboard schrijft `link`; `navigator.share({ title, text: INVITE_INTRO, url: link })`.
- `r.$username.tsx` / `r.u.$alias.tsx`: redirect naar `/about` met search `ref`; `about.tsx` leest `ref`, toont bandje en geeft `ref` mee aan signup-knoppen. Bestaande lokale opslag als terugval blijft, URL is leidend.
- Server-side claim in `referral.server.ts` blijft de bron (één keer per nieuw account, zelf-uitnodiging geweigerd).
- Tests: invite-link → `/about?ref=`, kopiëren = alleen link, dubbele claim telt niet.
