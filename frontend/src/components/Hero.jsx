import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MdStar,
  MdLocalShipping,
  MdSecurity,
  MdSwapHoriz,
} from "react-icons/md";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Section */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Trust Badge */}
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.3 + i * 0.1,
                      type: "spring",
                      damping: 15,
                    }}
                  >
                    <MdStar className="text-lg" />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">
                Trusted by 50,000+ customers
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Discover Your
              <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Perfect Style
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Explore our curated collection of premium fashion, accessories,
              and lifestyle products. From trending styles to timeless classics,
              find your unique expression.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Link
                to="/collections"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 text-lg font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 group"
              >
                Shop Now
                <motion.div
                  className="group-hover:translate-x-1 transition-transform duration-300"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  →
                </motion.div>
              </Link>
            </motion.div>

            {/* Features */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                <MdLocalShipping className="text-orange-500 text-lg" />
                <span>Free shipping over $100</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                <MdSecurity className="text-orange-500 text-lg" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600">
                <MdSwapHoriz className="text-orange-500 text-lg" />
                <span>30-day returns</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="relative">
              {/* Main Image */}
              <motion.div
                className="relative bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1483181957632-8bda974cbc91?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Fashion Collection"
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg p-4"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.2, type: "spring", damping: 15 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <MdStar className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">4.9/5</div>
                    <div className="text-sm text-gray-600">Customer Rating</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4"
                initial={{ scale: 0, rotate: 10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.4, type: "spring", damping: 15 }}
              >
                <div className="text-center">
                  <div className="font-bold text-gray-900 text-lg">10K+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-200 rounded-full blur-3xl opacity-20"></div>
    </section>
  );
};

export default Hero;
