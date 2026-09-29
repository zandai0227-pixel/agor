import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip, theme } from 'antd';
import { useConnectionDisabled } from '../../contexts/ConnectionContext';

export interface NewSessionButtonProps {
  onClick?: () => void;
}

export const NewSessionButton: React.FC<NewSessionButtonProps> = ({ onClick }) => {
  const connectionDisabled = useConnectionDisabled();
  const { token } = theme.useToken();
  const tooltip = connectionDisabled ? '与 daemon 的连接已断开' : '新建…';

  return (
    <Tooltip title={tooltip} placement="left">
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<PlusOutlined style={{ fontSize: 20 }} />}
        onClick={onClick}
        disabled={connectionDisabled}
        style={{
          position: 'absolute',
          right: 24,
          top: 24,
          width: 56,
          height: 56,
          boxShadow: token.boxShadowSecondary,
          zIndex: 100,
        }}
      />
    </Tooltip>
  );
};
