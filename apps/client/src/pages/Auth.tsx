import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  Loader2,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { EASE_LUXURY, EASE_EXIT } from '../lib/animations';
import { toast } from 'sonner';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion() === true;

  const { login, isLoading: isAuthLoading, continueAsGuest } = useAuthStore();

  // Mode derived from URL pathname
  const mode = location.pathname.includes('register')
    ? 'register'
    : location.pathname.includes('forgot')
    ? 'forgot'
    : 'login';

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
    setPassword('');
    setIsShaking(false);
  }, [mode]);

  const triggerShake = () => {
    if (reducedMotion) return;
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 460);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerShake();
      toast.error('Please complete all credentials.');
      return;
    }

    try {
      await login(email, password);
      toast.success('Welcome back to the Atelier');
      navigate('/');
    } catch {
      triggerShake();
      toast.error('Invalid credentials. Please verify your email and password.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      triggerShake();
      toast.error('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      triggerShake();
      toast.error('Password must contain at least 6 characters.');
      return;
    }

    setLocalLoading(true);
    try {
      const { default: api } = await import('../lib/api');
      await api.post('/auth/register', { name, email, password });
      await login(email, password);
      toast.success('Membership activated. Welcome to VOID.');
      navigate('/');
    } catch (err: unknown) {
      triggerShake();
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      triggerShake();
      toast.error('Please enter your email address.');
      return;
    }

    setLocalLoading(true);
    setTimeout(() => {
      setLocalLoading(false);
      setRecoverySent(true);
      toast.success('Recovery link dispatched to your email.');
    }, 600);
  };

  const fillDemoCredentials = () => {
    setEmail('atelier@void.luxury');
    setPassword('atelier2026');
    toast.info('Demo credentials loaded');
  };

  const handleGuestEntry = () => {
    continueAsGuest();
    navigate('/');
  };

  const isLoading = isAuthLoading || localLoading;

  return (
    <main className="w-full h-auto min-h-[100dvh] lg:h-[100dvh] lg:max-h-[100dvh] lg:overflow-hidden flex flex-col lg:flex-row atelier-bg text-ink selection:bg-sienna selection:text-white">
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* LEFT SIDE: Editorial Visual Stage (52%)                           */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="relative w-full lg:w-[52%] h-[36svh] min-h-[240px] lg:h-full overflow-hidden bg-[var(--bone)] shrink-0 flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12">
        {/* Full-bleed high-fashion background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            initial={reducedMotion ? false : { scale: 1.08 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: 2.2, ease: EASE_LUXURY }}
            src="/void_login_hero.png"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2400&q=90';
            }}
            alt="VOID Atelier Avant-Garde Haute Couture"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.08] dark:brightness-[0.78]"
          />
          {/* Dual-tone gradient scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent hidden lg:block" />
          {/* Subtle noise grain */}
          <div
            className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Top Header Layer: Logo & Return Action */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            onClick={handleGuestEntry}
            className="group inline-flex items-baseline gap-1 focus-visible:outline-offset-4"
            aria-label="VOID Atelier Home"
          >
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F1EA] drop-shadow-md group-hover:text-sienna transition-colors">
              <span className="text-sienna font-black">V◆</span>OID
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 ml-2 font-bold hidden sm:inline">
              Atelier
            </span>
          </Link>

          <button
            type="button"
            onClick={handleGuestEntry}
            className="pressable inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F4F1EA] font-mono text-[11px] uppercase tracking-wider hover:bg-white/20 transition-colors focus-visible:outline-offset-2"
          >
            <span>Explore Guest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Hero Layer: Editorial Season Quote & Metadata */}
        <div className="relative z-10 space-y-3 max-w-lg hidden sm:block">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-sienna font-mono text-[10px] tracking-[0.2em] uppercase font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-sienna animate-pulse" />
            Edition IV · Autumn / Winter
          </div>
          <h2
            className="text-xl lg:text-2xl xl:text-3xl font-bold text-[#F4F1EA] leading-tight drop-shadow-md"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Architectural tailoring cut in single-source light.
          </h2>
          <div className="flex items-center gap-4 text-white/60 font-mono text-[10px] tracking-[0.2em] uppercase pt-1">
            <span>50 Numbered Editions</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>Biella Wool & Silk</span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* RIGHT SIDE: Interactive Apple-Style Auth Form Stage (48%)         */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[48%] flex flex-col justify-between px-6 sm:px-10 lg:px-12 xl:px-16 py-6 sm:py-8 lg:py-10 relative z-10 lg:overflow-y-auto">
        <div className="my-auto max-w-md w-full mx-auto space-y-5 sm:space-y-6">
          <motion.div
            animate={
              isShaking
                ? {
                    x: [0, -8, 8, -6, 6, -3, 3, 0],
                    transition: { duration: 0.45, ease: 'easeInOut' },
                  }
                : { x: 0 }
            }
            className="space-y-5 sm:space-y-6"
          >
            {/* Header Title */}
            <div>
              <div className="flex items-center gap-2 text-sienna font-mono text-[10px] tracking-[0.22em] uppercase font-bold mb-1.5">
                <span className="w-4 h-px bg-sienna" />
                <span>{mode === 'login' ? 'Members' : mode === 'register' ? 'Join' : 'Account'}</span>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight text-ink"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {mode === 'login'
                  ? 'Member Access'
                  : mode === 'register'
                  ? 'Atelier Membership'
                  : 'Account Recovery'}
              </h1>
              <p className="text-ink-soft text-xs sm:text-sm mt-1 font-light leading-relaxed">
                {mode === 'login'
                  ? 'Enter your credentials to access your archive and private releases.'
                  : mode === 'register'
                  ? 'Create your membership account to unlock runway allocations.'
                  : 'Enter your email to receive a secure authorization token.'}
              </p>
            </div>

            {/* Segmented Tab Pill Control (Sign In vs Join) */}
            {mode !== 'forgot' && (
              <div className="p-1 rounded-xl bg-[var(--bone)]/80 border border-hairline/80 grid grid-cols-2 gap-1 relative shadow-inner">
                <button
                  type="button"
                  onClick={() => navigate('/auth/login')}
                  className={`relative z-10 py-2 text-xs font-mono tracking-wider uppercase font-bold transition-colors rounded-lg flex items-center justify-center min-h-[36px] ${
                    mode === 'login' ? 'text-ink' : 'text-ink-mute hover:text-ink'
                  }`}
                >
                  {mode === 'login' && (
                    <motion.div
                      layoutId="auth-page-tab-pill"
                      className="absolute inset-0 bg-ivory dark:bg-[#1E1B18] rounded-lg shadow-sm border border-hairline/60 -z-10"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/auth/register')}
                  className={`relative z-10 py-2 text-xs font-mono tracking-wider uppercase font-bold transition-colors rounded-lg flex items-center justify-center min-h-[36px] ${
                    mode === 'register' ? 'text-ink' : 'text-ink-mute hover:text-ink'
                  }`}
                >
                  {mode === 'register' && (
                    <motion.div
                      layoutId="auth-page-tab-pill"
                      className="absolute inset-0 bg-ivory dark:bg-[#1E1B18] rounded-lg shadow-sm border border-hairline/60 -z-10"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  Create Account
                </button>
              </div>
            )}

            {/* Form Bodies */}
            <AnimatePresence mode="wait">
              {mode === 'login' && (
                <motion.form
                  key="login-form-page"
                  initial={reducedMotion ? undefined : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, x: 16 }}
                  transition={{ duration: 0.25, ease: EASE_LUXURY }}
                  onSubmit={handleLoginSubmit}
                  className="space-y-4"
                >
                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="page-login-email"
                      className="block font-mono text-[10px] tracking-[0.2em] uppercase text-ink-mute font-semibold flex items-center gap-1.5"
                    >
                      <Mail className="w-3 h-3 text-sienna" />
                      Email Address
                    </label>
                    <input
                      ref={emailInputRef}
                      id="page-login-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="client@atelier.void"
                      className="w-full bg-[var(--bone)]/50 dark:bg-white/5 border border-hairline rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-mute/50 focus:outline-none focus:border-sienna focus:bg-[var(--bone)]/90 transition-[border-color,background-color] font-body"
                    />
                  </div>

                  {/* Password with Eye toggle */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="page-login-password"
                        className="block font-mono text-[10px] tracking-[0.2em] uppercase text-ink-mute font-semibold flex items-center gap-1.5"
                      >
                        <Lock className="w-3 h-3 text-sienna" />
                        Password
                      </label>
                      <Link
                        to="/auth/forgot-password"
                        className="font-mono text-[10px] uppercase tracking-wider text-sienna hover:underline font-semibold"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        id="page-login-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full bg-[var(--bone)]/50 dark:bg-white/5 border border-hairline rounded-xl pl-3.5 pr-11 py-2.5 text-sm text-ink placeholder:text-ink-mute/50 focus:outline-none focus:border-sienna focus:bg-[var(--bone)]/90 transition-[border-color,background-color] font-body"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ink-mute hover:text-ink transition-colors focus-visible:outline-offset-2"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Quick Autofill Action */}
                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={fillDemoCredentials}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-ink-mute hover:text-sienna transition-colors py-0.5"
                    >
                      <Sparkles className="w-3 h-3 text-sienna" />
                      Autofill Demo Account
                    </button>
                  </div>

                  {/* Submit Action Button */}
                  <div className="pt-2 space-y-2.5">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="pressable btn-island-primary w-full justify-center disabled:opacity-50 min-h-[46px] text-sm"
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

                    <button
                      type="button"
                      onClick={handleGuestEntry}
                      className="w-full text-center font-mono text-[11px] tracking-widest uppercase text-ink-mute hover:text-sienna transition-colors py-2 min-h-[40px] flex items-center justify-center font-semibold"
                    >
                      Continue as Guest →
                    </button>
                  </div>
                </motion.form>
              )}

              {mode === 'register' && (
                <motion.form
                  key="register-form-page"
                  initial={reducedMotion ? undefined : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: EASE_LUXURY }}
                  onSubmit={handleRegisterSubmit}
                  className="space-y-3.5"
                >
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label
                      htmlFor="page-reg-name"
                      className="block font-mono text-[10px] tracking-[0.2em] uppercase text-ink-mute font-semibold flex items-center gap-1.5"
                    >
                      <UserIcon className="w-3 h-3 text-sienna" />
                      Full Name
                    </label>
                    <input
                      ref={emailInputRef}
                      id="page-reg-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Elena Rostova"
                      className="w-full bg-[var(--bone)]/50 dark:bg-white/5 border border-hairline rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-mute/50 focus:outline-none focus:border-sienna focus:bg-[var(--bone)]/90 transition-[border-color,background-color] font-body"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1">
                    <label
                      htmlFor="page-reg-email"
                      className="block font-mono text-[10px] tracking-[0.2em] uppercase text-ink-mute font-semibold flex items-center gap-1.5"
                    >
                      <Mail className="w-3 h-3 text-sienna" />
                      Email Address
                    </label>
                    <input
                      id="page-reg-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="elena@atelier.void"
                      className="w-full bg-[var(--bone)]/50 dark:bg-white/5 border border-hairline rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-mute/50 focus:outline-none focus:border-sienna focus:bg-[var(--bone)]/90 transition-[border-color,background-color] font-body"
                    />
                  </div>

                  {/* Create Password */}
                  <div className="space-y-1">
                    <label
                      htmlFor="page-reg-password"
                      className="block font-mono text-[10px] tracking-[0.2em] uppercase text-ink-mute font-semibold flex items-center gap-1.5"
                    >
                      <Lock className="w-3 h-3 text-sienna" />
                      Create Password
                    </label>
                    <div className="relative">
                      <input
                        id="page-reg-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="Min. 6 characters"
                        className="w-full bg-[var(--bone)]/50 dark:bg-white/5 border border-hairline rounded-xl pl-3.5 pr-11 py-2.5 text-sm text-ink placeholder:text-ink-mute/50 focus:outline-none focus:border-sienna focus:bg-[var(--bone)]/90 transition-[border-color,background-color] font-body"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ink-mute hover:text-ink transition-colors focus-visible:outline-offset-2"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Register Button */}
                  <div className="pt-2 space-y-2.5">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="pressable btn-island-primary w-full justify-center disabled:opacity-50 min-h-[46px] text-sm"
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

                    <button
                      type="button"
                      onClick={handleGuestEntry}
                      className="w-full text-center font-mono text-[11px] tracking-widest uppercase text-ink-mute hover:text-sienna transition-colors py-2 min-h-[40px] flex items-center justify-center font-semibold"
                    >
                      Continue as Guest →
                    </button>
                  </div>
                </motion.form>
              )}

              {mode === 'forgot' && (
                <motion.div
                  key="forgot-form-page"
                  initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: EASE_LUXURY }}
                >
                  {recoverySent ? (
                    <div className="text-center py-4 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-sienna/10 text-sienna mx-auto flex items-center justify-center">
                        <Check className="w-6 h-6" />
                      </div>
                      <div>
                        <h3
                          className="text-xl font-bold text-ink"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          Recovery Dispatched
                        </h3>
                        <p className="text-xs text-ink-soft mt-1.5 leading-relaxed max-w-[32ch] mx-auto font-light">
                          If an account is associated with <span className="font-semibold text-ink">{email}</span>, a secure one-time authorization link is en route.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setRecoverySent(false);
                          navigate('/auth/login');
                        }}
                        className="pressable btn-island-ghost w-full justify-center mt-3"
                      >
                        Return to Member Sign In
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="page-forgot-email"
                          className="block font-mono text-[10px] tracking-[0.2em] uppercase text-ink-mute font-semibold flex items-center gap-1.5"
                        >
                          <Mail className="w-3 h-3 text-sienna" />
                          Registered Email
                        </label>
                        <input
                          ref={emailInputRef}
                          id="page-forgot-email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="client@atelier.void"
                          className="w-full bg-[var(--bone)]/50 dark:bg-white/5 border border-hairline rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-mute/50 focus:outline-none focus:border-sienna focus:bg-[var(--bone)]/90 transition-[border-color,background-color] font-body"
                        />
                      </div>

                      <div className="pt-2 space-y-2.5">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="pressable btn-island-primary w-full justify-center disabled:opacity-50 min-h-[46px] text-sm"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              Dispatching Token...
                            </span>
                          ) : (
                            <span>Send Recovery Link</span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate('/auth/login')}
                          className="w-full inline-flex items-center justify-center gap-2 text-center font-mono text-[11px] tracking-wider uppercase text-ink-mute hover:text-ink transition-colors py-2"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          Return to Sign In
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Security & Concierge Guarantee Footer */}
        <div className="pt-4 border-t border-hairline/60 flex items-center justify-between text-[11px] font-mono text-ink-mute shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sienna" />
            <span>TLS 1.3 · 256-Bit Session</span>
          </div>
          <Link to="/contact" className="hover:text-ink transition-colors">
            Concierge ↗
          </Link>
        </div>
      </div>
    </main>
  );
}
