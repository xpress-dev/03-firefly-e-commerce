import BestSellers from "../components/BestSellers";
import Hero from "../components/Hero";
import LatestProducts from "../components/LatestProducts";
import Policy from "../components/Policy";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="mb-16">
        <Hero />
      </section>

      {/* Best Sellers Section */}
      <section className="mb-20">
        <div className="container mx-auto">
          <BestSellers />
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="mb-20 bg-gray-50 py-16">
        <div className="container mx-auto">
          <LatestProducts />
        </div>
      </section>

      {/* Policy Section */}
      <section className="mb-16">
        <div className="container mx-auto">
          <Policy />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
