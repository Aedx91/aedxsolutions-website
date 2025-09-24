import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions governing the use of the AedxCorp website.',
  robots: { index: true, follow: true },
};

export default function Terms() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 prose prose-neutral">
      <h1>Terms &amp; Conditions</h1>
      <p><strong>Last Updated:</strong> September 24, 2025</p>
      <p>
        These Terms &amp; Conditions ("Terms") govern your use of <code>aedxsolutions.com</code> (the "Site"). By accessing or
        using the Site you agree to be bound by these Terms. If you disagree with any part, discontinue use immediately.
      </p>
      <h2>1. Use of the Site</h2>
      <p>You agree to use the Site lawfully and not to disrupt, damage, or impair functionality or security.</p>
      <h2>2. Intellectual Property</h2>
      <p>All content, trademarks, logos, and materials are owned by or licensed to AedxCorp. You may not copy, modify, or redistribute without prior written consent except for personal, non-commercial viewing.</p>
      <h2>3. No Warranties</h2>
      <p>The Site is provided "as is" without warranties of any kind (express or implied). We disclaim implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
      <h2>4. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, AedxCorp shall not be liable for indirect, incidental, consequential, or punitive damages arising from Site use.</p>
      <h2>5. Third-Party Services</h2>
      <p>The Site may link to third-party services. We are not responsible for their content, policies, or practices.</p>
      <h2>6. Privacy</h2>
      <p>Your use of the Site is also governed by our <a href="/privacy">Privacy Policy</a>.</p>
      <h2>7. Changes to Terms</h2>
      <p>We may update these Terms. Changes are effective upon posting. Continued use constitutes acceptance.</p>
      <h2>8. Governing Law</h2>
      <p>These Terms are governed by applicable laws of the jurisdiction in which AedxCorp operates, without regard to conflict of law principles.</p>
      <h2>9. Contact</h2>
      <p>Email: <a href="mailto:legal@aedxcorp.com">legal@aedxcorp.com</a></p>
    </main>
  );
}
