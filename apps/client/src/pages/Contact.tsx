import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowUpRight, Check, MapPin, Clock, Phone } from 'lucide-react';
import { toast } from 'sonner';

const INQUIRY_TYPES = [
  'Order Inquiry',
  'Custom Commission',
  'Press & Media',
  'Concierge Services',
  'General Inquiry',
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: INQUIRY_TYPES[0],
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    // Simulate async submission
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);
    setSent(true);
    toast.success('Your message has been received by the atelier.');
    setForm({ name: '', email: '', subject: INQUIRY_TYPES[0], message: '' });
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <div className="min-h-[100dvh] atelier-bg text-ink px-6 md:px-12 py-32 md:py-40 flex items-center justify-center selection:bg-sienna/30 selection:text-sienna">
      {/* Background ambient light */}
      <div className="fixed top-0 right-0 w-[40vw] h-[40vw] bg-[rgba(var(--sienna-rgb),0.05)] rounded-full blur-[140px] pointer-events-none translate-x-1/3 -translate-y-1/4" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative z-10">
        
        {/* Left Column: Brand Context */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-sienna"></div>
              <span className="atelier-eyebrow text-sienna/80 uppercase tracking-widest text-xs font-medium">
                Concierge & Inquiries
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-[5rem] tracking-tighter leading-[0.9] mb-8">
              Speak<br />
              With<br />
              <span className="italic font-light text-ink/80">The Atelier.</span>
            </h1>

            <p className="text-base md:text-lg text-ink-mute max-w-sm font-light leading-relaxed mb-16">
              Our concierge team is available for order inquiries, custom commissions, private styling, and press requests.
            </p>
          </div>

          <div className="flex flex-col gap-8 border-t border-hairline pt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <p className="atelier-eyebrow text-ink/40 mb-2">Flagship</p>
                <p className="font-display text-lg inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sienna shrink-0" />
                  Tokyo & Milan
                </p>
                <p className="text-xs text-ink-mute mt-1">By appointment only</p>
              </div>

              <div>
                <p className="atelier-eyebrow text-ink/40 mb-2">Hours</p>
                <p className="font-display text-lg inline-flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sienna shrink-0" />
                  Mon – Sat
                </p>
                <p className="text-xs text-ink-mute mt-1">10:00 AM – 7:00 PM JST</p>
              </div>
            </div>

            <div>
              <p className="atelier-eyebrow text-ink/40 mb-2">Email</p>
              <a href="mailto:concierge@voidatelier.com" className="font-display text-base sm:text-lg break-all hover:text-sienna transition-colors group inline-flex items-center gap-2">
                concierge@voidatelier.com
                <ArrowUpRight className="w-4 h-4 shrink-0 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-[opacity,transform] duration-300 ease-out" />
              </a>
              <p className="text-xs text-ink-mute mt-1">Response within 24 hours</p>
            </div>
          </div>
        </div>

        {/* Right Column: Form Card */}
        <div className="lg:col-span-7">
          <div className="atelier-card rounded-[2rem] p-8 sm:p-12 md:p-14">
            
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                >
                  <div className="w-20 h-20 rounded-full bg-sienna/10 text-sienna flex items-center justify-center mb-8 border border-sienna/20 shadow-[0_0_40px_rgba(var(--sienna-rgb),0.15)]">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-3xl mb-4 tracking-tight">Message Received</h3>
                  <p className="text-ink-mute max-w-sm mx-auto leading-relaxed">
                    Thank you. Our concierge team will review your inquiry and respond within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form 
                  onSubmit={handleSubmit} 
                  className="flex flex-col gap-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-ink-mute">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        placeholder="e.g. Jane Doe"
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="atelier-input"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-ink-mute">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        placeholder="jane@example.com"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="atelier-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wider text-ink-mute">
                      Inquiry Type
                    </label>
                    <select
                      id="subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="atelier-select"
                    >
                      {INQUIRY_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[var(--ivory)] text-ink">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-ink-mute">
                      How may we assist you?
                    </label>
                    <textarea
                      id="message"
                      value={form.message}
                      placeholder="Share details about your inquiry, custom order, or press request..."
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={4}
                      className="atelier-input resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-island-primary w-full justify-center mt-2"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Sending</span>
                      </div>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}