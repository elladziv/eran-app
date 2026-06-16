import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './components/layout/Header'
import { BottomPanel } from './components/layout/BottomPanel'
import { ComposerTriggerBar } from './components/layout/ComposerTriggerBar'
import { RightPanelShell } from './components/layout/RightPanelShell'
import { Card } from './components/shared/Card'
import { type AppTab } from './components/layout/TabSwitcher'
import { COMPOSER_HEIGHT_VH, Z_COMPOSER } from './styles/constants'
import { useAppStore } from './store/useAppStore'
import { OrchestraView } from './components/orchestra/OrchestraView'
import { RightPanel } from './components/rightpanel/RightPanel'
import { GeoView } from './components/geo/GeoView'
import { ComposerPanel } from './components/composer/ComposerPanel'
import { VideoPool } from './components/shared/VideoPool'

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('orchestra')
  const isComposerOpen = useAppStore((s) => s.isComposerOpen)
  const toggleComposer = useAppStore((s) => s.toggleComposer)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Audio playback pool — hidden video elements for composer playback */}
      <VideoPool />

      {/* Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col px-6 pt-4 pb-0 gap-3 min-h-0">
        {/* Main view row: map + right panel */}
        <div className="flex gap-3 flex-1 min-h-0">
          {/* Central map area */}
          <Card
            className="flex-1 overflow-hidden"
            style={{ backgroundColor: 'var(--color-surface-inner)' }}
          >
            {activeTab === 'orchestra' ? (
              <OrchestraView />
            ) : (
              <GeoView />
            )}
          </Card>

          {/* Right panel */}
          <RightPanelShell>
            <RightPanel />
          </RightPanelShell>
        </div>

        {/* Bottom panel — selected instruments */}
        <BottomPanel />
      </div>

      {/* Composer trigger bar */}
      <ComposerTriggerBar
        isOpen={isComposerOpen}
        onToggle={toggleComposer}
      />

      {/* Composer panel — slides up over everything */}
      <AnimatePresence>
        {isComposerOpen && (
          <motion.div
            key="composer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 flex flex-col"
            style={{
              height: `${COMPOSER_HEIGHT_VH}vh`,
              zIndex: Z_COMPOSER,
              backgroundColor: 'var(--color-composer-bg)',
            }}
          >
            <ComposerPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
