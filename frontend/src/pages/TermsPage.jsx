import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MdArrowBack,
  MdGavel,
  MdSecurity,
  MdShoppingBag,
} from "react-icons/md";

const TermsPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4 cursor-pointer"
          >
            <MdArrowBack />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <MdGavel className="text-3xl text-orange-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Terms and Conditions
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Last updated: July 19, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MdSecurity className="text-xl text-orange-600" />
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Firefly E-commerce. These Terms and Conditions
              ("Terms") govern your use of our website and services. By
              accessing or using our platform, you agree to be bound by these
              Terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please read these Terms carefully before using our services. If
              you do not agree with any part of these Terms, you may not use our
              services.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Account Registration
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>• You must be at least 18 years old to create an account</p>
              <p>
                • You are responsible for maintaining the confidentiality of
                your account credentials
              </p>
              <p>
                • You must provide accurate and complete information during
                registration
              </p>
              <p>
                • You are responsible for all activities that occur under your
                account
              </p>
              <p>
                • You must notify us immediately of any unauthorized use of your
                account
              </p>
            </div>
          </section>

          {/* Products and Orders */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MdShoppingBag className="text-xl text-orange-600" />
              3. Products and Orders
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                • All product descriptions, images, and prices are subject to
                change without notice
              </p>
              <p>
                • We reserve the right to limit quantities and refuse orders at
                our discretion
              </p>
              <p>• Orders are subject to acceptance and product availability</p>
              <p>
                • Prices displayed are in USD and include applicable taxes where
                required
              </p>
              <p>• We reserve the right to correct pricing errors</p>
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Payment Terms
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>• Payment is required at the time of purchase</p>
              <p>
                • We accept major credit cards and other payment methods as
                displayed
              </p>
              <p>
                • All transactions are processed securely through our payment
                partners
              </p>
              <p>
                • You authorize us to charge your payment method for all
                purchases
              </p>
              <p>• Refunds will be processed according to our Return Policy</p>
            </div>
          </section>

          {/* Shipping and Delivery */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Shipping and Delivery
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                • Shipping costs and delivery times vary based on location and
                shipping method
              </p>
              <p>
                • We are not responsible for delays caused by shipping carriers
              </p>
              <p>
                • Risk of loss transfers to you upon delivery to the carrier
              </p>
              <p>
                • You must inspect packages upon delivery and report damage
                immediately
              </p>
              <p>• Delivery times are estimates and not guaranteed</p>
            </div>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. User Conduct
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>You agree not to:</p>
              <p>• Use our platform for any unlawful purpose</p>
              <p>• Interfere with or disrupt our services</p>
              <p>• Attempt to gain unauthorized access to our systems</p>
              <p>• Submit false or misleading information</p>
              <p>• Violate any applicable laws or regulations</p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content on our platform, including text, images, logos, and
              software, is owned by Firefly E-commerce or our licensors and is
              protected by copyright and other intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You may not reproduce, distribute, or create derivative works from
              our content without express written permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the fullest extent permitted by law, Firefly E-commerce shall
              not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising out of your use of our
              services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our total liability for any claim shall not exceed the amount paid
              by you for the specific product or service giving rise to the
              claim.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Termination
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to terminate or suspend your account at any
              time, with or without cause, including if we believe you have
              violated these Terms. You may also terminate your account at any
              time by contacting us.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes
              will be effective immediately upon posting. Your continued use of
              our services constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                Email: legal@firefly-ecommerce.com
              </p>
              <p className="text-gray-700">Phone: +1 (123) 456-7890</p>
              <p className="text-gray-700">
                Address: 123 Firefly Lane, E-commerce City, EC 12345
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
