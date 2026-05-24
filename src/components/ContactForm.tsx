'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// CONSTANTS
// ============================================================================
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_FORM_ID}`
  : null;

const EASE = [0.16, 1, 0.3, 1] as const;

const BUDGET_OPTIONS = [
  'Under $5k',
  '$5k – $15k',
  '$15k – $40k',
  '$40k – $80k',
  '$80k+',
  'Not sure yet',
];

const SERVICE_OPTIONS = [
  'Web Design',
  'Web Development',
  'Mobile App',
  'Brand Identity',
  'SEO & Performance',
  'Ongoing Retainer',
];

const TIMELINE_OPTIONS = [
  'ASAP',
  '1 – 2 months',
  '3 – 4 months',
  '5 – 6 months',
  'Flexible',
];

// ============================================================================
// THEME-AWARE CONTACT FORM
// Uses CSS variables from your global CSS for perfect theme integration
// ============================================================================
export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedTimeline, setSelectedTimeline] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const toggleService = (s: string) =>
    setSelectedServices(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FORMSPREE_ENDPOINT) { setStatus('error'); return; }
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    formData.set('services', selectedServices.join(', '));
    formData.set('budget', selectedBudget);
    formData.set('timeline', selectedTimeline);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST', body: formData,
        headers: { Accept: 'application/json' },
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) {
        e.currentTarget.reset();
        setSelectedServices([]);
        setSelectedBudget('');
        setSelectedTimeline('');
      }
    } catch { setStatus('error'); }
  }

  // ── Success State ──
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full max-w-2xl mx-auto px-8 py-16 rounded-3xl"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
        }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div 
            className="w-16 h-16 rounded-full grid place-items-center mb-8"
            style={{ background: 'var(--lime)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="var(--on-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          
          <h3 
            className="text-4xl md:text-5xl mb-5" 
            style={{ 
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              color: 'var(--heading-color)',
              lineHeight: 1.1 
            }}
          >
            Message received.
          </h3>
          
          <p className="text-base md:text-lg leading-relaxed max-w-md" 
             style={{ color: 'var(--body-color)' }}>
            We review every inquiry personally and will be in touch within one business day.
            In the meantime, feel free to browse our{' '}
            <a href="#work" className="underline decoration-1 underline-offset-4" style={{ color: 'var(--lime)' }}>recent work</a>.
          </p>
        </div>
      </motion.div>
    );
  }

  // ── Form State ──
  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto px-4 md:px-8"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {/* Section: Services */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-4">
          <label 
            className="text-[11px] tracking-[0.25em] uppercase font-semibold"
            style={{ 
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            WHAT DO YOU NEED?
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          {SERVICE_OPTIONS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => toggleService(s)}
              className="px-5 py-2.5 rounded-full text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-200"
              style={{
                border: `1px solid ${selectedServices.includes(s) ? 'var(--lime)' : 'var(--nav-border)'}`,
                background: selectedServices.includes(s) ? 'var(--lime)' : 'var(--chip-bg)',
                color: selectedServices.includes(s) ? 'var(--on-lime)' : 'var(--chip-text)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!selectedServices.includes(s)) {
                  e.currentTarget.style.background = 'var(--surface-raised)';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedServices.includes(s)) {
                  e.currentTarget.style.background = 'var(--chip-bg)';
                }
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <input type="hidden" name="services" value={selectedServices.join(', ')} />
      </div>

      {/* Section: Budget */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-4">
          <label 
            className="text-[11px] tracking-[0.25em] uppercase font-semibold"
            style={{ 
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            APPROXIMATE BUDGET
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          {BUDGET_OPTIONS.map(b => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBudget(b)}
              className="px-5 py-2.5 rounded-full text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-200"
              style={{
                border: `1px solid ${selectedBudget === b ? 'var(--lime)' : 'var(--nav-border)'}`,
                background: selectedBudget === b ? 'var(--lime)' : 'var(--chip-bg)',
                color: selectedBudget === b ? 'var(--on-lime)' : 'var(--chip-text)',
                cursor: 'pointer',
              }}
            >
              {b}
            </button>
          ))}
        </div>
        <input type="hidden" name="budget" value={selectedBudget} />
      </div>

      {/* Section: Timeline */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-4">
          <label 
            className="text-[11px] tracking-[0.25em] uppercase font-semibold"
            style={{ 
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            IDEAL TIMELINE
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          {TIMELINE_OPTIONS.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTimeline(t)}
              className="px-5 py-2.5 rounded-full text-[11px] tracking-[0.15em] uppercase font-medium transition-all duration-200"
              style={{
                border: `1px solid ${selectedTimeline === t ? 'var(--lime)' : 'var(--nav-border)'}`,
                background: selectedTimeline === t ? 'var(--lime)' : 'var(--chip-bg)',
                color: selectedTimeline === t ? 'var(--on-lime)' : 'var(--chip-text)',
                cursor: 'pointer',
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <input type="hidden" name="timeline" value={selectedTimeline} />
      </div>

      {/* Section: Name */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-2">
          <label 
            htmlFor="name"
            className="text-[11px] tracking-[0.25em] uppercase font-semibold"
            style={{ 
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            YOUR NAME
          </label>
        </div>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Jane Smith"
          required
          className="w-full mt-3 px-5 py-3.5 rounded-xl outline-none transition-all duration-200"
          style={{
            background: 'var(--input-bg)',
            border: `1px solid ${focusedField === 'name' ? 'var(--lime)' : 'var(--input-border)'}`,
            color: 'var(--heading-color)',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-body)',
          }}
          onFocus={() => setFocusedField('name')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      {/* Section: Email */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-2">
          <label 
            htmlFor="email"
            className="text-[11px] tracking-[0.25em] uppercase font-semibold"
            style={{ 
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            WORK EMAIL
          </label>
        </div>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="jane@company.com"
          required
          className="w-full mt-3 px-5 py-3.5 rounded-xl outline-none transition-all duration-200"
          style={{
            background: 'var(--input-bg)',
            border: `1px solid ${focusedField === 'email' ? 'var(--lime)' : 'var(--input-border)'}`,
            color: 'var(--heading-color)',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-body)',
          }}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      {/* Section: Company (optional) */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-2">
          <label 
            htmlFor="company"
            className="text-[11px] tracking-[0.25em] uppercase font-semibold"
            style={{ 
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            COMPANY / PRODUCT
          </label>
          <span 
            className="text-[11px] tracking-[0.12em]"
            style={{ color: 'var(--text-faint)' }}
          >
            optional
          </span>
        </div>
        <input
          id="company"
          name="company"
          type="text"
          placeholder="Acme Inc."
          className="w-full mt-3 px-5 py-3.5 rounded-xl outline-none transition-all duration-200"
          style={{
            background: 'var(--input-bg)',
            border: `1px solid ${focusedField === 'company' ? 'var(--lime)' : 'var(--input-border)'}`,
            color: 'var(--heading-color)',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-body)',
          }}
          onFocus={() => setFocusedField('company')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      {/* Section: Message */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-2">
          <label 
            htmlFor="message"
            className="text-[11px] tracking-[0.25em] uppercase font-semibold"
            style={{ 
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            PROJECT DETAILS
          </label>
        </div>
        <textarea
          id="message"
          name="message"
          placeholder="Describe your product, goals, any existing work, and anything else we should know."
          required
          rows={6}
          className="w-full mt-3 px-5 py-3.5 rounded-xl outline-none transition-all duration-200 resize-none"
          style={{
            background: 'var(--input-bg)',
            border: `1px solid ${focusedField === 'message' ? 'var(--lime)' : 'var(--input-border)'}`,
            color: 'var(--heading-color)',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.6,
          }}
          onFocus={() => setFocusedField('message')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      {/* Section: Referral (optional) */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-2">
          <label 
            htmlFor="referral"
            className="text-[11px] tracking-[0.25em] uppercase font-semibold"
            style={{ 
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            HOW DID YOU FIND US?
          </label>
          <span 
            className="text-[11px] tracking-[0.12em]"
            style={{ color: 'var(--text-faint)' }}
          >
            optional
          </span>
        </div>
        <input
          id="referral"
          name="referral"
          type="text"
          placeholder="Google, referral, Twitter, etc."
          className="w-full mt-3 px-5 py-3.5 rounded-xl outline-none transition-all duration-200"
          style={{
            background: 'var(--input-bg)',
            border: `1px solid ${focusedField === 'referral' ? 'var(--lime)' : 'var(--input-border)'}`,
            color: 'var(--heading-color)',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-body)',
          }}
          onFocus={() => setFocusedField('referral')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      {/* Submit Section */}
      <div className="mt-14 pt-8 border-t" style={{ borderColor: 'var(--card-border)' }}>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-xs tracking-[0.25em] uppercase font-semibold transition-all duration-200"
          style={{
            background: status === 'loading' ? 'var(--chip-bg)' : 'var(--lime)',
            color: status === 'loading' ? 'var(--chip-text)' : 'var(--on-lime)',
            border: 'none',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          }}
        >
          {status === 'loading' ? (
            <>
              <SpinnerIcon />
              Sending...
            </>
          ) : (
            'Send message →'
          )}
        </button>

        <p className="mt-6 text-xs leading-relaxed" style={{ color: 'var(--text-faint)' }}>
          No spam, no hard sell. We respond to every inquiry.
        </p>
      </div>

      {/* Error State */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 text-sm leading-relaxed"
            style={{ color: 'var(--destructive)' }}
          >
            {FORMSPREE_ENDPOINT ? (
              <>Something went wrong — email us directly at{' '}
                <a href="mailto:hello@builtstack.co"
                  className="underline decoration-1 underline-offset-4"
                  style={{ color: 'var(--heading-color)' }}>
                  hello@builtstack.co
                </a>.</>
            ) : (
              <>Form not configured. Set <code className="text-xs" style={{ color: 'var(--lime)' }}>VITE_FORMSPREE_FORM_ID</code> or email{' '}
                <a href="mailto:hello@builtstack.co"
                  className="underline decoration-1 underline-offset-4"
                  style={{ color: 'var(--heading-color)' }}>
                  hello@builtstack.co
                </a>.</>
            )}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  );
}

// Spinner Icon
function SpinnerIcon() {
  return (
    <motion.svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </motion.svg>
  );
}