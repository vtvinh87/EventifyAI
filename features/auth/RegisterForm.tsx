import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { vi } from '../../lang/vi';
import { SocialAuthButtons } from './SocialAuthButtons';
import { useAuthStore } from '../../stores/authStore';
import { Spinner } from '../../components/UI';
import { IconAlertCircle, IconCheckCircle } from '../../components/Icons';

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }
    setIsLoading(true);

    const { data, error: signUpError } = await signUp({ email, password });
    
    if (signUpError) {
        setError(signUpError.message);
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError("Người dùng đã tồn tại.");
    }
    else {
        setSuccessMessage("Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác nhận tài khoản.");
    }
    setIsLoading(false);
  };

  if (successMessage) {
    return (
        <div className="flex flex-col items-center text-center gap-2 text-green-300 bg-green-500/10 p-4 rounded-md">
            <IconCheckCircle size={24} />
            <span className="font-semibold">{successMessage}</span>
        </div>
    )
  }

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
          autoComplete="new-password"
          required
          disabled={isLoading}
        />
        <Input
          id="confirmPassword"
          label={vi.register.confirmPasswordLabel}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
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
          {isLoading ? <Spinner size="sm" /> : vi.register.button}
        </Button>
      </form>
      <SocialAuthButtons />
    </>
  );
};
