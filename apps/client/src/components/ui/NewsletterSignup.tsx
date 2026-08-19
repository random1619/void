import { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Prominent newsletter capture used in the home-page CTA band.
 * Mirrors the footer's subscribe behaviour (validate + simulated submit +
 * toast) but renders a large, boxed input + button suited to a feature band.
 */
export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address');
      toast.error('Please enter your email address');
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError('Please enter a valid email address');
      toast.error('Please enter a valid email address');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    // Simulated API call — swap for a real endpoint when wiring the backend.
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      toast.success('Welcome to the VOID Atelier Insider List.');
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto" noValidate>
      <label htmlFor="newsletter-email-feature" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col sm:flex-row glass-refraction rounded-lg overflow-hidden focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus-within:-translate-y-0.5 transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
        <input
          id="newsletter-email-feature"
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }}
          placeholder="ENTER YOUR EMAIL"
          autoComplete="email"
          aria-invalid={!!error}
          aria-describedby={error ? 'newsletter-help' : undefined}
          className="flex-1 bg-transparent border-0 text-ink font-label-caps text-xs py-4 px-5 placeholder-ink-mute/50 focus:outline-none focus:ring-0 tracking-wider"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label={isSubmitting ? 'Submitting' : subscribed ? 'Subscribed' : 'Subscribe to newsletter'}
          className="atelier-btn flex items-center justify-center min-w-[140px] gap-2 border-0 border-t sm:border-t-0 sm:border-l border-white/20 rounded-none disabled:opacity-50 disabled:cursor-not-allowed pressable"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isSubmitting ? (
              <motion.div key="submitting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              </motion.div>
            ) : subscribed ? (
              <motion.div key="subscribed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center justify-center text-ivory">
                <Check className="w-4 h-4" aria-hidden="true" />
              </motion.div>
            ) : (
              <motion.div key="default" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center justify-center gap-2">
                Subscribe <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
      {error && (
        <p id="newsletter-help" role="alert" className="text-sienna text-xs mt-2 font-label-caps tracking-wider">
          {error}
        </p>
      )}
    </form>
  );
}
