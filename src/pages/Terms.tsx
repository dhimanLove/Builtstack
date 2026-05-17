import Seo from '@/components/Seo';
import LegalPageLayout from '@/components/LegalPageLayout';
import { PAGE_SEO } from '@/lib/seo';

const meta = PAGE_SEO.terms;

export default function TermsPage() {
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} />
      <LegalPageLayout title="Terms of Service">
        <p>
          These terms govern your use of builtstack.co and any preliminary communications with
          BuiltStack. Separate statements of work govern paid client engagements.
        </p>

        <h2>Use of the website</h2>
        <p>
          You may browse this site for lawful purposes. You may not attempt to disrupt the site,
          scrape content at scale without permission, or use our materials in a way that infringes
          third-party rights.
        </p>

        <h2>Intellectual property</h2>
        <p>
          Unless otherwise agreed in writing, all site content, branding, and case-study materials
          remain the property of BuiltStack or respective rights holders. Client deliverables are
          governed by project contracts.
        </p>

        <h2>Services and proposals</h2>
        <p>
          Information on this site is general in nature and does not constitute a binding offer.
          Project scope, fees, timelines, and deliverables are defined only in signed agreements.
        </p>

        <h2>Disclaimer</h2>
        <p>
          The site is provided &quot;as is&quot; without warranties of any kind. We do not guarantee
          uninterrupted or error-free operation.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, BuiltStack is not liable for indirect or
          consequential damages arising from use of this website.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by applicable laws in our principal place of business, without
          regard to conflict-of-law rules.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms:{' '}
          <a href="mailto:hello@builtstack.co">hello@builtstack.co</a>.
        </p>
      </LegalPageLayout>
    </>
  );
}
