import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';
import PolicySection from '@/components/PolicySection';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <PolicyLayout
      title="Terms and Conditions"
      lastUpdated="February 15, 2026"
      currentPath="/terms-and-conditions"
    >
      <PolicySection title="Agreement to Terms" level={1}>
        <p>
          Welcome to Vinayka Rugs. By accessing our website at vinaykarugs.com
          and making a purchase, you agree to be bound by these Terms and
          Conditions ("Terms"). Please read them carefully before using our
          services.
        </p>
        <p className="mt-4">
          If you do not agree with any part of these Terms, you may not access
          our website or make purchases from us.
        </p>
      </PolicySection>

      <PolicySection title="Use of Website" level={1}>
        <p>By using our website, you warrant that:</p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>
            You are at least 18 years of age or have parental/guardian consent
          </li>
          <li>You will use the website only for lawful purposes</li>
          <li>
            You will not use the website in any way that violates applicable
            laws
          </li>
          <li>
            You will provide accurate and complete information when making
            purchases
          </li>
          <li>
            You will not attempt to interfere with the proper functioning of the
            website
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Account Registration" level={1}>
        <p>
          While you can browse our website without creating an account, certain
          features may require registration. When creating an account:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>You must provide accurate, current, and complete information</li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account credentials
          </li>
          <li>
            You are responsible for all activities that occur under your account
          </li>
          <li>
            You must notify us immediately of any unauthorized use of your
            account
          </li>
          <li>
            We reserve the right to suspend or terminate accounts that violate
            these Terms
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Products and Pricing" level={1}>
        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Product Descriptions
        </h4>
        <p>
          We strive to provide accurate descriptions, images, and specifications
          for all our handcrafted rugs. However:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>
            Colors may vary slightly due to screen settings and natural
            variations in handmade products
          </li>
          <li>
            Dimensions may vary slightly (±2-3cm) due to the handcrafted nature
            of our rugs
          </li>
          <li>
            We do not warrant that product descriptions are error-free or
            complete
          </li>
          <li>
            We reserve the right to correct errors and update information at any
            time
          </li>
        </ul>

        <h4 className="font-semibold text-text-body mt-6 mb-3">Pricing</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            All prices are listed in Indian Rupees (INR) unless otherwise stated
          </li>
          <li>Prices are subject to change without notice</li>
          <li>We reserve the right to correct pricing errors</li>
          <li>
            The price charged will be the price displayed at the time of order
            placement
          </li>
          <li>Prices do not include shipping costs unless explicitly stated</li>
        </ul>
      </PolicySection>

      <PolicySection title="Orders and Payment" level={1}>
        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Order Acceptance
        </h4>
        <p>
          Your order constitutes an offer to purchase. We reserve the right to:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>Accept or decline any order for any reason</li>
          <li>Limit quantities on certain products</li>
          <li>Refuse orders from customers with outstanding payments</li>
          <li>Cancel orders if products are unavailable</li>
        </ul>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Payment Terms
        </h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Payment is required at the time of order placement</li>
          <li>
            We accept major credit cards, debit cards, UPI, and bank transfers
          </li>
          <li>Payment processing is handled by secure third-party providers</li>
          <li>For custom/bespoke orders, a 50% deposit is required upfront</li>
          <li>Full payment is required before shipping</li>
        </ul>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Order Cancellation
        </h4>
        <p>You may cancel your order:</p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>Within 24 hours of order placement for ready-to-ship items</li>
          <li>Before production begins for custom/made-to-order rugs</li>
          <li>
            Cancellation of custom orders after production begins may incur fees
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Shipping and Delivery" level={1}>
        <p>Shipping terms are detailed in our Shipping Policy. Key points:</p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>We are not responsible for delays caused by shipping carriers</li>
          <li>Risk of loss transfers to you upon delivery</li>
          <li>You must inspect products immediately upon delivery</li>
          <li>Delivery timeframes are estimates and not guaranteed</li>
        </ul>
      </PolicySection>

      <PolicySection title="Intellectual Property" level={1}>
        <p>
          All content on our website, including but not limited to text, images,
          logos, designs, and software, is the property of Vinayka Rugs or our
          licensors and is protected by copyright, trademark, and other
          intellectual property laws.
        </p>

        <h4 className="font-semibold text-text-body mt-6 mb-3">You May Not:</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            Reproduce, distribute, or display our content without written
            permission
          </li>
          <li>Use our trademarks or trade names without authorization</li>
          <li>Copy or reverse engineer our custom rug designs</li>
          <li>
            Use automated systems to scrape or collect data from our website
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Custom and Bespoke Orders" level={1}>
        <p>
          Custom and bespoke rugs are made to your specific requirements.
          Additional terms apply:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>Design approval is required before production begins</li>
          <li>Changes after production starts may incur additional costs</li>
          <li>Production timelines are estimates and may vary</li>
          <li>
            Custom orders cannot be canceled once production begins (deposit
            non-refundable)
          </li>
          <li>
            Custom rugs are generally not eligible for return unless defective
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Warranty and Disclaimers" level={1}>
        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Product Warranty
        </h4>
        <p>
          We stand behind the quality of our handcrafted rugs. We warrant that
          our products are free from defects in materials and craftsmanship
          under normal use.
        </p>

        <h4 className="font-semibold text-text-body mt-6 mb-3">Disclaimers</h4>
        <p className="mb-3">TO THE FULLEST EXTENT PERMITTED BY LAW:</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            Our website and products are provided "as is" without warranties of
            any kind
          </li>
          <li>
            We do not warrant that the website will be uninterrupted or
            error-free
          </li>
          <li>
            We disclaim all warranties, express or implied, including
            merchantability and fitness for a particular purpose
          </li>
          <li>Natural variations in handmade products are not defects</li>
        </ul>
      </PolicySection>

      <PolicySection title="Limitation of Liability" level={1}>
        <p>
          To the maximum extent permitted by law, Vinayka Rugs shall not be
          liable for:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>Indirect, incidental, special, or consequential damages</li>
          <li>Loss of profits, revenue, or business opportunities</li>
          <li>Damages exceeding the amount you paid for the product</li>
          <li>Delays or failures caused by circumstances beyond our control</li>
        </ul>
      </PolicySection>

      <PolicySection title="Indemnification" level={1}>
        <p>
          You agree to indemnify and hold harmless Vinayka Rugs, its officers,
          employees, and agents from any claims, damages, or expenses arising
          from:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>Your use of our website or products</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any third-party rights</li>
        </ul>
      </PolicySection>

      <PolicySection title="Governing Law and Disputes" level={1}>
        <p>
          These Terms are governed by the laws of India. Any disputes arising
          from these Terms or your use of our website shall be subject to the
          exclusive jurisdiction of the courts in Varanasi, Uttar Pradesh,
          India.
        </p>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Dispute Resolution
        </h4>
        <p>
          Before initiating legal proceedings, we encourage you to contact us to
          resolve any disputes informally. We are committed to working with you
          to find a fair resolution.
        </p>
      </PolicySection>

      <PolicySection title="Changes to Terms" level={1}>
        <p>
          We reserve the right to modify these Terms at any time. Changes will
          be effective immediately upon posting on our website. Your continued
          use of our website after changes are posted constitutes your
          acceptance of the modified Terms.
        </p>
        <p className="mt-4">
          Material changes will be communicated through prominent notice on our
          website or via email to registered users.
        </p>
      </PolicySection>

      <PolicySection title="Severability" level={1}>
        <p>
          If any provision of these Terms is found to be invalid or
          unenforceable, the remaining provisions shall continue in full force
          and effect.
        </p>
      </PolicySection>

      <PolicySection title="Contact Information" level={1}>
        <p>
          For questions or concerns about these Terms and Conditions, please
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

export default TermsAndConditionsPage;
