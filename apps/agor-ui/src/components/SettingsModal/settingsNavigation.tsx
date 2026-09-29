import {
  ApiOutlined,
  AppstoreOutlined,
  BranchesOutlined,
  ControlOutlined,
  CreditCardOutlined,
  ExperimentOutlined,
  FolderOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  RobotOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { SettingsSection } from '../../hooks/useSettingsRoute';

interface SettingsNavRow {
  section: SettingsSection;
  label: string;
  /** Label on the mobile index and drill-in header when it differs from `label`. */
  mobileLabel?: string;
  icon: React.ReactNode;
  beta?: boolean;
  /** Entity count shown on the mobile index. */
  count?: number;
}

interface SettingsNavGroup {
  key: string;
  title: string;
  /** Group heading on the mobile index when it differs from `title`. */
  mobileTitle?: string;
  rows: SettingsNavRow[];
}

type SettingsNavCounts = Partial<Record<SettingsSection, number>>;

interface BuildSettingsNavOptions {
  isAdmin: boolean;
  canSeeSection: (section: SettingsSection) => boolean;
  counts?: SettingsNavCounts;
}

/** Settings sections grouped as the caller's role may see them; the single source for every settings nav surface. */
export function buildSettingsNav({
  isAdmin,
  canSeeSection,
  counts = {},
}: BuildSettingsNavOptions): SettingsNavGroup[] {
  const groups: SettingsNavGroup[] = [
    {
      key: 'workspace',
      title: '工作区',
      rows: [
        { section: 'boards', label: '看板', icon: <AppstoreOutlined /> },
        { section: 'repos', label: '代码仓库', icon: <FolderOutlined /> },
        { section: 'branches', label: 'Branches', icon: <BranchesOutlined /> },
        { section: 'teammates', label: 'AI 队友', icon: <RobotOutlined /> },
        { section: 'cards', label: '卡片', icon: <CreditCardOutlined />, beta: true },
        { section: 'artifacts', label: 'Artifacts', icon: <ExperimentOutlined /> },
        // Menu-only admin gate; the pane itself is not in canSeeSection.
        ...(isAdmin
          ? [
              {
                section: 'workspace-preferences' as const,
                label: '偏好设置',
                icon: <ControlOutlined />,
              },
            ]
          : []),
      ],
    },
    {
      key: 'integrations',
      title: '集成',
      rows: [
        {
          section: 'agentic-tools',
          label: 'AI 工具',
          mobileLabel: 'AI 工具',
          icon: <ThunderboltOutlined />,
        },
        { section: 'mcp', label: 'MCP Servers', mobileLabel: 'MCP servers', icon: <ApiOutlined /> },
        {
          section: 'gateway',
          label: '消息通道',
          mobileLabel: '消息通道',
          icon: <MessageOutlined />,
        },
      ],
    },
    {
      key: 'admin',
      title: '管理',
      mobileTitle: '成员与用户组',
      rows: [
        { section: 'groups', label: '用户组', icon: <TeamOutlined /> },
        { section: 'users', label: '用户管理', icon: <TeamOutlined /> },
      ],
    },
    {
      key: 'system',
      title: '系统',
      mobileTitle: '关于',
      rows: [
        {
          section: 'about',
          label: '关于',
          mobileLabel: '关于 Agor',
          icon: <InfoCircleOutlined />,
        },
      ],
    },
  ];

  return groups
    .map((group) => ({
      ...group,
      rows: group.rows
        .filter((row) => canSeeSection(row.section))
        .map((row) => ({ ...row, count: counts[row.section] })),
    }))
    .filter((group) => group.rows.length > 0);
}

// Built once from the ungated nav, since a role-gated pane is still routable by URL.
const MOBILE_LABEL_BY_SECTION = new Map(
  buildSettingsNav({ isAdmin: true, canSeeSection: () => true }).flatMap((group) =>
    group.rows.map((row) => [row.section, row.mobileLabel ?? row.label] as const)
  )
);

/** Mobile drill-in header label for a section. */
export function settingsSectionMobileLabel(section: SettingsSection): string {
  return MOBILE_LABEL_BY_SECTION.get(section) ?? section;
}
