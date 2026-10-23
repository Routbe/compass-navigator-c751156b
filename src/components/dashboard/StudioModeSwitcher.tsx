import { BadgeCheck, HeartHandshake, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type Mode = "profile" | "tip";

/** Workspace-achtige wisselbalk: altijd zichtbaar welke pagina je in de Studio beheert. */
export function StudioModeSwitcher({ mode, onChange, handle, enabled = true }: { mode: Mode; onChange: (m: Mode) => void; handle: string; enabled?: boolean }) {
  const { t } = useI18n();
  const Icon = mode === "profile" ? BadgeCheck : HeartHandshake;
  return (
    <Button variant="outline" type="button" data-tour="studio-mode" disabled={!enabled && mode === "profile"} onClick={() => onChange(mode === "profile" ? "tip" : "profile")} aria-label={t(mode === "profile" ? "studio.mode.toTip" : "studio.mode.toProfile")} className="mb-3 min-h-12 h-auto w-full justify-start gap-3 whitespace-normal px-3 py-2 text-left">
      <Icon className="size-5 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{t(mode === "profile" ? "studio.mode.profile" : "studio.mode.tip")}</span>
        <span className="block truncate font-mono text-[11px] text-muted-foreground">rout.be/{handle}{mode === "tip" ? "/tip" : ""}</span>
      </span>
      <ArrowLeftRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
    </Button>
  );
}
