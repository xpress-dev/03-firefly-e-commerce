import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MdArrowBack,
  MdPrivacyTip,
  MdSecurity,
  MdCookie,
  MdEmail,
} from "react-icons/md";

const PrivacyPage = () => {
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
            <MdPrivacyTip className="text-3xl text-orange-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Privacy Policy
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
              At Firefly E-commerce, we are committed to protecting your privacy
              and ensuring the security of your personal information. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our website and services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our services, you consent to the collection and use of
              information as described in this Privacy Policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Personal Information
            </h3>
            <div className="space-y-2 text-gray-700 mb-4">
              <p>• Name and contact information (email, phone, address)</p>
              <p>• Account credentials (username, password)</p>
              <p>
                • Payment information (credit card details, billing address)
              </p>
              <p>• Order history and purchase preferences</p>
              <p>• Shipping and billing addresses</p>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Usage Information
            </h3>
            <div className="space-y-2 text-gray-700 mb-4">
              <p>• Pages visited and time spent on our site</p>
              <p>• Search queries and browsing behavior</p>
              <p>
                • Device information (IP address, browser type, operating
                system)
              </p>
              <p>• Location data (if enabled)</p>
              <p>• Cookies and similar tracking technologies</p>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MdEmail className="text-xl text-orange-600" />
              3. How We Use Your Information
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>We use your information to:</p>
              <p>• Process and fulfill your orders</p>
              <p>• Manage your account and provide customer service</p>
              <p>• Send order confirmations and shipping updates</p>
              <p>• Personalize your shopping experience</p>
              <p>• Improve our website and services</p>
              <p>• Send marketing communications (with your consent)</p>
              <p>• Prevent fraud and ensure security</p>
              <p>• Comply with legal obligations</p>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Information Sharing and Disclosure
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>We may share your information with:</p>
              <p>
                • <strong>Service Providers:</strong> Third-party companies that
                help us operate our business (payment processors, shipping
                companies, marketing platforms)
              </p>
              <p>
                • <strong>Business Partners:</strong> Trusted partners who
                provide complementary services
              </p>
              <p>
                • <strong>Legal Requirements:</strong> When required by law or
                to protect our rights
              </p>
              <p>
                • <strong>Business Transfers:</strong> In connection with a
                merger, acquisition, or sale of assets
              </p>
              <p>
                • <strong>With Consent:</strong> Any other sharing with your
                explicit consent
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              We do not sell, rent, or trade your personal information to third
              parties for their marketing purposes.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MdCookie className="text-xl text-orange-600" />
              5. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies, web beacons, and similar technologies to enhance
              your browsing experience, analyze site traffic, and understand
              user preferences.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Types of Cookies We Use
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                • <strong>Essential Cookies:</strong> Required for basic site
                functionality
              </p>
              <p>
                • <strong>Performance Cookies:</strong> Help us understand how
                visitors use our site
              </p>
              <p>
                • <strong>Functional Cookies:</strong> Remember your preferences
                and settings
              </p>
              <p>
                • <strong>Marketing Cookies:</strong> Used to deliver relevant
                advertisements
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mt-4">
              You can control cookies through your browser settings, but
              disabling certain cookies may affect site functionality.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction.
            </p>
            <div className="space-y-2 text-gray-700">
              <p>• SSL encryption for data transmission</p>
              <p>• Secure servers and firewalls</p>
              <p>• Regular security audits and updates</p>
              <p>
                • Limited access to personal information on a need-to-know basis
              </p>
              <p>• Employee training on data protection</p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your personal information only as long as necessary to
              fulfill the purposes for which it was collected, comply with legal
              obligations, resolve disputes, and enforce agreements.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You may request deletion of your account and associated data at
              any time, subject to applicable legal requirements.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Your Privacy Rights
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Depending on your location, you may have the right to:</p>
              <p>• Access the personal information we hold about you</p>
              <p>• Correct inaccurate or incomplete information</p>
              <p>• Delete your personal information</p>
              <p>• Restrict processing of your information</p>
              <p>
                • Data portability (receive your data in a structured format)
              </p>
              <p>• Object to processing for marketing purposes</p>
              <p>• Withdraw consent where processing is based on consent</p>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, please contact us using the information
              provided below.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Third-Party Links
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices or content of these external
              sites. We encourage you to review the privacy policies of any
              third-party sites you visit.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not directed to children under 13 years of age.
              We do not knowingly collect personal information from children
              under 13. If you are a parent or guardian and believe your child
              has provided us with personal information, please contact us to
              request deletion.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page with a new effective date. We encourage you to review
              this Privacy Policy periodically.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our privacy
              practices, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                Email: privacy@firefly-ecommerce.com
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

export default PrivacyPage;
