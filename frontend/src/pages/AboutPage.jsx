import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  MdStar,
  MdLocalShipping,
  MdSecurity,
  MdSupport,
  MdShoppingBag,
  MdTrendingUp,
  MdPeople,
  MdFavorite,
} from "react-icons/md";

const AboutPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const features = [
    {
      icon: MdLocalShipping,
      title: "Free Shipping",
      description:
        "Free delivery on orders over $50 with fast and reliable shipping worldwide.",
    },
    {
      icon: MdSecurity,
      title: "Secure Payments",
      description:
        "Your payment information is encrypted and secure with our trusted payment partners.",
    },
    {
      icon: MdSupport,
      title: "24/7 Support",
      description:
        "Our dedicated customer support team is available round the clock to assist you.",
    },
    {
      icon: MdStar,
      title: "Quality Products",
      description:
        "We carefully curate only the highest quality products from trusted brands.",
    },
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/placeholder-image.svg",
      description: "Passionate about bringing quality fashion to everyone.",
    },
    {
      name: "Michael Chen",
      role: "Head of Design",
      image: "/placeholder-image.svg",
      description: "Creative visionary with 10+ years in fashion design.",
    },
    {
      name: "Emily Davis",
      role: "Customer Experience",
      image: "/placeholder-image.svg",
      description:
        "Dedicated to ensuring every customer has an amazing experience.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Firefly</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            We're passionate about bringing you the finest collection of fashion
            and lifestyle products. Our mission is to make premium quality
            accessible to everyone, everywhere.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2020, Firefly began as a small dream to
                  revolutionize the way people shop for fashion and lifestyle
                  products. What started in a garage has now grown into a
                  trusted brand serving customers worldwide.
                </p>
                <p>
                  We believe that everyone deserves access to high-quality,
                  stylish products without breaking the bank. That's why we work
                  directly with manufacturers and designers to bring you the
                  best products at competitive prices.
                </p>
                <p>
                  Today, we're proud to serve over 50,000 happy customers and
                  continue to expand our collection with the latest trends and
                  timeless classics.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <MdShoppingBag className="text-3xl text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <MdPeople className="text-3xl text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">50K+</div>
                    <div className="text-sm text-gray-600">Customers</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <MdTrendingUp className="text-3xl text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">99%</div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <MdFavorite className="text-3xl text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">4.8</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Firefly?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We go above and beyond to ensure you have the best shopping
              experience possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-2xl text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind Firefly who work hard to bring you
              the best experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-orange-500 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do at Firefly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdStar className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality First
              </h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product goes through
                rigorous quality checks.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdPeople className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Customer Centric
              </h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. Your
                satisfaction is our priority.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdTrendingUp className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600">
                We continuously innovate to improve your shopping experience and
                product offerings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Shop with Firefly?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers and discover our amazing
            collection of products.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 bg-white text-orange-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <MdShoppingBag />
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
