import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ShieldCheck, Truck, Check, Calendar, User, Mail } from 'lucide-react';
import { toast } from 'sonner';

export type ServiceType = 'styling' | 'editions' | 'logistics' | null;

interface AtelierServicesDrawerProps {
  service: ServiceType;
  onClose: () => void;
}

export function AtelierServicesDrawer({ service, onClose }: AtelierServicesDrawerProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [serialInput, setSerialInput] = useState('');
  const [verifiedResult, setVerifiedResult] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!service) return null;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Please enter your name and email.');
      return;
    }
    setSubmitted(true);
    toast.success('Your private atelier consultation request has been received.');
  };

  const handleVerifySerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialInput.trim()) {
      toast.error('Please enter an edition serial number (e.g., VOID-2026-042).');
      return;
    }
    setVerifiedResult(`Verified: Edition ${serialInput.toUpperCase()} · Certified Authentic Archival Piece.`);
    toast.success('Certificate Authenticated.');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Scrim Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 atelier-scrim cursor-pointer"
        />

        {/* Sliding Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 32 }}
          className="relative w-full max-w-lg h-full atelier-bg-deep border-l border-hairline shadow-2xl p-6 md:p-10 flex flex-col justify-between overflow-y-auto z-10"
        >
          <div>
            {/* Header row */}
            <div className="flex items-center justify-between pb-6 border-b border-hairline">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sienna animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-ink-mute font-bold">
                  Atelier Concierge Service
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close service details"
                className="w-10 h-10 rounded-full border border-hairline flex items-center justify-center text-ink-mute hover:text-ink hover:bg-bone transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Service Specific Content */}
            <div className="py-8">
              {service === 'styling' && (
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-sienna/10 border border-sienna/20 flex items-center justify-center text-sienna">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-ink">
                    Private Wardrobe Styling
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed">
                    Bespoke, private consultation with our master pattern makers in Tokyo and Milan. We curate complete seasonal capsules tailored to your structural dimensions.
                  </p>

                  {submitted ? (
                    <div className="p-6 rounded-2xl bg-sienna/10 border border-sienna/30 text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-sienna text-white flex items-center justify-center mx-auto">
                        <Check className="w-5 h-5" />
                      </div>
                      <h4 className="font-display text-lg font-bold text-ink">Consultation Requested</h4>
                      <p className="text-xs text-ink-soft">
                        Our head concierge will contact you at {email} within 12 hours with scheduling options.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleBooking} className="space-y-4 pt-2">
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-ink-mute mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Lord / Lady / Name"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-bone/50 border border-hairline text-ink text-sm focus:outline-none focus:border-sienna transition-colors"
                          />
                          <User className="w-4 h-4 text-ink-mute absolute left-3.5 top-3.5" />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-ink-mute mb-1">
                          Direct Contact Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="patron@domain.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-bone/50 border border-hairline text-ink text-sm focus:outline-none focus:border-sienna transition-colors"
                          />
                          <Mail className="w-4 h-4 text-ink-mute absolute left-3.5 top-3.5" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-full bg-ink text-ivory font-mono text-xs uppercase tracking-widest font-bold hover:bg-sienna hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Request Private Appointment</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {service === 'editions' && (
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-sienna/10 border border-sienna/20 flex items-center justify-center text-sienna">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-ink">
                    Archival Ledger Verification
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed">
                    Verify the authenticity, release ledger, and ownership history of any serialized VOID garment or timepiece.
                  </p>

                  <form onSubmit={handleVerifySerial} className="space-y-4 pt-2">
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-ink-mute mb-1">
                        Serial Number or NFC Hash
                      </label>
                      <input
                        type="text"
                        value={serialInput}
                        onChange={(e) => setSerialInput(e.target.value)}
                        placeholder="e.g. VOID-2026-ED04-019"
                        className="w-full px-4 py-3 rounded-xl bg-bone/50 border border-hairline text-ink text-sm font-mono focus:outline-none focus:border-sienna transition-colors uppercase"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-ink text-ivory font-mono text-xs uppercase tracking-widest font-bold hover:bg-sienna hover:text-white transition-colors duration-300"
                    >
                      Verify Authenticity Certificate
                    </button>
                  </form>

                  {verifiedResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono text-xs leading-relaxed"
                    >
                      {verifiedResult}
                    </motion.div>
                  )}
                </div>
              )}

              {service === 'logistics' && (
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-sienna/10 border border-sienna/20 flex items-center justify-center text-sienna">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-ink">
                    White-Glove Concierge Logistics
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed">
                    Sub-48h global delivery with climate-controlled packaging, complimentary bespoke garment cases, and scheduled door-to-wardrobe handoff.
                  </p>

                  <div className="space-y-3 pt-2">
                    {[
                      { title: 'Sub-48h Global Courier', desc: 'Direct air transport to 64 countries with live tracking telemetry.' },
                      { title: 'Archival Dust Protection', desc: 'Custom cedar-infused cotton garment bags and serial authentication certificate.' },
                      { title: 'On-Demand Doorstep Tailor', desc: 'Complimentary hem and drape adjustments on delivery.' },
                    ].map((feature) => (
                      <div key={feature.title} className="p-4 rounded-xl bg-bone/50 border border-hairline flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-sienna/20 text-sienna flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-display text-xs font-bold text-ink">{feature.title}</h4>
                          <p className="text-[11px] text-ink-mute mt-0.5">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-hairline flex items-center justify-between text-xs text-ink-mute font-mono">
            <span>Direct Atelier Hotline: +1 (800) VOID-NYC</span>
            <button
              type="button"
              onClick={onClose}
              className="text-sienna hover:underline font-bold"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
