import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';
import PolicySection from '@/components/PolicySection';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <PolicyLayout
      title="Privacy Policy"
      lastUpdated="February 15, 2026"
      currentPath="/privacy-policy"
    >
      <PolicySection title="Introduction" level={1}>
        <p>
          At Vinayka Rugs ("we," "us," or "our"), we value your privacy and are
          committed to protecting your personal information. This Privacy Policy
          outlines how we collect, use, share, and safeguard your data when you
          visit our website or make a purchase from us.
        </p>
        <p className="mt-4">
          By using our services, you agree to the terms outlined in this Privacy
          Policy. Please read this carefully to understand how we handle your
          information.
        </p>
      </PolicySection>

      <PolicySection title="Information We Collect" level={1}>
        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Personal Information
        </h4>
        <p>
          When you visit our website or make a purchase, we may collect the
          following personal information:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>Name and contact information (email, phone number, address)</li>
          <li>Billing and shipping addresses</li>
          <li>
            Payment information (processed securely through third-party payment
            processors)
          </li>
          <li>Order history and preferences</li>
          <li>Communication preferences</li>
        </ul>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Automatically Collected Information
        </h4>
        <p>
          When you browse our website, we automatically collect certain
          information:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>IP address and device information</li>
          <li>Browser type and version</li>
          <li>Pages visited and time spent on our site</li>
          <li>Referring website or source</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </PolicySection>

      <PolicySection title="How We Use Your Information" level={1}>
        <p>We use the information we collect for the following purposes:</p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>
            <strong>Order Processing:</strong> To process and fulfill your
            orders, including shipping and customer service
          </li>
          <li>
            <strong>Communication:</strong> To send you order confirmations,
            shipping updates, and respond to your inquiries
          </li>
          <li>
            <strong>Marketing:</strong> To send promotional emails about new
            products, special offers, or other information we think you may find
            interesting (with your consent)
          </li>
          <li>
            <strong>Website Improvement:</strong> To analyze how our website is
            used and improve user experience
          </li>
          <li>
            <strong>Fraud Prevention:</strong> To protect against fraudulent
            transactions and ensure account security
          </li>
          <li>
            <strong>Legal Compliance:</strong> To comply with applicable laws
            and regulations
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Cookies and Tracking Technologies" level={1}>
        <p>
          We use cookies and similar tracking technologies to enhance your
          browsing experience and analyze website traffic.
        </p>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Types of Cookies We Use
        </h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>Essential Cookies:</strong> Required for the website to
            function properly
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us understand how visitors
            interact with our website
          </li>
          <li>
            <strong>Marketing Cookies:</strong> Used to deliver relevant
            advertisements
          </li>
          <li>
            <strong>Preference Cookies:</strong> Remember your settings and
            preferences
          </li>
        </ul>

        <p className="mt-4">
          You can control cookies through your browser settings. However,
          disabling cookies may affect your ability to use certain features of
          our website.
        </p>
      </PolicySection>

      <PolicySection title="How We Share Your Information" level={1}>
        <p>
          We do not sell or rent your personal information to third parties. We
          may share your information with:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>
            <strong>Service Providers:</strong> Third-party companies that help
            us operate our business (payment processors, shipping companies,
            marketing platforms)
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by law, court
            order, or government regulation
          </li>
          <li>
            <strong>Business Transfers:</strong> In the event of a merger,
            acquisition, or sale of assets
          </li>
          <li>
            <strong>With Your Consent:</strong> When you explicitly agree to
            share your information
          </li>
        </ul>

        <p className="mt-4">
          All third-party service providers are required to protect your
          information and use it only for the purposes we specify.
        </p>
      </PolicySection>

      <PolicySection title="Data Security" level={1}>
        <p>
          We take the security of your personal information seriously and
          implement appropriate technical and organizational measures to protect
          it:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>Secure Socket Layer (SSL) encryption for data transmission</li>
          <li>
            Secure payment processing through trusted third-party providers
          </li>
          <li>Regular security audits and updates</li>
          <li>Restricted access to personal information</li>
          <li>Employee training on data protection</li>
        </ul>

        <p className="mt-4">
          While we strive to protect your information, no method of transmission
          over the internet is 100% secure. We cannot guarantee absolute
          security.
        </p>
      </PolicySection>

      <PolicySection title="Your Rights and Choices" level={1}>
        <p>
          You have the following rights regarding your personal information:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>
            <strong>Access:</strong> Request a copy of the personal information
            we hold about you
          </li>
          <li>
            <strong>Correction:</strong> Request corrections to inaccurate or
            incomplete information
          </li>
          <li>
            <strong>Deletion:</strong> Request deletion of your personal
            information (subject to legal obligations)
          </li>
          <li>
            <strong>Opt-Out:</strong> Unsubscribe from marketing emails at any
            time
          </li>
          <li>
            <strong>Data Portability:</strong> Request your data in a portable
            format
          </li>
          <li>
            <strong>Object:</strong> Object to certain processing of your
            personal information
          </li>
        </ul>

        <p className="mt-4">
          To exercise any of these rights, please contact us at{' '}
          <a
            href="mailto:info@vinaykarugs.com"
            className="text-terracotta hover:underline"
          >
            info@vinaykarugs.com
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection title="Data Retention" level={1}>
        <p>
          We retain your personal information for as long as necessary to
          fulfill the purposes outlined in this Privacy Policy, unless a longer
          retention period is required by law.
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>
            <strong>Order Information:</strong> Retained for 7 years for
            accounting and tax purposes
          </li>
          <li>
            <strong>Marketing Data:</strong> Retained until you unsubscribe or
            request deletion
          </li>
          <li>
            <strong>Website Analytics:</strong> Typically retained for 2 years
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Third-Party Links" level={1}>
        <p>
          Our website may contain links to third-party websites. We are not
          responsible for the privacy practices of these external sites. We
          encourage you to read their privacy policies before providing any
          personal information.
        </p>
      </PolicySection>

      <PolicySection title="Children's Privacy" level={1}>
        <p>
          Our website is not intended for children under the age of 13. We do
          not knowingly collect personal information from children. If you
          believe we have inadvertently collected information from a child,
          please contact us immediately.
        </p>
      </PolicySection>

      <PolicySection title="International Data Transfers" level={1}>
        <p>
          Your information may be transferred to and processed in countries
          other than your own. We ensure that appropriate safeguards are in
          place to protect your information in accordance with this Privacy
          Policy.
        </p>
      </PolicySection>

      <PolicySection title="Changes to This Privacy Policy" level={1}>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or legal requirements. We will notify you of any
          material changes by posting the updated policy on our website and
          updating the "Last Updated" date.
        </p>
        <p className="mt-4">
          We encourage you to review this Privacy Policy periodically to stay
          informed about how we protect your information.
        </p>
      </PolicySection>

      <PolicySection title="Contact Us" level={1}>
        <p>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or how we handle your personal information, please
          contact us:
        </p>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-4">
          <p className="mb-2">
            <strong>Vinayka Rugs</strong>
          </p>
          <p className="mb-2">
            Email:{' '}
            <a
              href="mailto:info@vinaykarugs.com"
              className="text-terracotta hover:underline"
            >
              info@vinaykarugs.com
            </a>
          </p>
          <p className="mb-2">
            Phone:{' '}
            <a
              href="tel:9936169852"
              className="text-terracotta hover:underline"
            >
              9936169852
            </a>
          </p>
          <p>Address: Bhadohi, Varanasi, Uttar Pradesh, India</p>
        </div>
      </PolicySection>
    </PolicyLayout>
  );
};

export default PrivacyPolicyPage;
