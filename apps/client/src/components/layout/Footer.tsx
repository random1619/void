import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '../ui/ThemeToggle';
import { BrandLogo } from '../ui/BrandLogo';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Welcome to the VOID Atelier Insider List.');
    setEmail('');
  };

  return (
    <footer
      aria-label="Site footer"
      className="w-full atelier-bg-deep border-t border-hairline text-ink-mute relative z-content overflow-hidden"
    >
      {/* Top Footer Banner */}
      <div className="container-void py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 flex flex-col justify-between space-y-6">
          <div>
            <div className="mb-4">
              <BrandLogo size="lg" />
            </div>
            <p className="text-sm text-ink-mute leading-relaxed max-w-xs font-light">
              Architectural silhouettes and avant-garde luxury fashion engineered with obsessive Japanese and Italian craftsmanship.
            </p>
          </div>

          <p className="text-xs text-ink-mute font-light">
            © {new Date().getFullYear()} VOID Atelier. All rights reserved.
          </p>
        </div>

        <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-3">
            <span className="atelier-eyebrow text-ink mb-1">Collections</span>
            <Link to="/products" className="link-sweep w-fit text-xs text-ink-mute">All Garments</Link>
            <Link to="/collections/atelier" className="link-sweep w-fit text-xs text-ink-mute">Haute Couture</Link>
            <Link to="/collections/outerwear" className="link-sweep w-fit text-xs text-ink-mute">Future Streetwear</Link>
            <Link to="/collections/footwear" className="link-sweep w-fit text-xs text-ink-mute">Sculptural Objects</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <span className="atelier-eyebrow text-ink mb-1">Atelier</span>
            <Link to="/about" className="link-sweep w-fit text-xs text-ink-mute">Our Story</Link>
            <Link to="/heritage" className="link-sweep w-fit text-xs text-ink-mute">Heritage</Link>
            <Link to="/craft-atelier" className="link-sweep w-fit text-xs text-ink-mute">Craft Atelier</Link>
            <Link to="/materials" className="link-sweep w-fit text-xs text-ink-mute">Materials Archive</Link>
            <Link to="/the-journey" className="link-sweep w-fit text-xs text-ink-mute">The Journey</Link>
            <Link to="/collections" className="link-sweep w-fit text-xs text-ink-mute">Past Seasons</Link>
            <Link to="/new-arrivals" className="link-sweep w-fit text-xs text-ink-mute">New Arrivals</Link>
            <Link to="/stores" className="link-sweep w-fit text-xs text-ink-mute">The Maisons</Link>
            <Link to="/maisons" className="link-sweep w-fit text-xs text-ink-mute">Flagship Maisons</Link>
            <Link to="/loyalty" className="link-sweep w-fit text-xs text-ink-mute">Loyalty Program</Link>
            <Link to="/gift-cards" className="link-sweep w-fit text-xs text-ink-mute">Gift Cards</Link>
            <Link to="/contact" className="link-sweep w-fit text-xs text-ink-mute">Contact</Link>
            <Link to="/faq" className="link-sweep w-fit text-xs text-ink-mute">FAQ</Link>
          </div>

          <div className="col-span-2 flex flex-col justify-between space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <span className="atelier-eyebrow text-ink mb-1 block">Newsletter</span>
              <form onSubmit={handleSubscribe} className="relative w-full">
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL"
                  autoComplete="email"
                  className="w-full bg-transparent border-b border-hairline text-ink font-label-caps text-xs py-2 pr-10 focus:outline-none focus:border-sienna placeholder-ink-mute/50 transition-colors"
                />
                <button
                  type="submit"
                  className="pressable absolute right-0 top-1/2 -translate-y-1/2 min-w-11 min-h-11 flex items-center justify-center text-sienna hover:text-ink transition-colors focus-visible:outline-offset-2"
                  title="Subscribe"
                  aria-label="Subscribe to newsletter"
                >
                  {subscribed ? (
                    <span role="status" aria-label="Subscribed">
                      <Check className="w-4 h-4 text-sienna" aria-hidden="true" />
                    </span>
                  ) : (
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </form>
            </motion.div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-hairline/60">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-widest text-ink-mute">
                <Link to="/privacy" className="link-sweep w-fit">Privacy Policy</Link>
                <Link to="/terms" className="link-sweep w-fit">Terms of Service</Link>
                <Link to="/shipping" className="link-sweep w-fit">Shipping & Returns</Link>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle showLabel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}