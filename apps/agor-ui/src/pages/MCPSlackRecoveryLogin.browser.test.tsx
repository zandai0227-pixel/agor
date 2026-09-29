import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoginPage } from '@/components/LoginPage/LoginPage';

afterEach(() => {
  window.history.replaceState({}, '', '/ui/');
});

describe('Slack MCP recovery login return', () => {
  it('preserves the fragment token through external launch sign-in', () => {
    window.history.replaceState({}, '', '/ui/recover/mcp#token=signed-browser-token');
    render(
      <LoginPage
        onLogin={vi.fn()}
        externalLaunchLoginRedirectUrl="https://workspace.example.test/launch"
      />
    );

    const href = new URL(
      screen.getByRole('link', { name: '返回工作区' }).getAttribute('href') ?? ''
    );
    expect(href.searchParams.get('return_to')).toBe('/ui/recover/mcp#token=signed-browser-token');
    expect(window.location.hash).toBe('#token=signed-browser-token');
  });

  it('leaves the fragment in place while local login authenticates', async () => {
    window.history.replaceState({}, '', '/ui/recover/mcp#token=signed-browser-token');
    const onLogin = vi.fn(async () => true);
    render(<LoginPage onLogin={onLogin} />);

    fireEvent.change(screen.getByPlaceholderText('邮箱地址'), {
      target: { value: 'member@example.test' },
    });
    fireEvent.change(screen.getByPlaceholderText('密码'), {
      target: { value: 'correct horse battery staple' },
    });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => expect(onLogin).toHaveBeenCalledOnce());
    expect(window.location.hash).toBe('#token=signed-browser-token');
  });
});
