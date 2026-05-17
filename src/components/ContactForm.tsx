import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_FORM_ID}`
  : null;

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!FORMSPREE_ENDPOINT) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) e.currentTarget.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <FormField>
        <Label htmlFor="name" className="text-muted-foreground uppercase text-xs tracking-widest">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          required
          className="mt-2 bg-[#111] border-bs-border text-foreground"
        />
      </FormField>

      <FormField>
        <Label htmlFor="email" className="text-muted-foreground uppercase text-xs tracking-widest">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          required
          className="mt-2 bg-[#111] border-bs-border text-foreground"
        />
      </FormField>

      <FormField>
        <Label htmlFor="budget" className="text-muted-foreground uppercase text-xs tracking-widest">
          Budget (approx.)
        </Label>
        <Input
          id="budget"
          name="budget"
          type="text"
          placeholder="e.g. $15k–$40k"
          className="mt-2 bg-[#111] border-bs-border text-foreground"
        />
      </FormField>

      <FormField>
        <Label htmlFor="message" className="text-muted-foreground uppercase text-xs tracking-widest">
          Project details
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your product, timeline, and goals"
          required
          rows={5}
          className="mt-2 bg-[#111] border-bs-border text-foreground resize-none"
        />
      </FormField>

      <Button
        type="submit"
        disabled={status === 'loading'}
        className="w-full sm:w-auto uppercase tracking-widest text-xs"
        style={{ background: '#d4f53c', color: '#000' }}
      >
        {status === 'loading' ? 'Sending…' : 'Send message'}
      </Button>

      {status === 'success' && (
        <p className="text-sm text-[#d4f53c]">
          Message sent. We&apos;ll get back to you within one business day.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-muted-foreground">
          {FORMSPREE_ENDPOINT ? (
            <>
              Something went wrong. Please email us at{' '}
              <a href="mailto:hello@builtstack.co" className="text-foreground underline">
                hello@builtstack.co
              </a>
              .
            </>
          ) : (
            <>
              Form delivery is not configured yet. Email us at{' '}
              <a href="mailto:hello@builtstack.co" className="text-foreground underline">
                hello@builtstack.co
              </a>{' '}
              or set <code className="text-xs">VITE_FORMSPREE_FORM_ID</code> in your environment.
            </>
          )}
        </p>
      )}
    </form>
  );
}

function FormField({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
