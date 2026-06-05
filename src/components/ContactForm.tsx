'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── CONSTANTS ──────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;
type EaseTuple = readonly [number, number, number, number];

const BUDGET_OPTIONS = [
  'Under $5k', '$5k – $15k', '$15k – $40k',
  '$40k – $80k', '$80k+', 'Not sure yet',
];

const SERVICE_OPTIONS = [
  'Web Design', 'Web Development', 'Mobile App',
  'Brand Identity', 'SEO & Performance', 'Ongoing Retainer',
];

const TIMELINE_OPTIONS = [
  'ASAP', '1 – 2 months', '3 – 4 months', '5 – 6 months', 'Flexible',
];

const TECH_OPTIONS = [
  'Next.js / React', 'Shopify / E-Commerce', 'Webflow / Custom CMS',
  'Full-stack SaaS App', 'Mobile App (iOS/Android)', 'Other / Unsure',
];

const INTEGRATION_OPTIONS = [
  'Stripe Payments', 'User Authentication', 'Admin Dashboard',
  'Custom Database', 'Analytics & Tracking', 'Multilingual Support',
];

const STEP_LABELS = ['Project Scope', 'Project Vision', 'Client Profile', 'Proposal Review'];

// ── TYPES ──────────────────────────────────────────────────
type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormState {
  // Step 1
  selectedServices: string[];
  selectedBudget: string;
  selectedTimeline: string;
  // Step 2
  projectMessage: string;
  selectedTech: string;
  selectedIntegrations: string[];
  // Step 3
  name: string;
  email: string;
  company: string;
  referral: string;
}

const INITIAL_FORM: FormState = {
  selectedServices: [],
  selectedBudget: '',
  selectedTimeline: '',
  projectMessage: '',
  selectedTech: '',
  selectedIntegrations: [],
  name: '',
  email: '',
  company: '',
  referral: '',
};

// ── SUB-COMPONENTS ─────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4
      className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-4"
      style={{ color: 'var(--text-muted)' }}
    >
      {children}
    </h4>
  );
}

function ChipButton({
  label,
  selected,
  onClick,
  variant = 'default',
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  variant?: 'default' | 'pill' | 'compact';
}) {
  const base =
    'transition-colors duration-150 font-semibold uppercase tracking-[0.13em] cursor-pointer text-left';

  const sizes: Record<string, string> = {
    default: 'px-5 py-4 rounded-xl text-[11px]',
    pill: 'px-4 py-2.5 rounded-full text-[10px]',
    compact: 'px-3 py-3 rounded-lg text-[10px]',
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onClick}
      className={`${base} ${sizes[variant]}`}
      style={{
        border: `1.5px solid ${selected ? 'var(--lime)' : 'var(--input-border)'}`,
        background: selected ? 'var(--glow-lime)' : 'var(--input-bg)',
        color: selected ? 'var(--lime)' : 'var(--heading-color)',
        boxShadow: selected ? '0 0 10px var(--glow-subtle)' : 'none',
      }}
    >
      {label}
    </button>
  );
}

