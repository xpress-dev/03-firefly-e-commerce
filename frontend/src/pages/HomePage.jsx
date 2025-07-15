import BestSellers from "../components/BestSellers";
import Hero from "../components/Hero";
import LatestProducts from "../components/LatestProducts";
import Policy from "../components/Policy";
const HomePage = () => {
  return (
    <div>
      <Hero />
      <BestSellers />
      <LatestProducts />
      <Policy />
    </div>
  );
};

export default HomePage;
