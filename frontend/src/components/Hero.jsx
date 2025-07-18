import { Link } from "react-router-dom";
import { MdArrowRightAlt, MdStar } from "react-icons/md";

const Hero = () => {
  return (
    <section className="hero relative overflow-hidden">
      <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] mt-2 group">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483181957632-8bda974cbc91?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat rounded-2xl transition-all duration-1000 ease-in-out group-hover:bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
          <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          {/* Hero Text Content */}
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <MdStar key={i} className="text-xl" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-200">
                Trusted by 50,000+ customers
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Perfect Style
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Explore our curated collection of premium fashion, accessories,
              and lifestyle products. From trending styles to timeless classics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                to="/collections"
                className="bg-white text-black py-3 px-8 text-lg font-semibold rounded-full flex gap-2 items-center hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Shop Now <MdArrowRightAlt className="text-2xl" />
              </Link>

              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-300">
                  Free shipping on orders over $100
                </p>
                <p className="text-sm text-gray-300">30-day return guarantee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating CTA Button (Bottom Right) */}
        <Link
          to="/collections"
          className="absolute bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-full font-semibold flex gap-2 items-center hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-xl z-20"
        >
          Browse Collections <MdArrowRightAlt className="text-xl" />
        </Link>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-yellow-400/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-16 w-12 h-12 bg-orange-400/20 rounded-full blur-md animate-pulse delay-500"></div>
      </div>
    </section>
  );
};

export default Hero;
