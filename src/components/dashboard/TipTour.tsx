import { useState } from "react";
import { Button } from "@/components/ui/button";

const STEPS = [
  { title: "Je steunpagina staat aan", body: "Bovenaan wissel je tussen 'Geverifieerd profiel' en 'Steunpagina'. Zo zie je altijd wat je aan het beheren bent." },
  { title: "Kies je betaalmethodes", body: "Zet overschrijving, direct betalen en externe links aan of uit, en bepaal de volgorde met de pijltjes." },
  { title: "Voeg foto's toe", body: "Tot 6 foto's. Ze worden automatisch verkleind zonder zichtbaar verlies. Of haal ze op van Bluesky of Mastodon." },
  { title: "Klaar", body: "Klik op 'Opslaan'. Terug naar je profiel? Kies bovenaan 'Geverifieerd profiel'." },
];

export const TIP_TOUR_KEY = "rout_tour_tip_done";

/** Korte rondleiding bij de eerste activatie van de steunpagina. */
export function TipTour({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const step = STEPS[i]!;
  const finish = () => {
    try {
      window.localStorage.setItem(TIP_TOUR_KEY, "1");
    } catch {
      /* geen opslag: de tour komt dan nog eens terug */
    }
    onDone();
  };
  return (
    <div role="dialog" aria-modal="false" aria-label="Rondleiding steunpagina" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-xl">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        Stap {i + 1} van {STEPS.length}
      </p>
      <h3 className="mt-1 text-sm font-semibold">{step.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
      <div className="mt-3 flex justify-between">
        <Button size="sm" variant="ghost" onClick={finish}>
          Overslaan
        </Button>
        <Button size="sm" onClick={() => (i < STEPS.length - 1 ? setI(i + 1) : finish())}>
          {i < STEPS.length - 1 ? "Volgende" : "Begrijpen"}
        </Button>
      </div>
    </div>
  );
}
