import Seo from '@/components/Seo';
import LegalPageLayout from '@/components/LegalPageLayout';
import { PAGE_SEO } from '@/lib/seo';

const meta = PAGE_SEO.privacy;

export default function PrivacyPage() {
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} />
      <LegalPageLayout title="Privacy Policy">
        <p>
          BuiltStack (&quot;we&quot;, &quot;us&quot;) operates builtstack.co. This policy explains how we
          collect, use, and protect personal information when you visit our website or contact us
          about a project.
        </p>

        <h2>Information we collect</h2>
        <p>
          When you use our contact form, we collect the information you provide (such as name,
          email, budget range, and project details). We may also collect standard technical data
          through server logs (IP address, browser type, pages visited) to keep the site secure and
          reliable.
        </p>

        <h2>How we use information</h2>
        <p>
          We use your information to respond to inquiries, scope potential engagements, improve our
          website, and comply with legal obligations. We do not sell your personal data.
        </p>

        <h2>Legal basis (EEA/UK)</h2>
        <p>
          Where GDPR applies, we process data based on legitimate interest (responding to business
          inquiries) and, where applicable, your consent (e.g. optional marketing communications).
        </p>

        <h2>Retention</h2>
        <p>
          Inquiry records are kept only as long as needed to evaluate and deliver services, or as
          required by law.
        </p>

        <h2>Third-party processors</h2>
        <p>
          We may use infrastructure and form providers (such as hosting and email delivery services)
          that process data on our behalf under appropriate agreements.
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on your location, you may request access, correction, deletion, or restriction
          of your personal data. Contact us at{' '}
          <a href="mailto:hello@builtstack.co">hello@builtstack.co</a>.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy from time to time. Material changes will be reflected on this
          page with an updated date.
        </p>
      </LegalPageLayout>
    </>
  );
}
