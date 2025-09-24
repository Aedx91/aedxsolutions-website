                                                                                                                                                                                                                                                                                                            import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for AedxCorp – how we collect, use, and protect your information.',
  robots: { index: true, follow: true },
};

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 prose prose-neutral">
      <h1>Privacy Policy</h1>
      <p><strong>Last Updated:</strong> September 24, 2025</p>
      <p>
        This Privacy Policy explains how AedxCorp ("we", "us", "our") collects, uses, and safeguards
        personal information when you visit <code>aedxsolutions.com</code> (the "Site"). By using the Site you
        agree to the practices described here.
      </p>
      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Voluntary Data:</strong> Information you submit via email, contact forms, or phone.</li>
        <li><strong>Usage Data:</strong> Non-identifying analytics such as pages viewed, device, approximate location.</li>
        <li><strong>Technical Data:</strong> Browser type, operating system, anonymized IP (where applicable).</li>
      </ul>
      <h2>2. How We Use Information</h2>
      <ul>
        <li>To respond to inquiries and provide services.</li>
        <li>To improve Site performance, security, and user experience.</li>
        <li>To maintain legal and compliance records.</li>
      </ul>
      <h2>3. Legal Bases (EU / Similar Jurisdictions)</h2>
      <p>Where applicable: legitimate interests (service operation, security), consent (optional analytics), and legal obligations.</p>
      <h2>4. Cookies & Tracking</h2>
      <p>Currently the Site uses only essential technical features. If we introduce analytics or marketing cookies, we will update this Policy and provide consent mechanisms.</p>
      <h2>5. Data Sharing</h2>
      <p>We do not sell personal data. Limited sharing may occur with service providers (hosting, security) under appropriate agreements.</p>
      <h2>6. Data Security</h2>
      <p>We apply industry-standard security practices (encryption in transit via HTTPS, restricted access, monitoring). No method is 100% secure; users transmit information at their own risk.</p>
      <h2>7. Data Retention</h2>
      <p>We retain data only as long as necessary for the purposes collected and to comply with legal requirements.</p>
      <h2>8. Your Rights</h2>
      <p>Depending on jurisdiction: access, correction, deletion, restriction, portability, and objection. Contact us to exercise rights.</p>
      <h2>9. International Transfers</h2>
      <p>Data may be processed in countries with different data protection laws. Safeguards (such as contractual clauses) are applied where required.</p>
      <h2>10. Third-Party Links</h2>
      <p>The Site may link to external sites not controlled by us. Review their policies before providing personal information.</p>
      <h2>11. Updates to This Policy</h2>
      <p>We may update this Policy. Continued use after changes constitutes acceptance. The "Last Updated" date reflects the latest revision.</p>
      <h2>12. Contact</h2>
      <p>Email: <a href="mailto:privacy@aedxcorp.com">privacy@aedxcorp.com</a></p>
    </main>
  );
}
