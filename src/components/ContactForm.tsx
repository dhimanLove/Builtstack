'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// CONSTANTS & OPTIONS
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

const TECH_OPTIONS = [
  'Next.js / React',
  'Shopify / E-Commerce',
  'Webflow / Custom CMS',
  'Full-stack SaaS App',
  'Mobile App (iOS/Android)',
  'Other / Unsure',
];

const INTEGRATION_OPTIONS = [
  'Stripe Payments',
  'User Authentication',
  'Admin Dashboard',
  'Custom Database',
  'Analytics & Tracking',
  'Multilingual Support',
];

// ============================================================================
// AGENCY BRIEF CONTACT FORM
// ============================================================================
export default function ContactForm() {
  // Current active step (1 to 4)
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Step 1: Project Scope
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedTimeline, setSelectedTimeline] = useState('');

  // Step 2: Vision & Goals
  const [projectMessage, setProjectMessage] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);

  // Step 3: Identity Profile
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [referral, setReferral] = useState('');

  // Input states tracking
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Toggle multiple choices (Services and Integrations)
  const toggleService = (s: string) => {
    setSelectedServices(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
    setValidationError(null);
  };

  const toggleIntegration = (i: string) => {
    setSelectedIntegrations(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  // ============================================================================
  // VALIDATION CHECKS PER STEP
  // ============================================================================
  const validateStep = (currentStep: number): boolean => {
    setValidationError(null);

    if (currentStep === 1) {
      if (selectedServices.length === 0) {
        setValidationError('Please select at least one service category.');
        return false;
      }
      if (!selectedBudget) {
        setValidationError('Please select an approximate budget range.');
        return false;
      }
      if (!selectedTimeline) {
        setValidationError('Please select your preferred project timeline.');
        return false;
      }
    }

    if (currentStep === 2) {
      if (!projectMessage.trim() || projectMessage.trim().length < 10) {
        setValidationError('Please write a brief description of your project goals (at least 10 characters).');
        return false;
      }
      if (!selectedTech) {
        setValidationError('Please choose a core tech stack preference.');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!name.trim()) {
        setValidationError('Please enter your name.');
        return false;
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setValidationError('Please enter a valid work email address.');
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setStep(prev => Math.max(prev - 1, 1));
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey && step < 4) {
        e.preventDefault();
        handleNextStep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, selectedServices, selectedBudget, selectedTimeline, projectMessage, selectedTech, name, email]);

  // ============================================================================
  // FORM SUBMISSION HANDLER
  // ============================================================================
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    setStatus('loading');

    const formData = new FormData();
    formData.set('name', name);
    formData.set('email', email);
    formData.set('company', company || 'Freelance Client');
    formData.set('services', selectedServices.join(', '));
    formData.set('budget', selectedBudget);
    formData.set('timeline', selectedTimeline);
    formData.set('techPreference', selectedTech);
    formData.set('requestedIntegrations', selectedIntegrations.join(', ') || 'None specified');
    formData.set('message', projectMessage);
    formData.set('referral', referral || 'Organic / Not specified');

    // ── Sandbox submission in Local Dev environment without Formspree ──
    if (!FORMSPREE_ENDPOINT) {
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 1400));
        setStatus('success');
        return;
      }
      setStatus('error');
      return;
    }

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  // ============================================================================
  // SUCCESS SCREEN
  // ============================================================================
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: EASE }}
        className="w-full max-w-2xl mx-auto px-8 py-16 rounded-3xl text-center relative overflow-hidden"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
        }}
      >
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-16 h-16 rounded-full grid place-items-center mb-8"
            style={{ background: 'var(--lime)', boxShadow: '0 0 24px var(--glow-lime)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="var(--on-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>

          <h3
            className="text-4xl md:text-5xl mb-5"
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              color: 'var(--heading-color)',
              lineHeight: 1.1
            }}
          >
            Brief submitted.
          </h3>

          <p className="text-base md:text-lg leading-relaxed max-w-md mb-8"
            style={{ color: 'var(--body-color)' }}>
            We review every brief personally. Our lead engineer and designer will analyze your specs and get in touch within **one business day**.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // Reset brief state
              setStatus('idle');
              setStep(1);
              setSelectedServices([]);
              setSelectedBudget('');
              setSelectedTimeline('');
              setProjectMessage('');
              setSelectedTech('');
              setSelectedIntegrations([]);
              setName('');
              setEmail('');
              setCompany('');
              setReferral('');
            }}
            className="px-6 py-2.5 rounded-full text-[11px] tracking-[0.2em] uppercase font-semibold transition-all duration-200"
            style={{
              background: 'transparent',
              border: '1px solid var(--lime)',
              color: 'var(--lime)',
              cursor: 'pointer'
            }}
          >
            Submit Another Inquiry
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ── Progress Header ── */}
      <div className="mb-10 px-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: 'var(--text-faint)' }}>
            Step {step} of 4
          </span>
          <span className="text-[11px] tracking-[0.1em] font-medium" style={{ color: 'var(--lime)' }}>
            {step === 1 && 'Project Scope'}
            {step === 2 && 'Project Vision'}
            {step === 3 && 'Client Profile'}
            {step === 4 && 'Proposal Review'}
          </span>
        </div>
        <div className="w-full h-[2.5px] rounded-full overflow-hidden" style={{ background: 'var(--nav-border)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'var(--lime)',
              boxShadow: '0 0 8px var(--glow-lime)',
            }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4">
        {/* ── Sliding Panel Transition Wrapper ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* ====================================================================
                STEP 1: PROJECT SCOPE & BUDGET
                ==================================================================== */}
            {step === 1 && (
              <div>
                {/* Services Section */}
                <div className="mb-10">
                  <h4 className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>
                    1. WHAT SERVICE DO YOU REQUIRE?
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {SERVICE_OPTIONS.map(s => {
                      const isSelected = selectedServices.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleService(s)}
                          className="px-5 py-4 rounded-xl text-[11px] tracking-[0.15em] uppercase font-semibold text-left transition-all duration-200"
                          style={{
                            border: `1.5px solid ${isSelected ? 'var(--lime)' : 'var(--input-border)'}`,
                            background: isSelected ? 'var(--glow-lime)' : 'var(--input-bg)',
                            color: isSelected ? 'var(--lime)' : 'var(--heading-color)',
                            boxShadow: isSelected ? '0 0 12px var(--glow-subtle)' : 'none',
                            cursor: 'pointer',
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Budget Section */}
                <div className="mb-10">
                  <h4 className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>
                    2. WHAT IS YOUR APPROXIMATE BUDGET?
                  </h4>
                  <div className="grid grid-cols-3 gap-2.5">
                    {BUDGET_OPTIONS.map(b => {
                      const isSelected = selectedBudget === b;
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => {
                            setSelectedBudget(b);
                            setValidationError(null);
                          }}
                          className="px-3 py-3 rounded-lg text-[10px] tracking-[0.12em] uppercase font-semibold text-center transition-all duration-200"
                          style={{
                            border: `1.2px solid ${isSelected ? 'var(--lime)' : 'var(--input-border)'}`,
                            background: isSelected ? 'var(--glow-lime)' : 'var(--input-bg)',
                            color: isSelected ? 'var(--lime)' : 'var(--heading-color)',
                            cursor: 'pointer',
                          }}
                        >
                          {b}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="mb-6">
                  <h4 className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>
                    3. WHAT IS YOUR IDEAL TIMELINE?
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {TIMELINE_OPTIONS.map(t => {
                      const isSelected = selectedTimeline === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setSelectedTimeline(t);
                            setValidationError(null);
                          }}
                          className="px-4 py-2.5 rounded-full text-[10px] tracking-[0.15em] uppercase font-semibold transition-all duration-200"
                          style={{
                            border: `1px solid ${isSelected ? 'var(--lime)' : 'var(--input-border)'}`,
                            background: isSelected ? 'var(--lime)' : 'var(--chip-bg)',
                            color: isSelected ? 'var(--on-lime)' : 'var(--chip-text)',
                            cursor: 'pointer',
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ====================================================================
                STEP 2: PROJECT VISION, TECH STACK & INTEGRATIONS
                ==================================================================== */}
            {step === 2 && (
              <div>
                {/* Brief description */}
                <div className="mb-10">
                  <h4 className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
                    4. TELL US ABOUT YOUR PROJECT GOALS
                  </h4>
                  <textarea
                    value={projectMessage}
                    onChange={e => {
                      setProjectMessage(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder="We want to build a custom dashboard to automate our SaaS client billing. Key goals are speeding up checkout times, custom chart metrics, and Stripe billing..."
                    rows={5}
                    required
                    className="w-full px-5 py-4 rounded-xl outline-none transition-all duration-200 resize-none"
                    style={{
                      background: 'var(--input-bg)',
                      border: `1px solid ${focusedField === 'message' ? 'var(--lime)' : 'var(--input-border)'}`,
                      color: 'var(--heading-color)',
                      fontSize: '0.92rem',
                      fontFamily: 'var(--font-body)',
                      lineHeight: 1.6,
                    }}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>
                      Min. 10 characters
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: projectMessage.length >= 10 ? 'var(--lime)' : 'var(--text-faint)' }}>
                      {projectMessage.length} chars
                    </span>
                  </div>
                </div>

                {/* Tech selection */}
                <div className="mb-10">
                  <h4 className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>
                    5. CORE TECH STACK PREFERENCE
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {TECH_OPTIONS.map(t => {
                      const isSelected = selectedTech === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setSelectedTech(t);
                            setValidationError(null);
                          }}
                          className="px-4 py-3 rounded-xl text-[10px] tracking-[0.12em] uppercase font-semibold text-left transition-all duration-200"
                          style={{
                            border: `1.2px solid ${isSelected ? 'var(--lime)' : 'var(--input-border)'}`,
                            background: isSelected ? 'var(--glow-lime)' : 'var(--input-bg)',
                            color: isSelected ? 'var(--lime)' : 'var(--heading-color)',
                            cursor: 'pointer',
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Key features integrations */}
                <div className="mb-6">
                  <h4 className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>
                    6. REQUIRED FUNCTIONALITY (SELECT ALL THAT APPLY)
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {INTEGRATION_OPTIONS.map(i => {
                      const isSelected = selectedIntegrations.includes(i);
                      return (
                        <button
                          key={i}
                          type="button;button"
                          onClick={() => toggleIntegration(i)}
                          className="px-4 py-2.5 rounded-full text-[10px] tracking-[0.15em] uppercase font-semibold transition-all duration-200"
                          style={{
                            border: `1px solid ${isSelected ? 'var(--lime)' : 'var(--input-border)'}`,
                            background: isSelected ? 'var(--glow-lime)' : 'var(--input-bg)',
                            color: isSelected ? 'var(--lime)' : 'var(--body-color)',
                            cursor: 'pointer',
                          }}
                        >
                          {isSelected ? '✓ ' : '+ '} {i}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ====================================================================
                STEP 3: IDENTITY PROFILE & BUSINESS
                ==================================================================== */}
            {step === 3 && (
              <div>
                <h4 className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-6" style={{ color: 'var(--text-muted)' }}>
                  7. SHARE YOUR BIO DETAILS
                </h4>

                {/* Name */}
                <div className="mb-6">
                  <label htmlFor="name" className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
                    YOUR NAME
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => {
                      setName(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder="Jane Smith"
                    required
                    className="w-full mt-3 px-5 py-3.5 rounded-xl outline-none transition-all duration-200"
                    style={{
                      background: 'var(--input-bg)',
                      border: `1px solid ${focusedField === 'name' ? 'var(--lime)' : 'var(--input-border)'}`,
                      color: 'var(--heading-color)',
                      fontSize: '0.92rem',
                    }}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label htmlFor="email" className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
                    WORK EMAIL
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder="jane@company.com"
                    required
                    className="w-full mt-3 px-5 py-3.5 rounded-xl outline-none transition-all duration-200"
                    style={{
                      background: 'var(--input-bg)',
                      border: `1px solid ${focusedField === 'email' ? 'var(--lime)' : 'var(--input-border)'}`,
                      color: 'var(--heading-color)',
                      fontSize: '0.92rem',
                    }}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                {/* Company Name */}
                <div className="mb-6">
                  <div className="flex justify-between items-baseline">
                    <label htmlFor="company" className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
                      COMPANY / PRODUCT
                    </label>
                    <span className="text-[9px] tracking-[0.1em]" style={{ color: 'var(--text-faint)' }}>optional</span>
                  </div>
                  <input
                    id="company"
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Acme Inc."
                    className="w-full mt-3 px-5 py-3.5 rounded-xl outline-none transition-all duration-200"
                    style={{
                      background: 'var(--input-bg)',
                      border: `1px solid ${focusedField === 'company' ? 'var(--lime)' : 'var(--input-border)'}`,
                      color: 'var(--heading-color)',
                      fontSize: '0.92rem',
                    }}
                    onFocus={() => setFocusedField('company')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                {/* Referral */}
                <div className="mb-6">
                  <div className="flex justify-between items-baseline">
                    <label htmlFor="referral" className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
                      HOW DID YOU FIND US?
                    </label>
                    <span className="text-[9px] tracking-[0.1em]" style={{ color: 'var(--text-faint)' }}>optional</span>
                  </div>
                  <input
                    id="referral"
                    type="text"
                    value={referral}
                    onChange={e => setReferral(e.target.value)}
                    placeholder="Google search, friend referral, Twitter..."
                    className="w-full mt-3 px-5 py-3.5 rounded-xl outline-none transition-all duration-200"
                    style={{
                      background: 'var(--input-bg)',
                      border: `1px solid ${focusedField === 'referral' ? 'var(--lime)' : 'var(--input-border)'}`,
                      color: 'var(--heading-color)',
                      fontSize: '0.92rem',
                    }}
                    onFocus={() => setFocusedField('referral')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
            )}

            {/* ====================================================================
                STEP 4: SUMMARY DOCKET BRIEF & SUBMIT
                ==================================================================== */}
            {step === 4 && (
              <div>
                <h4 className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-5" style={{ color: 'var(--text-muted)' }}>
                  8. CONFIRM YOUR DRAFT PROJECT BRIEF
                </h4>

                {/* Proposal Docket Summary Card */}
                <div
                  className="w-full px-6 py-7 rounded-2xl mb-8 relative overflow-hidden"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1.5px solid var(--lime)',
                    boxShadow: '0 0 20px var(--glow-subtle)',
                  }}
                >
                  {/* Glass background highlights */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-20"
                    style={{
                      background: 'radial-gradient(circle, var(--lime) 0%, transparent 70%)',
                      filter: 'blur(30px)'
                    }}
                  />

                  {/* Summary Brief text */}
                  <div className="font-mono text-[11px] tracking-[0.08em] uppercase border-b pb-3.5 mb-5 flex justify-between items-center" style={{ borderColor: 'var(--card-border)', color: 'var(--text-faint)' }}>
                    <span>Brief Docket Code: BSTK-{(name.slice(0,2) + selectedBudget.slice(-3)).toUpperCase()}</span>
                    <span className="font-semibold" style={{ color: 'var(--lime)' }}>READY TO SUBMIT</span>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[13px] leading-[1.8]" style={{ color: 'var(--heading-color)' }}>
                      We are submitting a project in <strong style={{ color: 'var(--lime)' }}>{selectedServices.join(', ')}</strong> with a target budget of <strong>{selectedBudget}</strong> and timeline set for <strong>{selectedTimeline}</strong>.
                    </p>
                    <p className="text-[13px] leading-[1.8]" style={{ color: 'var(--heading-color)' }}>
                      Core architecture preference: <strong>{selectedTech}</strong>.
                      {selectedIntegrations.length > 0 && (
                        <> Required integrations: <strong>{selectedIntegrations.join(', ')}</strong>.</>
                      )}
                    </p>
                    <p className="text-[13px] leading-[1.8] border-l-2 pl-4 py-0.5 my-3 font-body italic" style={{ borderColor: 'var(--lime)', color: 'var(--body-color)' }}>
                      &ldquo;{projectMessage}&rdquo;
                    </p>
                    <p className="text-[13px] leading-[1.8] border-t pt-4" style={{ borderColor: 'var(--card-border)', color: 'var(--body-color)' }}>
                      Contact details: Lead client is <strong>{name}</strong> {company ? <>representing <strong>{company}</strong></> : null} reachable via <strong>{email}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-1 mb-6 text-[10px]" style={{ color: 'var(--text-faint)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>By submitting, you agree to launch a fast discovery channel. No spam, ever.</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Validation Error Banner ── */}
        <AnimatePresence>
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 px-4 py-3 rounded-lg border text-xs font-semibold flex items-center gap-2"
              style={{
                borderColor: 'rgba(239, 68, 68, 0.4)',
                background: 'rgba(239, 68, 68, 0.08)',
                color: 'var(--destructive)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>{validationError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Action Navigation Buttons ── */}
        <div
          className="mt-12 pt-6 border-t flex justify-between items-center"
          style={{ borderColor: 'var(--card-border)' }}
        >
          {/* Back button */}
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-6 py-3 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-200"
              style={{
                background: 'transparent',
                border: '1.2px solid var(--border)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              ← Back
            </button>
          ) : (
            <div /> // spacer
          )}

          {/* Forward button / Submit */}
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-7 py-3 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-200"
              style={{
                background: 'var(--lime)',
                color: 'var(--on-lime)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-200"
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
                  Submitting Brief...
                </>
              ) : (
                'Submit Inquiry Brief →'
              )}
            </button>
          )}
        </div>

        {/* Error Submission Banner */}
        <AnimatePresence>
          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-xs leading-relaxed text-center"
              style={{ color: 'var(--destructive)' }}
            >
              {FORMSPREE_ENDPOINT ? (
                <>Submission error — please reach out directly via{' '}
                  <a href="mailto:builtstack@gmail.com"
                    className="underline decoration-1 underline-offset-4"
                    style={{ color: 'var(--heading-color)' }}>
                    builtstack@gmail.com
                  </a>.</>
              ) : (
                <>Formspree endpoint not set. Set <code className="text-xs" style={{ color: 'var(--lime)' }}>VITE_FORMSPREE_FORM_ID</code> or email{' '}
                  <a href="mailto:builtstack@gmail.com"
                    className="underline decoration-1 underline-offset-4"
                    style={{ color: 'var(--heading-color)' }}>
                    builtstack@gmail.com
                  </a>.</>
              )}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}

// Inline Spinner Icon
function SpinnerIcon() {
  return (
    <motion.svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </motion.svg>
  );
}