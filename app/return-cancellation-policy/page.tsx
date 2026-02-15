import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';
import PolicySection from '@/components/PolicySection';

const ReturnCancellationPolicyPage: React.FC = () => {
  return (
    <PolicyLayout
      title="Return & Cancellation Policy"
      lastUpdated="February 15, 2026"
      currentPath="/return-cancellation-policy"
    >
      <PolicySection title="Overview" level={1}>
        <p>
          At Vinayka Rugs, we want you to be completely satisfied with your
          purchase. This policy outlines our return and cancellation procedures
          to ensure a smooth and transparent process for all our customers.
        </p>
      </PolicySection>

      <PolicySection title="Cancellation Policy" level={1}>
        <p>
          We understand that circumstances change. Here&apos;s how you can
          cancel your order based on the product type and order status.
        </p>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Ready-to-Ship Rugs
        </h4>
        <div className="bg-cream rounded-lg p-6 border border-gray-200">
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Within 24 hours of order:</strong> Full refund, no
              questions asked
            </li>
            <li>
              <strong>After 24 hours but before shipping:</strong> Full refund
              minus 5% processing fee
            </li>
            <li>
              <strong>After shipping:</strong> Follow our return policy (see
              below)
            </li>
          </ul>
        </div>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Made-to-Order Rugs
        </h4>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-4">
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Before production starts:</strong> Full refund
            </li>
            <li>
              <strong>Production in progress (less than 50% complete):</strong>{' '}
              50% refund
            </li>
            <li>
              <strong>Production more than 50% complete:</strong> No refund
              available
            </li>
          </ul>
        </div>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Custom/Bespoke Rugs
        </h4>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-4">
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Before design approval:</strong> Full refund
            </li>
            <li>
              <strong>After design approval:</strong> 50% deposit is
              non-refundable
            </li>
            <li>
              <strong>Once production begins:</strong> Order cannot be canceled
            </li>
          </ul>
          <p className="mt-4 text-sm text-text-muted">
            Custom rugs are made specifically to your specifications and cannot
            be resold. Therefore, cancellations after production begins are not
            possible.
          </p>
        </div>
      </PolicySection>

      <PolicySection title="How to Cancel Your Order" level={1}>
        <ol className="list-decimal list-inside space-y-3 ml-4">
          <li>
            <strong>Contact us immediately</strong> at{' '}
            <a
              href="mailto:info@vinaykarugs.com"
              className="text-terracotta hover:underline"
            >
              info@vinaykarugs.com
            </a>{' '}
            or call{' '}
            <a
              href="tel:9936169852"
              className="text-terracotta hover:underline"
            >
              9936169852
            </a>
          </li>
          <li>Provide your order number and reason for cancellation</li>
          <li>Our team will review your request and respond within 24 hours</li>
          <li>If approved, refunds are processed within 7-10 business days</li>
        </ol>
      </PolicySection>

      <PolicySection title="Return Policy" level={1}>
        <p>
          We accept returns within <strong>14 days of delivery</strong> for
          ready-to-ship rugs that meet our return conditions.
        </p>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Return Eligibility
        </h4>
        <p>To be eligible for a return, your rug must:</p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
          <li>Be in its original, unused condition</li>
          <li>Have all original tags attached</li>
          <li>Be in the original packaging</li>
          <li>Not have been unrolled or placed on the floor</li>
          <li>Have no stains, odors, pet hair, or signs of use</li>
          <li>Include proof of purchase (order confirmation or receipt)</li>
        </ul>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Non-Returnable Items
        </h4>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-4">
          <p className="font-semibold text-red-900 mb-3">
            The following items CANNOT be returned:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-red-800">
            <li>Custom or bespoke rugs made to your specifications</li>
            <li>
              Rugs that have been used, placed on floor, or unrolled completely
            </li>
            <li>Rugs with any damage, stains, or odors</li>
            <li>Rugs with altered, removed, or missing tags</li>
            <li>
              Clearance, final sale, or discounted items (unless defective)
            </li>
            <li>Rugs purchased more than 14 days ago</li>
          </ul>
        </div>
      </PolicySection>

      <PolicySection title="Return Process" level={1}>
        <p className="mb-4">Follow these steps to initiate a return:</p>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            <div>
              <h5 className="font-semibold text-text-body mb-1">Contact Us</h5>
              <p className="text-text-muted">
                Email us at info@vinaykarugs.com within 14 days of delivery with
                your order number and reason for return.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center font-semibold">
              2
            </div>
            <div>
              <h5 className="font-semibold text-text-body mb-1">
                Wait for Authorization
              </h5>
              <p className="text-text-muted">
                Our team will review your request and send you a return
                authorization number (RAN) and instructions within 24-48 hours.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center font-semibold">
              3
            </div>
            <div>
              <h5 className="font-semibold text-text-body mb-1">
                Package the Rug
              </h5>
              <p className="text-text-muted">
                Carefully repackage the rug in its original packaging. Include
                the RAN inside the package.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center font-semibold">
              4
            </div>
            <div>
              <h5 className="font-semibold text-text-body mb-1">
                Ship the Return
              </h5>
              <p className="text-text-muted">
                Use the prepaid return label we provide (for defective items) or
                ship at your own cost (for change of mind returns).
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-terracotta text-white rounded-full flex items-center justify-center font-semibold">
              5
            </div>
            <div>
              <h5 className="font-semibold text-text-body mb-1">
                Receive Your Refund
              </h5>
              <p className="text-text-muted">
                Once we receive and inspect your return, we&apos;ll process your
                refund within 7-10 business days.
              </p>
            </div>
          </div>
        </div>
      </PolicySection>

      <PolicySection title="Return Shipping Costs" level={1}>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-body border-b">
                  Reason for Return
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-text-body border-b">
                  Who Pays Shipping
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-6 py-4 text-sm text-text-muted">
                  Defective or damaged item
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  We cover all costs
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-6 py-4 text-sm text-text-muted">
                  Wrong item shipped
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  We cover all costs
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-6 py-4 text-sm text-text-muted">
                  Change of mind
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  Customer pays return shipping
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-text-muted">
                  Doesn&apos;t match description
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  We cover all costs
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </PolicySection>

      <PolicySection title="Refund Processing" level={1}>
        <p>
          Once your return is received and inspected, we will send you an email
          to notify you of the approval or rejection of your refund.
        </p>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Approved Refunds
        </h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Refunds are issued to the original payment method</li>
          <li>Processing time: 7-10 business days</li>
          <li>Bank processing may take an additional 3-5 business days</li>
          <li>
            Original shipping charges are non-refundable (except for defective
            items)
          </li>
          <li>Restocking fee of 10% may apply to change-of-mind returns</li>
        </ul>

        <h4 className="font-semibold text-text-body mt-6 mb-3">
          Rejected Refunds
        </h4>
        <p>
          Refunds may be rejected if the rug does not meet our return
          conditions. In such cases, the item will be shipped back to you at
          your expense.
        </p>
      </PolicySection>

      <PolicySection title="Damaged or Defective Items" level={1}>
        <p>If you receive a damaged or defective rug:</p>
        <ol className="list-decimal list-inside space-y-2 ml-4 mt-3">
          <li>
            <strong>Do not unpackage or unroll the rug</strong> (if damage is
            visible on packaging)
          </li>
          <li>Take photos of the packaging and damage immediately</li>
          <li>Contact us within 48 hours of delivery</li>
          <li>Provide photos and a detailed description of the issue</li>
          <li>We&apos;ll arrange for pickup at no cost to you</li>
          <li>
            Choose between a replacement or full refund (including shipping)
          </li>
        </ol>

        <p className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <strong>Important:</strong> Claims for damage must be filed within 48
          hours of delivery. We cannot accept claims after this period.
        </p>
      </PolicySection>

      <PolicySection title="Exchanges" level={1}>
        <p>
          We accept exchanges for different sizes, colors, or designs within 14
          days of delivery, subject to availability.
        </p>

        <p className="mt-4">
          The exchange process follows the same steps as returns. If
          there&apos;s a price difference between the items, we&apos;ll either
          refund the difference or request additional payment.
        </p>
      </PolicySection>

      <PolicySection title="Questions?" level={1}>
        <p>
          If you have any questions about our Return and Cancellation Policy,
          please contact us:
        </p>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-4">
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
          <p className="text-sm text-gray-500 mt-2">
            Available Monday - Saturday, 9am - 7pm IST
          </p>
        </div>
      </PolicySection>
    </PolicyLayout>
  );
};

export default ReturnCancellationPolicyPage;
