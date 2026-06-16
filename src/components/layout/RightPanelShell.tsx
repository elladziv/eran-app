import { type ReactNode } from 'react'
import { Card } from '../shared/Card'
import { RIGHT_PANEL_WIDTH } from '../../styles/constants'

interface RightPanelShellProps {
  children: ReactNode
}

export function RightPanelShell({ children }: RightPanelShellProps) {
  return (
    <Card
      id="right-panel"
      className="flex flex-col overflow-hidden shrink-0"
      style={{
        width: RIGHT_PANEL_WIDTH,
        minWidth: RIGHT_PANEL_WIDTH,
        backgroundColor: 'var(--color-surface-inner)',
      }}
    >
      {children}
    </Card>
  )
}
