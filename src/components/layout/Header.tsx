import { Card } from '../shared/Card'
import { TabSwitcher, type AppTab } from './TabSwitcher'

const NAV_LINKS = [
  'אודות',
  'הוספת רדיו לארכיון',
  'קטעי תחקור',
  'ארכיון הקשבה',
]

interface HeaderProps {
  activeTab: AppTab
  onTabChange: (tab: AppTab) => void
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <div className="px-6 pt-5 pb-0">
      <Card className="overflow-hidden" style={{ padding: 0 }}>
        {/* Top row: logo | nav | language */}
        <div
          className="flex items-center justify-between px-8 py-4"
          style={{ minHeight: 72 }}
        >
          {/* Language switcher (start = right in RTL) */}
          <div
            className="text-xs"
            style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}
          >
            עברית&nbsp;|&nbsp;English
          </div>

          {/* Nav links (center) */}
          <nav className="flex gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm transition-opacity hover:opacity-60"
                style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Logo (end = left in RTL) */}
          <img
            src="/main-logo.svg"
            alt="סאונד אוף פרוטסט"
            className="h-12 w-auto"
          />
        </div>

        {/* Tab switcher strip */}
        <TabSwitcher activeTab={activeTab} onChange={onTabChange} />
      </Card>
    </div>
  )
}
