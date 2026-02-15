import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';
import PolicySection from '@/components/PolicySection';
import { CONTACT_PHONE, ADMIN_EMAIL } from '@/constants';

const CustomerServicePage: React.FC = () => {
  return (
    <PolicyLayout
      title="Customer Service"
      lastUpdated="February 15, 2026"
      currentPath="/customer-service"
    >
      <PolicySection title="How Can We Help You?" level={1}>
        <p>
          At Vinayka Rugs, we are committed to providing exceptional customer
          service. Our dedicated team is here to assist you with any questions,
          concerns, or special requests you may have about our handcrafted rugs.
        </p>
      </PolicySection>

      <PolicySection title="Contact Information" level={1}>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-text-body mb-2">Phone</h4>
              <p className="text-text-muted">
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="text-terracotta hover:underline"
                >
                  {CONTACT_PHONE}
                </a>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Mon-Sat, 9am - 7pm IST
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-text-body mb-2">Email</h4>
              <p className="text-text-muted">
                <a
                  href={`mailto:${ADMIN_EMAIL}`}
                  className="text-terracotta hover:underline break-all"
                >
                  {ADMIN_EMAIL}
                </a>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Response within 24 hours
              </p>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-semibold text-text-body mb-2">
                Visit Our Studio
              </h4>
              <p className="text-text-muted">
                Bhadohi, Varanasi
                <br />
                Uttar Pradesh, India
              </p>
              <p className="text-sm text-gray-500 mt-1">By appointment only</p>
            </div>
          </div>
        </div>
      </PolicySection>

      <PolicySection title="Rug Care & Maintenance" level={1}>
        <p>
          Proper care ensures your handcrafted rug remains beautiful for years
          to come.
        </p>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Regular Maintenance
        </h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Vacuum regularly using a suction-only vacuum (no beater bar)</li>
          <li>Rotate your rug every 6 months to ensure even wear</li>
          <li>Keep out of direct sunlight to prevent fading</li>
          <li>Use a rug pad to prevent slipping and extend rug life</li>
        </ul>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Stain Removal
        </h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Blot spills immediately with a clean, dry cloth</li>
          <li>Never rub or scrub stains</li>
          <li>Use mild soap and water for spot cleaning</li>
          <li>For stubborn stains, contact professional rug cleaners</li>
        </ul>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Professional Cleaning
        </h4>
        <p>
          We recommend professional cleaning every 1-2 years, depending on foot
          traffic. Always use cleaners experienced with handmade wool and silk
          rugs.
        </p>
      </PolicySection>

      <PolicySection title="Product Information" level={1}>
        <p>
          Have questions about our rugs? We&apos;re here to help you find the
          perfect piece for your space.
        </p>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          What We Can Help With
        </h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Product specifications and materials</li>
          <li>Custom size and color options</li>
          <li>Bespoke design consultations</li>
          <li>Interior design advice and rug selection</li>
          <li>Bulk or trade program inquiries</li>
          <li>Shipping estimates and tracking</li>
        </ul>
      </PolicySection>

      <PolicySection title="Order Assistance" level={1}>
        <p>
          Need help with your order? Our team is ready to assist you throughout
          the entire process.
        </p>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Before You Order
        </h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Request additional photos or videos of products</li>
          <li>Get size recommendations for your space</li>
          <li>Learn about our bespoke services</li>
          <li>Understand pricing and payment options</li>
        </ul>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          After You Order
        </h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Track your order status</li>
          <li>Modify shipping address (if order hasn&apos;t shipped)</li>
          <li>Request updates on custom orders</li>
          <li>Schedule delivery or pickup</li>
        </ul>
      </PolicySection>

      <PolicySection title="Support Hours" level={1}>
        <div className="bg-cream rounded-lg p-6 border border-gray-200">
          <p className="mb-4">
            <strong>Phone & Email Support:</strong> Monday - Saturday, 9:00 AM -
            7:00 PM IST
          </p>
          <p className="mb-4">
            <strong>Studio Visits:</strong> By appointment only (book 48 hours
            in advance)
          </p>
          <p>
            <strong>Response Time:</strong> We aim to respond to all inquiries
            within 24 hours during business days.
          </p>
        </div>
      </PolicySection>

      <PolicySection title="Changes to This Policy" level={1}>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          effective immediately upon posting on the Site.
        </p>
        <p className="mt-4">
          Contact us at info@vinaykarugs.com with &quot;Privacy Request&quot; in
          the subject line to exercise your data rights.
        </p>
      </PolicySection>

      <PolicySection title="Trade & Wholesale Program" level={1}>
        <p>
          Are you an interior designer, architect, or retailer? We offer special
          pricing and services for trade professionals.
        </p>
        <p className="mt-4">
          Contact us at{' '}
          <a
            href={`mailto:${ADMIN_EMAIL}`}
            className="text-terracotta hover:underline"
          >
            {ADMIN_EMAIL}
          </a>{' '}
          with &quot;Trade Program&quot; in the subject line to learn more about
          our professional services and discounts.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
};

export default CustomerServicePage;
