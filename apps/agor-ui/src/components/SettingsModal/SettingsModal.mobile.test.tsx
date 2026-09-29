/**
 * Mobile (compact) settings uses an iOS-style grouped index that drills into the
 * reused section content, replacing the desktop section dropdown. Desktop (md+)
 * keeps its Menu + panel, covered by SettingsModal.nav.test.
 */

import type { User } from '@agor-live/client';
import { fireEvent, render, screen } from '@testing-library/react';
import { Grid } from 'antd';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SettingsModal } from './SettingsModal';

vi.mock('./BoardsTable', () => ({
  BoardsTable: () => <div>Boards section content</div>,
}));
vi.mock('./TeammatesTable', () => ({
  TeammatesTable: () => <div>Teammates section content</div>,
}));

beforeEach(() => {
  // Compact = mobile chrome.
  vi.spyOn(Grid, 'useBreakpoint').mockReturnValue({ xs: true });
});

function makeUser(role: string): User {
  return { user_id: `user-${role}`, email: `${role}@agor.live`, name: role, role } as User;
}

function MobileSettings({
  userRole = 'admin',
  initial = 'boards',
}: {
  userRole?: string;
  initial?: string;
}) {
  const [tab, setTab] = useState(initial);
  return (
    <SettingsModal
      open
      onClose={vi.fn()}
      client={null}
      currentUser={makeUser(userRole)}
      activeTab={tab}
      onTabChange={setTab}
    />
  );
}

describe('SettingsModal mobile index', () => {
  it('opens on a grouped index with no section dropdown', () => {
    render(<MobileSettings />);
    expect(screen.queryByLabelText('Settings section')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '看板' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '代码仓库' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '关于 Agor' })).toBeInTheDocument();
    // Group headings + account identity summary.
    expect(screen.getByText('工作区')).toBeInTheDocument();
    expect(screen.getByText('账户')).toBeInTheDocument();
    // The index itself is not the content yet.
    expect(screen.queryByText('Boards section content')).not.toBeInTheDocument();
  });

  it('drills into a section and back to the index', () => {
    render(<MobileSettings />);
    fireEvent.click(screen.getByRole('button', { name: '看板' }));

    expect(screen.getByText('Boards section content')).toBeInTheDocument();
    const back = screen.getByRole('button', { name: '返回' });
    expect(back).toBeInTheDocument();

    fireEvent.click(back);
    // Back at the index; content is gone and the rows are shown again.
    expect(screen.queryByText('Boards section content')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '代码仓库' })).toBeInTheDocument();
  });

  it('seeds straight into a deep-linked section (with Back to the index)', () => {
    render(<MobileSettings initial="teammates" />);
    expect(screen.getByText('Teammates section content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '返回' })).toBeInTheDocument();
  });

  it('gates rows by role (a viewer sees no Users/Groups)', () => {
    render(<MobileSettings userRole="viewer" />);
    expect(screen.queryByRole('button', { name: '用户管理' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '用户组' })).not.toBeInTheDocument();
  });
});
