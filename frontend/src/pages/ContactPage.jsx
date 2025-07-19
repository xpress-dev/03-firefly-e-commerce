import { useState, useEffect } from "react";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdAccessTime,
  MdSend,
  MdCheckCircle,
  MdSupport,
  MdFeedback,
  MdBusiness,
} from "react-icons/md";

const ContactPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: MdEmail,
      title: "Email Us",
      description: "Send us an email anytime",
      contact: "support@firefly.com",
      link: "mailto:support@firefly.com",
    },
    {
      icon: MdPhone,
      title: "Call Us",
      description: "Mon-Fri from 8am to 5pm",
      contact: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: MdLocationOn,
      title: "Visit Us",
      description: "Come say hello at our office",
      contact: "123 Firefly Lane, E-commerce City, EC 12345",
      link: "https://maps.google.com",
    },
    {
      icon: MdAccessTime,
      title: "Business Hours",
      description: "Our support hours",
      contact: "Mon-Fri: 8am-5pm PST\nSat-Sun: 10am-3pm PST",
      link: null,
    },
  ];

  const supportTopics = [
    {
      icon: MdSupport,
      title: "Customer Support",
      description: "Get help with orders, returns, and account issues",
    },
    {
      icon: MdBusiness,
      title: "Business Inquiries",
      description: "Partnership opportunities and wholesale inquiries",
    },
    {
      icon: MdFeedback,
      title: "Feedback",
      description: "Share your thoughts on how we can improve",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Have a question, suggestion, or need support? We'd love to hear from
            you! Get in touch with our friendly team.
          </p>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Get In Touch
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="text-xl text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {info.description}
                      </p>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-orange-500 hover:text-orange-600 font-medium"
                        >
                          {info.contact}
                        </a>
                      ) : (
                        <p className="text-gray-900 font-medium whitespace-pre-line">
                          {info.contact}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Support Topics */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  What can we help you with?
                </h3>
                <div className="space-y-4">
                  {supportTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <topic.icon className="text-lg text-orange-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          {topic.title}
                        </h4>
                        <p className="text-gray-600 text-xs mt-1">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>

                {isSubmitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <MdCheckCircle className="text-green-500" />
                      <p className="text-green-700 font-medium">
                        Thank you for your message! We'll get back to you soon.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Support</option>
                      <option value="return">Returns & Refunds</option>
                      <option value="product">Product Inquiry</option>
                      <option value="technical">Technical Issue</option>
                      <option value="business">Business Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 focus:ring-4 focus:ring-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <MdSend />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">
                How long does shipping take?
              </h3>
              <p className="text-gray-600">
                Standard shipping takes 3-5 business days. Express shipping is
                available for 1-2 business days delivery.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">
                What is your return policy?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day return policy for unused items in original
                condition. Return shipping is free for exchanges.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">
                Do you ship internationally?
              </h3>
              <p className="text-gray-600">
                Yes, we ship to over 50 countries worldwide. International
                shipping costs and delivery times vary by location.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">
                How can I track my order?
              </h3>
              <p className="text-gray-600">
                Once your order ships, you'll receive a tracking number via
                email. You can also track orders in your account dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
