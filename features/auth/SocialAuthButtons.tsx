
import React from 'react';
import { Button } from '../../components/ui/Button';
import { vi } from '../../lang/vi';
import { supabase } from '../../services/supabase';
// FIX: Provider type import was causing an error. It is correctly located in '@supabase/supabase-js'.
// Assuming the error was due to an environment issue and corrected the code to use the modern API.
import type { Provider } from '@supabase/supabase-js';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.4 512 244 512 110.3 512 0 398.8 0 261.8 0 124.7 109.3 12.8 244 12.8c70.3 0 129.8 27.8 174.4 72.4l-64 64c-20.9-19.8-48.4-32.4-79.4-32.4-62.3 0-113.5 51.6-113.5 115.3 0 63.8 51.2 115.3 113.5 115.3 71.3 0 95.8-52.1 99.2-76.9H244v-83.6h239.3c5.3 27.9 8.7 58.9 8.7 92.4z"></path>
  </svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
    </svg>
);


export const SocialAuthButtons: React.FC = () => {
  const handleSocialLogin = async (provider: Provider) => {
    // FIX: signInWithOAuth is the correct method for Supabase v2. The original error was likely due to type issues.
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // FIX: Ensure the redirectTo URL is correctly formed for the deployment environment.
        redirectTo: window.location.origin + window.location.pathname,
      },
    });
  };

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-800 text-gray-400">{vi.auth.orContinueWith}</span>
        </div>
      </div>
      <div className="space-y-4">
        <Button variant="secondary" className="w-full" onClick={() => handleSocialLogin('google')}>
          <GoogleIcon />
          {vi.auth.signInWithGoogle}
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => handleSocialLogin('facebook')}>
            <FacebookIcon />
          {vi.auth.signInWithFacebook}
        </Button>
      </div>
    </>
  );
};
