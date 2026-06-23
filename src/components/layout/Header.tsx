import { Card } from "../shared/Card";
import { TabSwitcher, type AppTab } from "./TabSwitcher";

const NAV_LINKS = ["אודות", "הוספת רדיו לארכיון", "קטעי תחקור", "ארכיון הקשבה"];

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <div id="header" className=" pb-0 shrink-0">
      <Card
        className="flex flex-col"
        style={{ padding: 0, position: "relative" }}
      >
        {/* Top row — flex with RTL direction (inherited from html[dir=rtl]).
            In RTL flex-row: first child = right, last child = left.
            Logo first → appears on RIGHT. Language last → appears on LEFT. */}
        <div
          className="flex items-center justify-between px-8 py-5"
          style={{ minHeight: 76 }}
        >
          {/* Logo — DOM first → visual RIGHT in RTL */}
          <img
            src="/main-logo.svg"
            alt="סאונד אוף פרוטסט"
            className="h-12 w-auto"
          />

          {/* Nav links — center */}
          <nav className="flex gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm transition-opacity hover:opacity-60"
                style={{
                  color: "var(--color-text-secondary)",
                  fontWeight: 500,
                }}
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Language switcher — DOM last → visual LEFT in RTL */}
          <div
            className="text-sm"
            style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}
          >
            עברית&nbsp;|&nbsp;English
          </div>
        </div>

        <TabSwitcher activeTab={activeTab} onChange={onTabChange} />
      </Card>
    </div>
  );
}
