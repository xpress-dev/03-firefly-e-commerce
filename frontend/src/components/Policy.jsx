import { RiExchangeFundsFill } from "react-icons/ri";
import {
  MdOutlinePriceCheck,
  MdLocalShipping,
  MdSecurity,
  MdPayment,
  MdShield,
} from "react-icons/md";
import { BiSupport, BiAward } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi2";

const Policy = () => {
  const policies = [
    {
      icon: <MdLocalShipping className="text-4xl text-blue-600" />,
      title: "Free Shipping",
      description: "Free delivery on orders over $100",
      color: "white",
      bgColor: "bg-blue-50",
      delay: "0ms",
    },
    {
      icon: <RiExchangeFundsFill className="text-4xl text-green-600" />,
      title: "Easy Exchange",
      description: "Hassle-free exchange within 30 days",
      color: "white",
      bgColor: "bg-green-50",
      delay: "100ms",
    },
    {
      icon: <MdOutlinePriceCheck className="text-4xl text-purple-600" />,
      title: "Best Price",
      description: "Competitive prices with price match guarantee",
      color: "white",
      bgColor: "bg-purple-50",
      delay: "200ms",
    },
    {
      icon: <BiSupport className="text-4xl text-orange-600" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service",
      color: "white",
      bgColor: "bg-orange-50",
      delay: "300ms",
    },
    {
      icon: <MdSecurity className="text-4xl text-red-600" />,
      title: "Secure Payment",
      description: "Your payment information is safe with us",
      color: "white",
      bgColor: "bg-red-50",
      delay: "400ms",
    },
    {
      icon: <BiAward className="text-4xl text-indigo-600" />,
      title: "Quality Guarantee",
      description: "Premium quality products only",
      color: "white",
      bgColor: "bg-indigo-50",
      delay: "500ms",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <HiSparkles className="text-3xl text-yellow-500" />
            <h2 className="oswald-font text-3xl sm:text-4xl font-bold text-gray-900">
              Why Choose Us?
            </h2>
            <HiSparkles className="text-3xl text-yellow-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We're committed to providing you with the best shopping experience
            and customer service
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {policies.map((policy, index) => (
            <div
              key={index}
              className={`group ${policy.bgColor} p-8 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 transform`}
              style={{
                animationDelay: policy.delay,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              {/* Icon Container */}
              <div className="flex justify-center mb-6">
                <div
                  className={`p-4 rounded-full bg-gradient-to-r ${policy.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {policy.icon}
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-3">
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-gray-700 transition-colors">
                  {policy.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {policy.description}
                </p>
              </div>

              {/* Hover Effect Line */}
              <div
                className={`mt-6 h-1 bg-gradient-to-r ${policy.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
              ></div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <MdShield className="text-2xl text-green-600" />
                <span className="font-medium">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <MdPayment className="text-2xl text-blue-600" />
                <span className="font-medium">Multiple Payment Options</span>
              </div>
              <div className="flex items-center gap-2">
                <BiAward className="text-2xl text-purple-600" />
                <span className="font-medium">
                  Trusted by 50,000+ Customers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Policy;
