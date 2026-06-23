import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "./components/layout/Header";
import { BottomPanel } from "./components/layout/BottomPanel";
import { ComposerTriggerBar } from "./components/layout/ComposerTriggerBar";
import { RightPanelShell } from "./components/layout/RightPanelShell";
import { Card } from "./components/shared/Card";
import { type AppTab } from "./components/layout/TabSwitcher";
import { COMPOSER_HEIGHT_VH, Z_COMPOSER } from "./styles/constants";
import { useAppStore } from "./store/useAppStore";
import { OrchestraView } from "./components/orchestra/OrchestraView";
import { GeoView } from "./components/geo/GeoView";
import { ComposerPanel } from "./components/composer/ComposerPanel";
import { VideoPool } from "./components/shared/VideoPool";
import { RightPanel } from "./components/rightPanel/RightPanel";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("orchestra");
  const isComposerOpen = useAppStore((s) => s.isComposerOpen);
  const toggleComposer = useAppStore((s) => s.toggleComposer);

  return (
    /* Viewport — shows the tiled background; vertically centers the container */
    <div
      className="min-h-screen flex items-start justify-center"
      style={{ padding: "20px 16px" }}
    >
      {/* Floating app container — light-taupe card over the background */}
      <div
        id="app-container"
        className="relative flex flex-col w-full overflow-hidden rounded-2xl"
        style={{
          maxWidth: 1440,
          minHeight: "calc(100vh - 40px)",
          backgroundColor: "var(--color-surface-inner)",
          boxShadow: "0 8px 60px rgba(0,0,0,0.18)",
        }}
      >
        <VideoPool />

        <Header activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main content area */}
        <div
          id="main-content"
          className="flex-1 flex flex-col pt-3 pb-0 gap-3 min-h-0"
        >
          {/* Main view row:
              In RTL flex-row: first child = right side, second child = left side.
              Right panel is first (→ right), map card is second (→ left). */}
          <div className="flex gap-3 flex-1 min-h-0">
            {/* Right panel — appears on the RIGHT in RTL */}
            <RightPanelShell>
              <RightPanel />
            </RightPanelShell>

            {/* Central map — appears on the LEFT in RTL */}
            <Card
              id="map-view"
              className="flex-1 overflow-hidden main-card"
              style={{ backgroundColor: "var(--color-surface-inner)" }}
            >
              {activeTab === "orchestra" ? <OrchestraView /> : <GeoView />}
            </Card>
          </div>

          <BottomPanel />
        </div>

        {/* Trigger bar only shown when panel is closed */}
        {!isComposerOpen && (
          <ComposerTriggerBar isOpen={false} onToggle={toggleComposer} />
        )}

        {/* Composer — slides up; trigger bar is at the top so the close button stays reachable */}
        <AnimatePresence>
          {isComposerOpen && (
            <motion.div
              key="composer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              id="composer-panel"
              className="absolute bottom-0 left-0 right-0 flex flex-col"
              style={{
                height: `${COMPOSER_HEIGHT_VH}vh`,
                zIndex: Z_COMPOSER,
                backgroundColor: "var(--color-composer-bg)",
              }}
            >
              <ComposerPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
