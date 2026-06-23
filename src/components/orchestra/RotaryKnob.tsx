import { useAppStore } from "../../store/useAppStore";
import bgSrc from "../../assets/rotary-knob/rotary-knob-bg.svg";
import knobSrc from "../../assets/rotary-knob/rotary-knob-knob.svg";
import leftOnSrc from "../../assets/rotary-knob/rotary-knob-left-on.svg";
import rightOnSrc from "../../assets/rotary-knob/rotary-knob-right-on.svg";

const KNOB_W = 80; // display width in px
const KNOB_H = KNOB_W * (83.75 / 92.08); // preserve SVG aspect ratio ≈ 72.7px

export function RotaryKnob() {
  const orchestraMode = useAppStore((s) => s.orchestraMode);
  const setOrchestraMode = useAppStore((s) => s.setOrchestraMode);

  const isPlay = orchestraMode === "play";
  const toggle = () => setOrchestraMode(isPlay ? "edit" : "play");

  const labelStyle = (active: boolean): React.CSSProperties => ({
    position: "absolute",
    fontSize: 11,
    width: "auto",
    fontWeight: active ? 700 : 400,
    color: active ? "var(--color-text-primary)" : "var(--color-border-soft)",
    whiteSpace: "nowrap",
    transition: "color 0.25s ease, font-weight 0.25s ease",
    fontFamily: "Urbani, sans-serif",
    letterSpacing: "0.03em",
    top: "100%",
    translate: "-50% 0",
  });

  return (
    <div
      style={{
        marginRight: "30px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        direction: "ltr",
      }}
    >
      {/* Left label — selection mode */}
      <span style={{ ...labelStyle(!isPlay), left: "0%" }}>מצב סינון</span>

      {/* Knob stack */}
      <div
        role="button"
        aria-label={isPlay ? "מצב נגינה" : "מצב סינון"}
        onClick={toggle}
        style={{
          position: "relative",
          width: KNOB_W,
          height: KNOB_H,
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {/* 1 — background */}
        <img
          src={bgSrc}
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            userSelect: "none",
          }}
        />

        {/* 2 — rotating knob */}
        <img
          src={knobSrc}
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            transform: isPlay ? "rotate(275deg)" : "rotate(0deg)",
            transformOrigin: "50% 50.5%",
            transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
            userSelect: "none",
          }}
        />

        {/* 3a — left indicator (selection mode) */}
        <img
          src={leftOnSrc}
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: isPlay ? 0 : 1,
            transition: "opacity 0.2s ease",
            userSelect: "none",
          }}
        />

        {/* 3b — right indicator (play mode) */}
        <img
          src={rightOnSrc}
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: isPlay ? 1 : 0,
            transition: "opacity 0.2s ease",
            userSelect: "none",
          }}
        />
      </div>

      {/* Right label — play mode */}
      <span style={{ ...labelStyle(isPlay), right: "-10%" }}>מצב נגינה</span>
    </div>
  );
}
