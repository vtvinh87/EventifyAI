import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { vi } from '../../lang/vi';
import { SocialAuthButtons } from './SocialAuthButtons';
import { useAuthStore } from '../../stores/authStore';
import { Spinner } from '../../components/UI';
import { IconAlertCircle } from '../../components/Icons';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    const { error: signInError } = await signIn({ email, password });

    if (signInError) {
      setError("Email hoặc mật khẩu không hợp lệ.");
    } else {
      // Listener onAuthStateChange trong store sẽ xử lý việc lấy thông tin người dùng.
      // Chúng ta sẽ chuyển hướng đến trang onboarding nếu người dùng chưa có sở thích,
      // hoặc trang chủ nếu đã có. Điều này sẽ được xử lý trong App.tsx hoặc một component điều hướng.
      // Hiện tại, chúng ta chuyển hướng thủ công đến trang chủ.
      navigate('/');
    }
    setIsLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          label={vi.login.emailLabel}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          autoComplete="email"
          required
          disabled={isLoading}
        />
        <Input
          id="password"
          label={vi.login.passwordLabel}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          disabled={isLoading}
        />
        {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-2 rounded-md">
                <IconAlertCircle size={16} />
                <span>{error}</span>
            </div>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" /> : vi.header.login}
        </Button>
      </form>
      <SocialAuthButtons />
    </>
  );
};
