import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';
import PolicySection from '@/components/PolicySection';

const ShippingReturnsExchangePage: React.FC = () => {
  return (
    <PolicyLayout
      title="Shipping, Returns & Exchange"
      lastUpdated="February 15, 2026"
      currentPath="/shipping-returns-exchange"
    >
      <PolicySection title="Shipping Policy" level={1}>
        <p>
          We take great care in packaging and shipping your handcrafted rugs to
          ensure they arrive in perfect condition. All rugs are carefully
          rolled, wrapped, and protected for transit.
        </p>
      </PolicySection>

      <PolicySection title="Shipping Methods & Timelines" level={1}>
        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Domestic Shipping (Within India)
        </h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>Standard Shipping:</strong> 5-7 business days
          </li>
          <li>
            <strong>Express Shipping:</strong> 2-3 business days
          </li>
          <li>
            <strong>Same-Day Delivery:</strong> Available in select cities
            (Varanasi, Delhi, Mumbai)
          </li>
        </ul>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          International Shipping
        </h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>Standard International:</strong> 10-15 business days
          </li>
          <li>
            <strong>Express International:</strong> 5-7 business days
          </li>
          <li>We ship to most countries worldwide</li>
          <li>
            Custom duties and import taxes are the responsibility of the buyer
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Shipping Costs" level={1}>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <p className="mb-4">Shipping costs are calculated based on:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Rug size and weight</li>
            <li>Delivery location</li>
            <li>Shipping method selected</li>
          </ul>
          <p className="mt-4">
            <strong>Free Shipping:</strong> Available on all orders above
            ₹50,000 within India
          </p>
        </div>
      </PolicySection>

      <PolicySection title="Order Processing Time" level={1}>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>Ready-to-Ship Rugs:</strong> Ships within 1-2 business days
          </li>
          <li>
            <strong>Custom/Bespoke Orders:</strong> 6-12 weeks production time,
            plus shipping
          </li>
          <li>
            <strong>Made-to-Order Rugs:</strong> 4-8 weeks production time, plus
            shipping
          </li>
        </ul>
        <p className="mt-4">
          You will receive email confirmation with tracking information once
          your order ships.
        </p>
      </PolicySection>

      <PolicySection title="Return Policy" level={1}>
        <p>
          We want you to love your rug! If you're not completely satisfied, we
          accept returns within <strong>14 days</strong> of delivery.
        </p>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Return Conditions
        </h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Rug must be in original, unused condition</li>
          <li>All tags and packaging must be intact</li>
          <li>Rug must not have been unrolled or placed on the floor</li>
          <li>No stains, odors, pet hair, or signs of use</li>
          <li>Original receipt or proof of purchase required</li>
        </ul>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Non-Returnable Items
        </h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Custom or bespoke rugs made to your specifications</li>
          <li>Rugs that have been cut, altered, or modified</li>
          <li>Clearance or final sale items</li>
          <li>Rugs purchased more than 14 days ago</li>
        </ul>
      </PolicySection>

      <PolicySection title="How to Initiate a Return" level={1}>
        <div className="bg-cream rounded-lg p-6 border border-gray-200">
          <ol className="list-decimal list-inside space-y-3 ml-4">
            <li>
              Contact us at info@vinaykarugs.com within 14 days of delivery
            </li>
            <li>Provide your order number and reason for return</li>
            <li>Wait for return authorization and instructions</li>
            <li>Carefully repackage the rug in original packaging</li>
            <li>Ship the rug back using the provided return label</li>
            <li>
              Receive your refund within 7-10 business days after we receive the
              return
            </li>
          </ol>
        </div>
      </PolicySection>

      <PolicySection title="Return Shipping Costs" level={1}>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>Defective or Damaged Items:</strong> We cover all return
            shipping costs
          </li>
          <li>
            <strong>Change of Mind:</strong> Customer is responsible for return
            shipping costs
          </li>
          <li>
            <strong>Wrong Item Shipped:</strong> We cover all return shipping
            costs
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Exchange Policy" level={1}>
        <p>
          We're happy to exchange your rug for a different size, color, or
          design within 14 days of delivery, subject to availability.
        </p>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Exchange Process
        </h4>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Contact us to discuss exchange options</li>
          <li>Return the original rug following our return process</li>
          <li>
            Once we receive and inspect the return, we'll ship your exchange
          </li>
          <li>
            If there's a price difference, we'll either refund or charge
            accordingly
          </li>
        </ol>

        <p className="mt-4">
          <strong>Note:</strong> Exchange shipping costs follow the same policy
          as returns.
        </p>
      </PolicySection>

      <PolicySection title="Damaged or Defective Items" level={1}>
        <p>
          While we carefully inspect all rugs before shipping, if you receive a
          damaged or defective item:
        </p>

        <ol className="list-decimal list-inside space-y-2 ml-4 mt-4">
          <li>Contact us immediately (within 48 hours of delivery)</li>
          <li>Provide photos of the damage and packaging</li>
          <li>We'll arrange for pickup at no cost to you</li>
          <li>Choose a replacement or full refund</li>
        </ol>

        <p className="mt-4">
          We stand behind the quality of our craftsmanship and will make it
          right.
        </p>
      </PolicySection>

      <PolicySection title="Refund Processing" level={1}>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Refunds are processed within 7-10 business days of receiving the
              return
            </li>
            <li>Refunds are issued to the original payment method</li>
            <li>
              Original shipping charges are non-refundable (except for defective
              items)
            </li>
            <li>
              You'll receive an email confirmation once your refund is processed
            </li>
          </ul>
        </div>
      </PolicySection>

      <PolicySection title="Questions?" level={1}>
        <p>
          If you have any questions about shipping, returns, or exchanges,
          please don't hesitate to contact us at{' '}
          <a
            href="mailto:info@vinaykarugs.com"
            className="text-terracotta hover:underline"
          >
            info@vinaykarugs.com
          </a>{' '}
          or call us at{' '}
          <a href="tel:9936169852" className="text-terracotta hover:underline">
            9936169852
          </a>
          .
        </p>
      </PolicySection>
    </PolicyLayout>
  );
};

export default ShippingReturnsExchangePage;
