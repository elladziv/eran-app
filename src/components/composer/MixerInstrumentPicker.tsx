import { MIXER_INSTRUMENTS } from "../../data/mixerInstruments";
import { useAppStore } from "../../store/useAppStore";
import { COMPOSER_MAX_TRACKS } from "../../styles/constants";

const CATEGORY_LABELS: Record<string, string> = {
  chorus: "מקהלה",
  megaphones: "מגפון",
  brass: "נשיפה",
  string: "מיתר",
  percussion: "הקשה",
};

export function MixerInstrumentPicker() {
  const tracks = useAppStore((s) => s.tracks);
  const addTrack = useAppStore((s) => s.addTrack);

  const atMax = tracks.length >= COMPOSER_MAX_TRACKS;

  return (
    <div
      className="flex flex-col shrink-0 overflow-y-auto"
      style={{
        width: 160,
        borderInlineStart: "1px solid var(--color-composer-separator)",
        backgroundColor: "rgba(0,0,0,0.15)",
      }}
    >
      <div
        className="px-3 py-2 text-xs font-semibold shrink-0"
        style={{
          color: "var(--color-border-soft)",
          borderBottom: "1px solid var(--color-composer-separator)",
          letterSpacing: "0.06em",
        }}
      >
        כלי מיקסר
      </div>

      {MIXER_INSTRUMENTS.map((inst) => {
        const alreadyAdded = tracks.some((t) => t.instrument.id === inst.id);

        return (
          <button
            key={inst.id}
            onClick={() => {
              if (!alreadyAdded && !atMax) addTrack(inst);
            }}
            disabled={alreadyAdded || atMax}
            className="flex items-center gap-2 px-3 py-2.5 text-right transition-colors hover:bg-white/5 w-full"
            style={{
              borderBottom: "1px solid var(--color-composer-separator)",
              opacity: alreadyAdded || atMax ? 0.4 : 1,
              cursor: alreadyAdded || atMax ? "not-allowed" : "pointer",
            }}
          >
            <img
              src={inst.iconUrl}
              alt={inst.name}
              className="w-7 h-7 object-contain shrink-0"
              style={{ filter: "", opacity: 0.8 }}
            />
            <div className="flex-1 min-w-0 text-right">
              <div
                className="text-sm font-medium truncate"
                style={{ color: "var(--color-surface-card)" }}
              >
                {inst.name}
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--color-border-soft)" }}
              >
                {CATEGORY_LABELS[inst.category]}
              </div>
            </div>
            {alreadyAdded && (
              <span
                className="text-xs shrink-0"
                style={{ color: "var(--color-accent-gold)" }}
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
