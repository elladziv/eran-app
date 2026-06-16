export type AppTab = "orchestra" | "geo";

const TAB_LABELS: Record<AppTab, string> = {
  orchestra: "סינון אקוסטי - כלים",
  geo: "סינון מרחבי - גאוגרפי",
};

interface TabSwitcherProps {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
}

export function TabSwitcher({ activeTab, onChange }: TabSwitcherProps) {
  return (
    <div
      className="inline-flex"
      style={{
        alignSelf: "flex-end",
        borderTopRightRadius: "3px",
        overflow: "hidden",
      }}
    >
      {(["orchestra", "geo"] as AppTab[]).map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className="text-sm font-medium transition-colors"
            style={{
              padding: "4px 12px",
              color: "var(--color-text-secondary)",
              backgroundColor: isActive
                ? "var(--color-surface-inner)"
                : "rgba(153,134,117,0.21)",
              fontWeight: isActive ? 700 : 500,
            }}
          >
            {TAB_LABELS[tab]}
          </button>
        );
      })}
    </div>
  );
}
