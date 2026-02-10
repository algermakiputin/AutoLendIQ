import { useState } from 'react';
import { Shield, ArrowLeft, AlertCircle, Mail, Lock, Sparkles } from 'lucide-react';

interface ApproverLoginProps {
  onLogin: (approver: { name: string; email: string; role: string }) => void;
  onBack: () => void;
}

export function ApproverLogin({ onLogin, onBack }: ApproverLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for demo
  const mockApprovers = [
    { email: 'agent@autolend.ph', password: 'demo123', name: 'Juan Dela Cruz', role: 'Senior Lending Agent' },
    { email: 'manager@autolend.ph', password: 'demo123', name: 'Maria Garcia', role: 'Lending Manager' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const approver = mockApprovers.find(
        (a) => a.email === email && a.password === password
      );

      if (approver) {
        onLogin({
          name: approver.name,
          email: approver.email,
          role: approver.role,
        });
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-8 left-8 p-2 hover:bg-secondary rounded-lg transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      )}
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="text-primary mb-2">AutoLend IQ</h1>
          <p className="text-muted-foreground">Approver Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-lg p-8 shadow-lg border border-[#e2e8f0]">
          <h2 className="mb-6 text-foreground">Agent Login</h2>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="agent@autolend.ph"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-[#e2e8f0]">
            <p className="text-xs text-muted-foreground mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-xs">
              <div className="bg-primary/5 rounded p-3">
                <p className="font-medium text-foreground mb-1">Senior Lending Agent</p>
                <p className="text-muted-foreground">agent@autolend.ph / demo123</p>
              </div>
              <div className="bg-primary/5 rounded p-3">
                <p className="font-medium text-foreground mb-1">Lending Manager</p>
                <p className="text-muted-foreground">manager@autolend.ph / demo123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <a href="#" className="text-primary hover:underline">
              Contact IT Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}