function StyledInput({
  id,
  label,
  optional,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  required,
  focused,
  onFocus,
  onBlur,
}: {
  id: string;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-baseline mb-3">
        <label
          htmlFor={id}
          className="text-[10px] tracking-[0.2em] uppercase font-bold"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </label>
        {optional && (
          <span className="text-[9px] tracking-[0.1em]" style={{ color: 'var(--text-faint)' }}>
            optional
          </span>
        )}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full px-5 py-3.5 rounded-xl outline-none transition-colors duration-150"
        style={{
          background: 'var(--input-bg)',
          border: `1px solid ${focused ? 'var(--lime)' : 'var(--input-border)'}`,
          color: 'var(--heading-color)',
          fontSize: '0.92rem',
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}

// ── SPINNER ────────────────────────────────────────────────
function SpinnerIcon() {
  return (
    <motion.svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </motion.svg>
  );
}

// ── SUCCESS SCREEN ─────────────────────────────────────────
function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, ease: EASE as EaseTuple }}
      className="w-full max-w-2xl mx-auto px-8 py-16 rounded-3xl text-center relative overflow-hidden"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
      role="status"
      aria-live="polite"
    >
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-16 h-16 rounded-full grid place-items-center mb-8"
          style={{ background: 'var(--lime)', boxShadow: '0 0 24px var(--glow-lime)' }}
          aria-hidden="true"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="var(--on-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>

        <h3
          className="text-4xl md:text-5xl mb-4"
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--heading-color)', lineHeight: 1.1 }}
        >
          Gmail is open.
        </h3>

        <p className="text-base leading-relaxed max-w-md mb-3" style={{ color: 'var(--body-color)' }}>
          Your brief has been{' '}
          <strong style={{ color: 'var(--lime)' }}>copied to clipboard</strong> and Gmail compose
          is now open. Just hit <strong>Send</strong> in the Gmail tab.
        </p>

        <p className="text-xs mb-8" style={{ color: 'var(--text-faint)' }}>
          Gmail tab didn&apos;t open?{' '}
          <button
            type="button"
            onClick={onReset}
            className="underline underline-offset-2"
            style={{ color: 'var(--lime)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Go back and try again.
          </button>
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="px-6 py-2.5 rounded-full text-[11px] tracking-[0.2em] uppercase font-semibold"
          style={{ background: 'transparent', border: '1px solid var(--lime)', color: 'var(--lime)', cursor: 'pointer' }}
        >
          Submit Another Inquiry
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────
export default function ContactForm() {
  const [step, setStep] = useState(1);
  const [snackbar, setSnackbar] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // ── helpers ──────────────────────────────────────────────
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setValidationError(null);
  };

  const toggleArray = (key: 'selectedServices' | 'selectedIntegrations', value: string) => {
    setForm(prev => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value],
      };
    });
    setValidationError(null);
  };

  const resetForm = useCallback(() => {
    setStatus('idle');
    setStep(1);
    setForm(INITIAL_FORM);
    setValidationError(null);
  }, []);

  // ── validation ───────────────────────────────────────────
  const validateStep = useCallback((s: number): boolean => {
    const { selectedServices, selectedBudget, selectedTimeline, projectMessage, selectedTech, name, email } = form;

    if (s === 1) {
      if (!selectedServices.length) return (setValidationError('Please select at least one service.'), false);
      if (!selectedBudget) return (setValidationError('Please select a budget range.'), false);
      if (!selectedTimeline) return (setValidationError('Please select a project timeline.'), false);
    }
    if (s === 2) {
      if (projectMessage.trim().length < 10) return (setValidationError('Please describe your project goals (min. 10 characters).'), false);
      if (!selectedTech) return (setValidationError('Please choose a tech stack preference.'), false);
    }
    if (s === 3) {
      if (!name.trim()) return (setValidationError('Please enter your name.'), false);
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return (setValidationError('Please enter a valid email address.'), false);
    }

    setValidationError(null);
    return true;
  }, [form]);

  const handleNext = useCallback(() => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, 4));
  }, [step, validateStep]);

  const handleBack = useCallback(() => {
    setValidationError(null);
    setStep(s => Math.max(s - 1, 1));
  }, []);

  // ── keyboard shortcut ─────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey && step < 4) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, handleNext]);

  // ── submit ───────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (![1, 2, 3].every(s => validateStep(s))) return;

    setStatus('loading');

    const { name, email, company, referral, selectedServices, selectedBudget,
      selectedTimeline, selectedTech, selectedIntegrations, projectMessage } = form;

    const docketId = `BSTK-${(name.slice(0, 2) + selectedBudget.slice(-3)).toUpperCase()}`;

    const brief = [
      `PROJECT BRIEF — ${docketId}`,
      '',
      'CLIENT DETAILS',
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || 'Not specified'}`,
      `Referral: ${referral || 'Not specified'}`,
      '',
      'PROJECT SCOPE',
      `Services: ${selectedServices.join(', ')}`,
      `Budget: ${selectedBudget}`,
      `Timeline: ${selectedTimeline}`,
      '',
      'TECHNICAL REQUIREMENTS',
      `Tech Stack: ${selectedTech}`,
      `Integrations: ${selectedIntegrations.join(', ') || 'None specified'}`,
      '',
      'PROJECT GOALS',
      `"${projectMessage}"`,
      '',
      'Sent via BuiltStack Contact Form',
    ].join('\n');

    try { await navigator.clipboard.writeText(brief); } catch { /* silent */ }

    const subject = encodeURIComponent(`[BuiltStack Brief] ${selectedServices[0]} — ${name} — ${selectedBudget}`);
    const body = encodeURIComponent(brief);
    window.open(`https://mail.google.com/mail/?view=cm&to=builtstack@gmail.com&su=${subject}&body=${body}`, '_blank');

    setStatus('success');
    setSnackbar(true);
    setTimeout(() => setSnackbar(false), 4000);
  }

  // ── early return: success ─────────────────────────────────
  if (status === 'success') return <SuccessScreen onReset={resetForm} />;

  const { selectedServices, selectedBudget, selectedTimeline,
    projectMessage, selectedTech, selectedIntegrations,
    name, email, company, referral } = form;

  return (
    <div className="w-full max-w-2xl mx-auto" role="main">
      {/* Progress Header */}
      <div className="mb-10 px-4" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: 'var(--text-faint)' }}>
            Step {step} of 4
          </span>
          <span className="text-[11px] tracking-[0.1em] font-medium" style={{ color: 'var(--lime)' }}>
            {STEP_LABELS[step - 1]}
          </span>
        </div>
        <div className="w-full h-[2.5px] rounded-full overflow-hidden" style={{ background: 'var(--nav-border)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--lime)', boxShadow: '0 0 8px var(--glow-lime)' }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="px-4"
        noValidate
        aria-label="BuiltStack Project Inquiry Form"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: EASE as EaseTuple }}
          >
            {/* ── STEP 1: Scope ── */}
            {step === 1 && (
              <fieldset className="border-0 p-0 m-0">
                <legend className="sr-only">Step 1: Project Scope</legend>

                <div className="mb-10" role="group" aria-label="Service selection">
                  <SectionLabel>1. What service do you require?</SectionLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {SERVICE_OPTIONS.map(s => (
                      <ChipButton
                        key={s} label={s} selected={selectedServices.includes(s)}
                        onClick={() => toggleArray('selectedServices', s)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-10" role="group" aria-label="Budget selection">
                  <SectionLabel>2. Approximate budget?</SectionLabel>
                  <div className="grid grid-cols-3 gap-2.5">
                    {BUDGET_OPTIONS.map(b => (
                      <ChipButton
                        key={b} label={b} variant="compact"
                        selected={selectedBudget === b}
                        onClick={() => set('selectedBudget', b)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-6" role="group" aria-label="Timeline selection">
                  <SectionLabel>3. Ideal project timeline?</SectionLabel>
                  <div className="flex flex-wrap gap-2.5">
                    {TIMELINE_OPTIONS.map(t => (
                      <ChipButton
                        key={t} label={t} variant="pill"
                        selected={selectedTimeline === t}
                        onClick={() => set('selectedTimeline', t)}
                      />
                    ))}
                  </div>
                </div>
              </fieldset>
            )}

            {/* ── STEP 2: Vision ── */}
            {step === 2 && (
              <fieldset className="border-0 p-0 m-0">
                <legend className="sr-only">Step 2: Project Vision</legend>

                <div className="mb-10">
                  <SectionLabel>4. Tell us about your project goals</SectionLabel>
                  <textarea
                    id="projectMessage"
                    value={projectMessage}
                    onChange={e => set('projectMessage', e.target.value)}
                    placeholder="We want to build a custom dashboard to automate our SaaS billing — key goals are faster checkout, custom metrics, and Stripe integration..."
                    rows={5}
                    required
                    aria-required="true"
                    aria-describedby="charCount"
                    className="w-full px-5 py-4 rounded-xl outline-none transition-colors duration-150 resize-none"
                    style={{
                      background: 'var(--input-bg)',
                      border: `1px solid ${focusedField === 'message' ? 'var(--lime)' : 'var(--input-border)'}`,
                      color: 'var(--heading-color)',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                    }}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Min. 10 characters</span>
                    <span
                      id="charCount"
                      className="text-[10px] font-mono"
                      style={{ color: projectMessage.length >= 10 ? 'var(--lime)' : 'var(--text-faint)' }}
                      aria-live="polite"
                    >
                      {projectMessage.length} chars
                    </span>
                  </div>
                </div>

                <div className="mb-10" role="group" aria-label="Tech stack preference">
                  <SectionLabel>5. Core tech stack preference</SectionLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {TECH_OPTIONS.map(t => (
                      <ChipButton
                        key={t} label={t} selected={selectedTech === t}
                        onClick={() => set('selectedTech', t)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-6" role="group" aria-label="Required integrations">
                  <SectionLabel>6. Required functionality (select all that apply)</SectionLabel>
                  <div className="flex flex-wrap gap-2.5">
                    {INTEGRATION_OPTIONS.map(i => (
                      <ChipButton
                        key={i}
                        label={`${selectedIntegrations.includes(i) ? '✓ ' : '+ '}${i}`}
                        variant="pill"
                        selected={selectedIntegrations.includes(i)}
                        onClick={() => toggleArray('selectedIntegrations', i)}
                      />
                    ))}
                  </div>
                </div>
              </fieldset>
            )}

            {/* ── STEP 3: Identity ── */}
            {step === 3 && (
              <fieldset className="border-0 p-0 m-0">
                <legend className="sr-only">Step 3: Client Profile</legend>
                <SectionLabel>7. Share your contact details</SectionLabel>

                <StyledInput id="name" label="Your Name" value={name}
                  onChange={v => set('name', v)} placeholder="Jane Smith"
                  autoComplete="name" required
                  focused={focusedField === 'name'}
                  onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} />

                <StyledInput id="email" label="Work Email" type="email" value={email}
                  onChange={v => set('email', v)} placeholder="jane@company.com"
                  autoComplete="email" required
                  focused={focusedField === 'email'}
                  onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />

                <StyledInput id="company" label="Company / Product" value={company}
                  onChange={v => set('company', v)} placeholder="Acme Inc." optional
                  autoComplete="organization"
                  focused={focusedField === 'company'}
                  onFocus={() => setFocusedField('company')} onBlur={() => setFocusedField(null)} />

                <StyledInput id="referral" label="How did you find us?" value={referral}
                  onChange={v => set('referral', v)} placeholder="Google, Twitter, friend referral..." optional
                  focused={focusedField === 'referral'}
                  onFocus={() => setFocusedField('referral')} onBlur={() => setFocusedField(null)} />
              </fieldset>
            )}

            {/* ── STEP 4: Review ── */}
            {step === 4 && (
              <div>
                <SectionLabel>8. Confirm your project brief</SectionLabel>

                <div
                  className="w-full px-6 py-7 rounded-2xl mb-8 relative overflow-hidden"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1.5px solid var(--lime)',
                    boxShadow: '0 0 20px var(--glow-subtle)',
                  }}
                >
                  <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-20"
                    style={{ background: 'radial-gradient(circle, var(--lime) 0%, transparent 70%)', filter: 'blur(30px)' }} />

                  <div className="font-mono text-[11px] tracking-[0.08em] uppercase border-b pb-3.5 mb-5 flex justify-between items-center"
                    style={{ borderColor: 'var(--card-border)', color: 'var(--text-faint)' }}>
                    <span>Docket: BSTK-{(name.slice(0, 2) + selectedBudget.slice(-3)).toUpperCase()}</span>
                    <span className="font-semibold" style={{ color: 'var(--lime)' }}>Ready to Submit</span>
                  </div>

                  <div className="space-y-4 text-[13px] leading-[1.8]" style={{ color: 'var(--heading-color)' }}>
                    <p>
                      Project in <strong style={{ color: 'var(--lime)' }}>{selectedServices.join(', ')}</strong> — budget{' '}
                      <strong>{selectedBudget}</strong>, timeline <strong>{selectedTimeline}</strong>.
                    </p>
                    <p>
                      Stack: <strong>{selectedTech}</strong>.
                      {selectedIntegrations.length > 0 && (
                        <> Integrations: <strong>{selectedIntegrations.join(', ')}</strong>.</>
                      )}
                    </p>
                    <blockquote
                      className="border-l-2 pl-4 py-0.5 italic"
                      style={{ borderColor: 'var(--lime)', color: 'var(--body-color)' }}
                    >
                      &ldquo;{projectMessage}&rdquo;
                    </blockquote>
                    <p className="border-t pt-4" style={{ borderColor: 'var(--card-border)', color: 'var(--body-color)' }}>
                      Contact: <strong>{name}</strong>
                      {company && <> — <strong>{company}</strong></>}
                      {' '}via <strong>{email}</strong>.
                    </p>
                  </div>
                </div>

                <p className="flex items-center gap-2 px-1 mb-6 text-[10px]" style={{ color: 'var(--text-faint)' }}>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  By submitting, your brief opens in Gmail. No spam, ever.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Validation Error */}
        <AnimatePresence>
          {validationError && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6 px-4 py-3 rounded-lg border text-xs font-semibold flex items-center gap-2"
              style={{
                borderColor: 'rgba(239,68,68,0.4)',
                background: 'rgba(239,68,68,0.08)',
                color: 'var(--destructive)',
              }}
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              {validationError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-12 pt-6 border-t flex justify-between items-center" style={{ borderColor: 'var(--card-border)' }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold transition-colors duration-150"
              style={{ background: 'transparent', border: '1.2px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              ← Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-7 py-3 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold transition-colors duration-150"
              style={{ background: 'var(--lime)', color: 'var(--on-lime)', border: 'none', cursor: 'pointer' }}
            >
              Continue →
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === 'loading'}
              aria-busy={status === 'loading' ? 'true' : 'false'}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold transition-colors duration-150"
              style={{
                background: status === 'loading' ? 'var(--chip-bg)' : 'var(--lime)',
                color: status === 'loading' ? 'var(--chip-text)' : 'var(--on-lime)',
                border: 'none',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                opacity: status === 'loading' ? 0.7 : 1,
              }}
            >
              {status === 'loading' ? <><SpinnerIcon /> Submitting…</> : 'Submit Inquiry Brief →'}
            </button>
          )}
        </div>

        {/* Submission error */}
        <AnimatePresence>
          {status === 'error' && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-6 text-xs leading-relaxed text-center"
              style={{ color: 'var(--destructive)' }}
            >
              Submission failed — email us directly at{' '}
              <a href="mailto:builtstack@gmail.com"
                className="underline underline-offset-4"
                style={{ color: 'var(--heading-color)' }}>
                builtstack@gmail.com
              </a>.
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      {/* Snackbar */}
      <AnimatePresence>
        {snackbar && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: EASE as EaseTuple }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full text-[11px] tracking-[0.15em] uppercase font-bold"
            style={{
              background: 'var(--lime)',
              color: 'var(--on-lime)',
              boxShadow: '0 0 24px var(--glow-lime)',
              whiteSpace: 'nowrap',
            }}
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Brief copied &amp; Gmail opened!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}