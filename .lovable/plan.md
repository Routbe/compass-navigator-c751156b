# Studio-tabs terug naar de oorspronkelijke kleur

## Wat er mis is
De tabbalk (Inhoud, Vormgeving, Statistieken, Identiteit, Instellingen) toont alle tabs als zwarte knoppen met een harde zwarte rand/schaduw. Daardoor zie je niet meer welke tab actief is, en de tekst van niet-actieve tabs is slecht leesbaar (grijs op zwart).

## Oorzaak (bevestigd in de code)
Bij een recente wijziging werd de gewone tab-knop vervangen door de algemene knopstijl van de app. Die stijl is standaard zwart met een "sticker"-schaduw. De niet-actieve tabs zetten geen eigen achtergrond, dus erven ze dat zwart.

## Beste oplossing
Terug naar de oude, rustige look (segmented control):
- Niet-actieve tabs: transparant, grijze tekst, bij aanraken lichte achtergrond en donkere tekst.
- Actieve tab: donkere pil met lichte tekst (zoals vroeger), zonder zware schaduw.
- Geen zwarte rand/schaduw meer rond de tabs.
- Toetsenbord-focusring blijft zichtbaar.

Alternatief overwogen: actieve tab wit met zachte schaduw (iOS-stijl). Afgewezen omdat de rest van de Studio (Publiceren, Voorbeeld bekijken) donkere actieve knoppen gebruikt; de donkere pil blijft consistent.

## Controle na de fix
- Screenshot op telefoonbreedte (384px) en desktop: actieve tab duidelijk, andere tabs licht.
- Zelfde check in donkere modus.
- Zoeken naar andere plekken waar dezelfde knopstijl per ongeluk als tab of filterpil wordt gebruikt en die ook rechtzetten.

## Technische details
- `src/components/dashboard/ProfileEditor.tsx` (tablist rond regel 924): `<Button>` krijgt `variant="ghost"` (geen `sticker-shadow`, geen `bg-primary`), of terug naar native `<button>`.
- Inactief: `bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground`; actief: `bg-foreground text-background shadow-none`.
- `rg` op `role="tab"` en `<Button` binnen tablists/pill-groepen in `src/components` om dezelfde fout elders te vinden.
