import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ArrowRight, Eye, EyeOff, Check, Lock, Mail, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'sonner';
import { EASE_LUXURY, EASE_EXIT } from '../../lib/animations';
import { springs } from '../../lib/motion-tokens';
import { useDialog } from '../../hooks/useDialog';

import { BrandLogo } from './BrandLogo';

const AUTH_TITLE_ID = 'auth-panel-title';
export const AUTH_PANEL_ID = 'auth-panel';

export function AuthPanel() {
  const { isAuthPanelOpen, authPanelMode, closeAuthPanel, setAuthPanelMode } = useUIStore();
  const { login, isLoading: isAuthLoading, continueAsGuest } = useAuthStore();
  const reducedMotion = useReducedMotion() === true;

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  const { dialogProps } = useDialog<HTMLDivElement>({
    open: isAuthPanelOpen,
    onClose: closeAuthPanel,
    labelledById: AUTH_TITLE_ID,
  });

  // Focus management
  useEffect(() => {
    if (isAuthPanelOpen) {
      const timer = setTimeout(() => {
        emailInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      // Reset sensitive states on close
      setPassword('');
      setIsShaking(false);
      setForgotSent(false);
    }
  }, [isAuthPanelOpen, authPanelMode]);

  const triggerShake = () => {
    if (reducedMotion) return;
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 460);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerShake();
      toast.error('Please complete all required fields');
      return;
    }

    try {
      await login(email, password);
      toast.success('Welcome back to the Atelier');
      closeAuthPanel();
    } catch {
      triggerShake();
      toast.error('Invalid credentials. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      triggerShake();
      toast.error('Please complete all required fields');
      return;
    }

    if (password.length < 6) {
      triggerShake();
      toast.error('Password must contain at least 6 characters');
      return;
    }

    setLocalLoading(true);
    try {
      const { default: api } = await import('../../lib/api');
      await api.post('/auth/register', { name, email, password });
      await login(email, password);
      toast.success('Membership activated. Welcome to VOID.');
      closeAuthPanel();
    } catch (err: unknown) {
      triggerShake();
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      triggerShake();
      toast.error('Please enter your email address');
      return;
    }

    setLocalLoading(true);
    // Simulate recovery dispatch with tactile feedback
    setTimeout(() => {
      setLocalLoading(false);
      setForgotSent(true);
      toast.success('Recovery instructions dispatched');
    }, 650);
  };

  const fillDemoCredentials = () => {
    setEmail('atelier@void.luxury');
    setPassword('atelier2026');
    toast.info('Demo credentials loaded');
  };

  const isLoading = isAuthLoading || localLoading;

  return (
    <AnimatePresence>
      {isAuthPanelOpen && (
        <div className="fixed inset-0 z-[220] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
          {/* Backdrop Scrim with progressive blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_LUXURY }}
            onClick={closeAuthPanel}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Floating Luxury Glass Panel */}
          <motion.div
            {...dialogProps}
            id={AUTH_PANEL_ID}
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 20 }
            }
            animate={
              reducedMotion
                ? { opacity: 1 }
                : isShaking
                ? {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    x: [0, -8, 8, -6, 6, -3, 3, 0],
                    transition: { duration: 0.45, ease: 'easeInOut' },
                  }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 16 }
            }
            transition={
              reducedMotion
                ? { duration: 0.18 }
                : springs.snappy
            }
            className="relative w-full sm:max-w-[460px] bg-[var(--ivory)]/95 dark:bg-[#141210]/95 backdrop-blur-2xl border border-hairline/80 dark:border-white/10 rounded-t-[28px] sm:rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.35)] overflow-hidden text-ink z-10 max-h-[92vh] flex flex-col"
          >
            {/* Specular light highlight on top border */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/15 to-transparent pointer-events-none" />

            {/* Mobile Swipe / Drag indicator */}
            <div className="pt-3 pb-1 sm:hidden flex justify-center" aria-hidden="true">
              <div className="w-10 h-1 rounded-full bg-ink-mute/25" />
            </div>

            {/* Header with Close and Segmented Tab Control */}
            <div className="px-6 pt-5 pb-4 border-b border-hairline/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BrandLogo size="sm" showSubtext={false} />
                <div className="h-4 w-px bg-hairline" />
                <h2
                  id={AUTH_TITLE_ID}
                  className="text-base font-bold tracking-tight text-ink"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {authPanelMode === 'login'
                    ? 'Member Access'
                    : authPanelMode === 'register'
                    ? 'Atelier Membership'
                    : 'Account Recovery'}
                </h2>
              </div>

              {/* Close button with 44px touch target */}
              <button
                type="button"
                onClick={closeAuthPanel}
                className="pressable w-9 h-9 min-w-[44px] min-h-[44px] rounded-full border border-hairline hover:border-ink hover:bg-[var(--bone)] text-ink-mute hover:text-ink flex items-center justify-center transition-colors focus-visible:outline-offset-2"
                aria-label="Close authentication panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Tab Morph (Sign In vs Register) */}
            {authPanelMode !== 'forgot' && (
              <div className="px-6 pt-4">
                <div className="p-1 rounded-xl bg-[var(--bone)]/70 border border-hairline/80 grid grid-cols-2 gap-1 relative">
                  <button
                    type="button"
                    onClick={() => setAuthPanelMode('login')}
                    className={`relative z-10 py-2 text-xs font-mono tracking-wider uppercase font-bold transition-colors rounded-lg flex items-center justify-center min-h-[36px] ${
                      authPanelMode === 'login' ? 'text-ink' : 'text-ink-mute hover:text-ink'
                    }`}
                  >
                    {authPanelMode === 'login' && (
                      <motion.div
                        layoutId="auth-active-tab-pill"
                        className="absolute inset-0 bg-ivory dark:bg-[#201D1A] rounded-lg shadow-sm border border-hairline/60 -z-10"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      />
                    )}
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthPanelMode('register')}
                    className={`relative z-10 py-2 text-xs font-mono tracking-wider uppercase font-bold transition-colors rounded-lg flex items-center justify-center min-h-[36px] ${
                      authPanelMode === 'register' ? 'text-ink' : 'text-ink-mute hover:text-ink'
                    }`}
                  >
                    {authPanelMode === 'register' && (
                      <motion.div
                        layoutId="auth-active-tab-pill"
                        className="absolute inset-0 bg-ivory dark:bg-[#201D1A] rounded-lg shadow-sm border border-hairline/60 -z-10"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      />
                    )}
                    Join
                  </button>
                </div>
              </div>
            )}

            {/* Scrollable Form Body with Direction-Aware Form Transitions */}
            <div className="p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                {authPanelMode === 'login' && (
                  <motion.form
                    key="login-form"
                    initial={reducedMotion ? undefined : { opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, x: 16 }}
                    transition={{ duration: 0.22, ease: EASE_LUXURY }}
                    onSubmit={handleLoginSubmit}
                    className="space-y-4"
                  >
                    {/* Email field */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor="auth-panel-email"
                          className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-mute font-semibold flex items-center gap-1.5"
                        >
                          <Mail className="w-3 h-3 text-sienna" />
                          Email Address
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          ref={emailInputRef}
                          id="auth-panel-email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="client@atelier.void"
                          required
                          className="w-full bg-[var(--bone)]/50 border border-hairline rounded-xl px-3.5 py-3 text-sm text-ink placeholder:text-ink-mute/50 focus:outline-none focus:border-sienna focus:bg-[var(--bone)]/90 transition-[border-color,background-color] font-body"
                        />
                      </div>
                    </div>

                    {/* Password field */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor="auth-panel-password"
                          className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-mute font-semibold flex items-center gap-1.5"
                        >
                          <Lock className="w-3 h-3 text-sienna" />
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setAuthPanelMode('forgot')}
                          className="text-[11px] font-mono text-sienna hover:underline uppercase tracking-wider"
                        >
                          Forgot?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          id="auth-panel-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full bg-[var(--bone)]/50 border border-hairline rounded-xl pl-3.5 pr-11 py-3 text-sm text-ink placeholder:text-ink-mute/50 focus:outline-none focus:border-sienna focus:bg-[var(--bone)]/90 transition-[border-color,background-color] font-body"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 min-w-[36px] min-h-[36px] flex items-center justify-center text-ink-mute hover:text-ink transition-colors focus-visible:outline-offset-2"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Demo credential button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={fillDemoCredentials}
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-ink-mute hover:text-sienna transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-sienna" />
                        Autofill Demo Account
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 space-y-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="pressable btn-island-primary w-full justify-center disabled:opacity-50 min-h-[46px]"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            Authenticating...
                          </span>
                        ) : (
                          <>
                            <span>Enter Atelier</span>
                            <span className="icon-pill">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}

                {authPanelMode === 'register' && (
                  <motion.form
                    key="register-form"
                    initial={reducedMotion ? undefined : { opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, x: -16 }}
                    transition={{ duration: 0.22, ease: EASE_LUXURY }}
                    onSubmit={handleRegisterSubmit}
                    className="space-y-4"
                  >
                    {/* Full name field */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="register-panel-name"
                        className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-mute font-semibold flex items-center gap-1.5"
                      >
                        <UserIcon className="w-3 h-3 text-sienna" />
                        Full Name
                      </label>
                      <input
                        ref={emailInputRef}
                        id="register-panel-name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Elena Rostova"
                        required
                        className="w-full bg-[var(--bone)]/50 border border-hairline rounded-xl px-3.5 py-3 text-sm text-ink placeholder:text-ink-mute/50 focus:outline-none focus:border-sienna focus:bg-[var(--bone)]/90 transition-[border-color,background-color] font-body"
                      />
                    </div>

                    {/* Email field */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="register-panel-email"
                        className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-mute font-semibold flex items-center gap-1.5"
                      >
                        <Mail className="w-3 h-3 text-sienna" />
                        Email Address
                      </label>
                      <input
                        id="register-panel-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="elena@atelier.void"
                        required
                        className="w-full bg-[var(--bone)]/50 border border-hairline rounded-xl px-3.5 py-3 text-sm text-ink placeholder:text-ink-mute/50 focus:outline-none focus:border-sienna focus:bg-[var(--bone)]/90 transition-[border-color,background-color] font-body"
                      />
                    </div>

                    {/* Password field */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="register-panel-password"
                        className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-mute font-semibold flex items-center gap-1.5"
                      >
                        <Lock className="w-3 h-3 text-sienna" />
                        Create Password
                      </label>
                      <div className="relative">
                        <input
                          id="register-panel-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          minLength={6}
                          required
                          className="w-full bg-[var(--bone)]/50 border border-hairline rounded-xl pl-3.5 pr-11 py-3 text-sm text-ink placeholder:text-ink-mute/50 focus:outline-none focus:border-sienna focus:bg-[var(--bone)]/90 transition-[border-color,background-color] font-body"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 min-w-[36px] min-h-[36px] flex items-center justify-center text-ink-mute hover:text-ink transition-colors focus-visible:outline-offset-2"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="pt-3 space-y-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="pressable btn-island-primary w-full justify-center disabled:opacity-50 min-h-[46px]"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            Creating Account...
                          </span>
                        ) : (
                          <>
                            <span>Request Atelier Membership</span>
                            <span className="icon-pill">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}

                {authPanelMode === 'forgot' && (
                  <motion.div
                    key="forgot-form"
                    initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: EASE_LUXURY }}
                  >
                    {forgotSent ? (
                      <div className="text-center py-4 space-y-4">
                        <div className="w-12 h-12 rounded-full bg-sienna/10 text-sienna mx-auto flex items-center justify-center">
                          <Check className="w-6 h-6" />
                        </div>
                        <div>
                          <h3
                            className="text-lg font-bold text-ink"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            Recovery Dispatched
                          </h3>
                          <p className="text-xs text-ink-soft mt-1 leading-relaxed max-w-[32ch] mx-auto">
                            If an account is associated with <span className="font-semibold text-ink">{email}</span>, a secure sign-in link is en route.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setForgotSent(false);
                            setAuthPanelMode('login');
                          }}
                          className="pressable btn-island-ghost w-full justify-center"
                        >
                          Return to Sign In
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleForgotSubmit} className="space-y-4">
                        <p className="text-xs text-ink-soft leading-relaxed">
                          Enter your account email. We will dispatch a single-use authorization token to your inbox.
                        </p>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="forgot-panel-email"
                            className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-mute font-semibold flex items-center gap-1.5"
                          >
                            <Mail className="w-3 h-3 text-sienna" />
                            Registered Email
                          </label>
                          <input
                            ref={emailInputRef}
                            id="forgot-panel-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="client@atelier.void"
                            required
                            className="w-full bg-[var(--bone)]/50 border border-hairline rounded-xl px-3.5 py-3 text-sm text-ink placeholder:text-ink-mute/50 focus:outline-none focus:border-sienna focus:bg-[var(--bone)]/90 transition-[border-color,background-color] font-body"
                          />
                        </div>

                        <div className="pt-2 space-y-3">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="pressable btn-island-primary w-full justify-center disabled:opacity-50 min-h-[46px]"
                          >
                            {isLoading ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                                Dispatching...
                              </span>
                            ) : (
                              <span>Send Recovery Link</span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setAuthPanelMode('login')}
                            className="w-full text-center font-mono text-[11px] tracking-wider uppercase text-ink-mute hover:text-ink transition-colors py-2"
                          >
                            Cancel & Return
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer with Guest & Confidentiality Notice */}
            <div className="px-6 py-3.5 bg-[var(--bone)]/40 border-t border-hairline/60 flex items-center justify-between text-[11px] font-mono text-ink-mute">
              <span>Encrypted 256-Bit Session</span>
              <button
                type="button"
                onClick={() => {
                  continueAsGuest();
                  closeAuthPanel();
                }}
                className="text-sienna hover:underline font-semibold"
              >
                Browse as Guest →
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
