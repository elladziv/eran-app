export type AppTab = 'orchestra' | 'geo'

const TAB_LABELS: Record<AppTab, string> = {
  orchestra: 'סגנון אקוסטי - כלים',
  geo:       'סגנון מזרחי - גאוגרפי',
}

interface TabSwitcherProps {
  activeTab: AppTab
  onChange: (tab: AppTab) => void
}

export function TabSwitcher({ activeTab, onChange }: TabSwitcherProps) {
  return (
    <div className="flex flex-row-reverse">
      {(['orchestra', 'geo'] as AppTab[]).map((tab) => {
        const isActive = tab === activeTab
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className="px-8 py-3 text-sm font-medium transition-colors"
            style={{
              color: 'var(--color-text-secondary)',
              backgroundColor: isActive
                ? 'var(--color-surface-inner)'
                : 'rgba(153,134,117,0.21)',
              fontWeight: isActive ? 700 : 500,
            }}
          >
            {TAB_LABELS[tab]}
          </button>
        )
      })}
    </div>
  )
}
