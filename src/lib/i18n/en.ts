export const en = {
  nav: { home: 'Home', products: 'Products', customers: 'Customers', contact: 'Contact' },
  footer: { privacy: 'Privacy', terms: 'Terms' },
  demo: {
    loginTitle: 'Demo Login | AedxSolutions',
    loginDescription: 'Sign in to access the demo dashboard.',
    dashboardTitle: 'Demo Dashboard | AedxSolutions',
    dashboardDescription: 'Protected demo dashboard for customer walkthroughs.',
    loginButton: 'Demo Login',
    login: {
      title: 'Sign in',
      username: 'Username',
      password: 'Password',
      signIn: 'Sign in',
      invalidCreds: 'Invalid username or password.',
    },
    dashboard: {
      logout: 'Logout',
      walmartDemo: 'Walmart Demo',
      viewLogs: 'View Logs',
      toastSaved: 'Log saved.',
      modalTitle: 'Walmart Demo',
      packedBoxesLabel: 'Cajas Empacadas / Packed Boxes',
      logEntry: 'Log Entry',
      close: 'Close',
      invalidNumber: 'Enter a valid non-negative integer.',
    },
  },
  hero: {
    title: 'AI-powered software for real-world operations',
    subtitle: 'Modern web, API integrations, and consulting that scale with your team\'s growth.',
    cta: 'Talk to us'
  },
  demoHero: {
    title: 'Carmy space',
    subtitle: 'Keep the dishes, date nights, movies, and little moments we want to log. You pick; I cook; we decide how to cover it.',
  },
  contact: { title: 'Contact Us', intro: 'Tell us about your project and we will get back shortly.' },
  products: { title: 'Products', intro: 'A glimpse at the platforms & accelerators we are building.' },
  customers: { title: 'Our Customers', intro: 'Trusted by teams focused on performance, security and velocity.' },
  legal: {
    privacyTitle: 'Privacy Policy',
    termsTitle: 'Terms & Conditions',
    labels: { updated: 'Updated', version: 'Version', onThisPage: 'ON THIS PAGE' },
    privacy: {
      sections: [
        { id: 'data-we-collect', heading: 'Data We Collect', body: 'We currently collect minimal operational data required to respond to inbound requests, improve reliability and fulfill prospective commercial agreements. This placeholder section will be localized and expanded.' },
        { id: 'how-we-use', heading: 'How We Use Information', body: 'Usage is restricted to performing requested services, internal analytics, security monitoring and legal compliance.' },
        { id: 'storage-retention', heading: 'Storage & Retention', body: 'Data is retained only as long as necessary for stated purposes or contractual / statutory requirements.' },
        { id: 'your-rights', heading: 'Your Rights', body: 'Access, rectification, deletion, portability and objection rights will be addressed once the full compliance copy is added.' },
        { id: 'contact', heading: 'Contact', body: 'Questions: <a href="/{lang}/contact" class="link underline">Contact us</a>.' }
      ]
    },
    terms: {
      sections: [
        { id: 'agreement', heading: 'Agreement', body: 'These placeholder terms outline a future commercial relationship framework. They will be replaced with finalized bilingual legal language.' },
        { id: 'license', heading: 'License & Access', body: 'Access is provided on an as-is basis. No warranties are currently expressed in this provisional document.' },
        { id: 'acceptable-use', heading: 'Acceptable Use', body: 'Users must not interfere with platform security, integrity or availability.' },
        { id: 'liability', heading: 'Limitation of Liability', body: 'To the maximum extent permitted by law liability will be limited to directly incurred fees.' },
        { id: 'changes', heading: 'Changes', body: 'We may update these terms; material changes will be versioned and dated.' },
        { id: 'governing-law', heading: 'Governing Law', body: 'Jurisdiction to be specified in final document.' },
        { id: 'contact', heading: 'Contact', body: 'For contract or compliance inquiries please <a href="/{lang}/contact" class="link underline">reach out</a>.' }
      ]
    }
  },
  heroBadge: 'AedxSolutions • Build • Integrate • Automate',
  features: {
    sectionTitle: 'Choose what to plan',
    sectionSubtitle: 'Flip a card to preview the run, then tap “More info” to see how we ship it.',
    items: [
      {
        title: 'Discovery Session',
        desc: 'A short, focused session to map goals, define constraints, and leave with a clear roadmap.'
      },
      {
        title: 'Integration Sprint',
        desc: 'Connect your systems, ship the first automated workflow, and document everything for a smooth hand-off.'
      },
      {
        title: 'AI Companion Sprint',
        desc: 'Prototype an AI-assisted workflow with human-in-the-loop guardrails and a rollout playbook.'
      }
    ]
  }
};

export type EnDictionary = typeof en;
